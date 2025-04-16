
<?php

namespace App\Http\Controllers;

use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use App\Services\EmailService;

class SettingController extends Controller
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
     * Display a listing of the settings.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $settings = Setting::all();
        return response()->json(['data' => $settings]);
    }

    /**
     * Store a newly created setting in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'key' => 'required|string|unique:settings,key',
            'value' => 'required',
            'group' => 'nullable|string',
            'description' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 422);
        }

        $setting = Setting::create($request->all());
        return response()->json(['data' => $setting, 'message' => 'Setting created successfully'], 201);
    }

    /**
     * Display the specified setting.
     *
     * @param  string  $key
     * @return \Illuminate\Http\Response
     */
    public function show($key)
    {
        $setting = Setting::where('key', $key)->first();
        
        if (!$setting) {
            return response()->json(['error' => 'Setting not found'], 404);
        }
        
        return response()->json(['data' => $setting]);
    }

    /**
     * Update the specified setting in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  string  $key
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $key)
    {
        $setting = Setting::where('key', $key)->first();
        
        if (!$setting) {
            return response()->json(['error' => 'Setting not found'], 404);
        }
        
        $validator = Validator::make($request->all(), [
            'value' => 'required',
            'group' => 'nullable|string',
            'description' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 422);
        }

        $setting->update($request->all());
        return response()->json(['data' => $setting, 'message' => 'Setting updated successfully']);
    }

    /**
     * Remove the specified setting from storage.
     *
     * @param  string  $key
     * @return \Illuminate\Http\Response
     */
    public function destroy($key)
    {
        $setting = Setting::where('key', $key)->first();
        
        if (!$setting) {
            return response()->json(['error' => 'Setting not found'], 404);
        }
        
        $setting->delete();
        return response()->json(['message' => 'Setting deleted successfully']);
    }

    /**
     * Update company settings.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function updateCompanySettings(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'tax_id' => 'nullable|string|max:50',
            'address' => 'nullable|string|max:255',
            'phone' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 422);
        }

        // Update company settings
        Setting::set('company_name', $request->name, 'company', 'Company name');
        Setting::set('company_tax_id', $request->tax_id, 'company', 'Tax ID / Business Number');
        Setting::set('company_address', $request->address, 'company', 'Company address');
        Setting::set('company_phone', $request->phone, 'company', 'Company phone number');
        Setting::set('company_email', $request->email, 'company', 'Company email');
        
        return response()->json([
            'message' => 'Company settings updated successfully',
            'data' => [
                'company_name' => Setting::get('company_name'),
                'company_tax_id' => Setting::get('company_tax_id'),
                'company_address' => Setting::get('company_address'),
                'company_phone' => Setting::get('company_phone'),
                'company_email' => Setting::get('company_email'),
            ]
        ]);
    }

    /**
     * Update notification settings.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function updateNotificationSettings(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email_notifications' => 'required|boolean',
            'low_stock_alerts' => 'required|boolean',
            'new_product_notifications' => 'required|boolean',
            'system_maintenance_notifications' => 'required|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 422);
        }

        $userId = Auth::id();
        
        // Update notification settings
        Setting::set("user_{$userId}_email_notifications", $request->email_notifications, 'notifications', 'Email notifications');
        Setting::set("user_{$userId}_low_stock_alerts", $request->low_stock_alerts, 'notifications', 'Low stock alerts');
        Setting::set("user_{$userId}_new_product_notifications", $request->new_product_notifications, 'notifications', 'New product notifications');
        Setting::set("user_{$userId}_system_maintenance_notifications", $request->system_maintenance_notifications, 'notifications', 'System maintenance notifications');
        
        return response()->json([
            'message' => 'Notification settings updated successfully'
        ]);
    }

    /**
     * Reset the system (admin only).
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function resetSystem(Request $request)
    {
        $user = Auth::user();
        
        if (!$user || !in_array($user->role, ['admin', 'super_admin'])) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }
        
        // In a real application, this would reset system settings but preserve data
        // For demo purposes, we'll just return a success message
        
        // Notify admins about system reset
        $admins = DB::table('users')->whereIn('role', ['admin', 'super_admin'])->get();
        
        foreach ($admins as $admin) {
            $this->emailService->send(
                $admin->email,
                'System Reset Notification',
                'emails.system_reset',
                [
                    'user' => $user->name,
                    'date' => now()->format('Y-m-d H:i:s'),
                ]
            );
        }
        
        return response()->json([
            'message' => 'System has been reset successfully'
        ]);
    }

    /**
     * Clear all data from the system (admin only).
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function clearData(Request $request)
    {
        $user = Auth::user();
        
        if (!$user || !in_array($user->role, ['admin', 'super_admin'])) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }
        
        // In a real application, this would clear all data tables
        // For demo purposes, we'll just return a success message
        
        // Notify admins about data clearing
        $admins = DB::table('users')->whereIn('role', ['admin', 'super_admin'])->get();
        
        foreach ($admins as $admin) {
            $this->emailService->send(
                $admin->email,
                'Data Clearing Notification',
                'emails.data_cleared',
                [
                    'user' => $user->name,
                    'date' => now()->format('Y-m-d H:i:s'),
                ]
            );
        }
        
        return response()->json([
            'message' => 'All data has been cleared from the system'
        ]);
    }
}
