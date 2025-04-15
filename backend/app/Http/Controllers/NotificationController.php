
<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class NotificationController extends Controller
{
    /**
     * Display a listing of the user's notifications.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $notifications = Notification::where('user_id', Auth::id())
            ->orderBy('created_at', 'desc')
            ->get();
            
        return response()->json(['data' => $notifications]);
    }

    /**
     * Mark a notification as read.
     *
     * @param  \App\Models\Notification  $notification
     * @return \Illuminate\Http\Response
     */
    public function markAsRead(Notification $notification)
    {
        // Check if notification belongs to the authenticated user
        if ($notification->user_id !== Auth::id()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }
        
        $notification->update(['read' => true]);
        return response()->json(['message' => 'Notification marked as read']);
    }

    /**
     * Mark all notifications as read for the authenticated user.
     *
     * @return \Illuminate\Http\Response
     */
    public function markAllAsRead()
    {
        Notification::where('user_id', Auth::id())
            ->where('read', false)
            ->update(['read' => true]);
            
        return response()->json(['message' => 'All notifications marked as read']);
    }

    /**
     * Create a new notification.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string',
            'message' => 'required|string',
            'type' => 'required|string',
            'user_id' => 'required|exists:users,id',
            'link' => 'nullable|string',
            'reference_id' => 'nullable',
            'reference_type' => 'nullable|string',
        ]);

        $notification = Notification::create($request->all());
        return response()->json(['data' => $notification, 'message' => 'Notification created successfully'], 201);
    }

    /**
     * Delete a notification.
     *
     * @param  \App\Models\Notification  $notification
     * @return \Illuminate\Http\Response
     */
    public function destroy(Notification $notification)
    {
        // Check if notification belongs to the authenticated user
        if ($notification->user_id !== Auth::id()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }
        
        $notification->delete();
        return response()->json(['message' => 'Notification deleted successfully']);
    }
}
