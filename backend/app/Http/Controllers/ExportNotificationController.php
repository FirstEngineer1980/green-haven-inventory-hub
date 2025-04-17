<?php

namespace App\Http\Controllers;

use App\Models\ExportLog;
use App\Models\User;
use App\Services\EmailService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;

class ExportNotificationController extends Controller
{
    protected $emailService;

    /**
     * Create a new controller instance.
     *
     * @param EmailService $emailService
     */
    public function __construct(EmailService $emailService)
    {
        $this->emailService = $emailService;
    }

    /**
     * Log an export operation and send notifications.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'type' => 'required|string',
            'filename' => 'required|string',
            'exportedBy' => 'required|string',
            'exportedAt' => 'required|date',
            'recordCount' => 'required|integer',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 422);
        }

        // Log the export
        $exportLog = ExportLog::create([
            'type' => $request->type,
            'filename' => $request->filename,
            'exported_by' => $request->exportedBy,
            'exported_at' => $request->exportedAt,
            'record_count' => $request->recordCount,
        ]);

        // Get the user who performed the export
        $user = User::find($request->exportedBy);

        if (!$user) {
            return response()->json(['error' => 'User not found'], 404);
        }

        // Get admin users for notifications
        $admins = User::whereIn('role', ['admin', 'super_admin'])->get();

        // Send email notification to admins and the user who performed the export
        $exportData = [
            'type' => $this->getExportTypeName($request->type),
            'filename' => $request->filename,
            'user' => $user->name,
            'date' => date('Y-m-d H:i:s', strtotime($request->exportedAt)),
            'recordCount' => $request->recordCount,
        ];

        // Send to admins
        foreach ($admins as $admin) {
            // Skip if admin is the same as the exporter
            if ($admin->id == $user->id) {
                continue;
            }

            $this->emailService->send(
                $admin->email,
                'Data Export Notification',
                'emails.export_notification',
                $exportData
            );
        }

        // Send to the user who performed the export
        $this->emailService->send(
            $user->email,
            'Your Data Export Confirmation',
            'emails.export_confirmation',
            $exportData
        );

        return response()->json([
            'data' => $exportLog,
            'message' => 'Export logged and notifications sent successfully'
        ], 201);
    }

    /**
     * Get a readable name for the export type.
     *
     * @param string $type
     * @return string
     */
    private function getExportTypeName($type)
    {
        switch ($type) {
            case 'products':
                return 'Products';
            case 'customers':
                return 'Customers';
            case 'movements':
                return 'Stock Movements';
            case 'users':
                return 'Users';
            default:
                return ucfirst($type);
        }
    }
}
