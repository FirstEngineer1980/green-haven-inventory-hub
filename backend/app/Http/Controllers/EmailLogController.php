
<?php

namespace App\Http\Controllers;

use App\Models\EmailLog;
use Illuminate\Http\Request;

class EmailLogController extends Controller
{
    /**
     * Display a listing of email logs.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $query = EmailLog::query()->orderBy('created_at', 'desc');
        
        // Filter by status if provided
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }
        
        // Filter by date range if provided
        if ($request->has('from_date')) {
            $query->whereDate('created_at', '>=', $request->from_date);
        }
        
        if ($request->has('to_date')) {
            $query->whereDate('created_at', '<=', $request->to_date);
        }
        
        $perPage = $request->per_page ?? 15;
        $emailLogs = $query->paginate($perPage);
        
        return response()->json(['data' => $emailLogs]);
    }

    /**
     * Display the specified email log.
     *
     * @param  \App\Models\EmailLog  $emailLog
     * @return \Illuminate\Http\Response
     */
    public function show(EmailLog $emailLog)
    {
        return response()->json(['data' => $emailLog]);
    }

    /**
     * Remove the specified email log from storage.
     *
     * @param  \App\Models\EmailLog  $emailLog
     * @return \Illuminate\Http\Response
     */
    public function destroy(EmailLog $emailLog)
    {
        $emailLog->delete();
        return response()->json(['message' => 'Email log deleted successfully']);
    }

    /**
     * Clear all email logs.
     *
     * @return \Illuminate\Http\Response
     */
    public function clearAll()
    {
        EmailLog::truncate();
        return response()->json(['message' => 'All email logs cleared successfully']);
    }
}
