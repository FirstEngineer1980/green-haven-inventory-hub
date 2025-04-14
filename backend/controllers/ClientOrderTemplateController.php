
<?php

namespace App\Http\Controllers;

use App\Services\ClientOrderTemplateService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ClientOrderTemplateController extends Controller
{
    protected $templateService;
    
    public function __construct(ClientOrderTemplateService $templateService)
    {
        $this->templateService = $templateService;
        
        // Add middleware to check permissions using Laravel 11 syntax
        $this->middleware('permission:view client templates')->only(['index', 'show']);
        $this->middleware('permission:create client templates')->only(['store']);
        $this->middleware('permission:edit client templates')->only(['update']);
        $this->middleware('permission:delete client templates')->only(['destroy']);
        $this->middleware('permission:process orders')->only(['processTemplates', 'createOrder']);
    }

    /**
     * Display a listing of client order templates.
     */
    public function index(Request $request)
    {
        $filters = $request->only(['customer_id', 'is_active', 'per_page']);
        
        $templates = $this->templateService->getAllTemplates($filters);
        
        return response()->json($templates);
    }

    /**
     * Store a newly created template.
     */
    public function store(Request $request)
    {
        try {
            $template = $this->templateService->createTemplate($request->all());
            
            // Log activity
            activity()
                ->performedOn($template)
                ->causedBy(Auth::user())
                ->withProperties(['ip' => $request->ip()])
                ->log('Created client order template');
            
            return response()->json($template, 201);
        } catch (ValidationException $e) {
            return response()->json(['errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to create template', 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * Display the specified template.
     */
    public function show(string $id)
    {
        try {
            $template = $this->templateService->getTemplate($id);
            
            return response()->json($template);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Template not found'], 404);
        }
    }

    /**
     * Update the specified template.
     */
    public function update(Request $request, string $id)
    {
        try {
            $template = $this->templateService->updateTemplate($id, $request->all());
            
            // Log activity
            activity()
                ->performedOn($template)
                ->causedBy(Auth::user())
                ->withProperties(['ip' => $request->ip()])
                ->log('Updated client order template');
            
            return response()->json($template);
        } catch (ValidationException $e) {
            return response()->json(['errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to update template', 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * Remove the specified template.
     */
    public function destroy(string $id)
    {
        try {
            $this->templateService->deleteTemplate($id);
            
            // Log activity
            activity()
                ->causedBy(Auth::user())
                ->withProperties(['ip' => request()->ip(), 'template_id' => $id])
                ->log('Deleted client order template');
            
            return response()->json(null, 204);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to delete template', 'error' => $e->getMessage()], 500);
        }
    }
    
    /**
     * Process due templates and create orders.
     */
    public function processTemplates()
    {
        try {
            $createdOrders = $this->templateService->processTemplates();
            
            return response()->json([
                'message' => count($createdOrders) . ' orders created from templates',
                'orders' => $createdOrders
            ]);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to process templates', 'error' => $e->getMessage()], 500);
        }
    }
    
    /**
     * Get templates due for ordering.
     */
    public function getDueTemplates()
    {
        try {
            $dueTemplates = $this->templateService->getDueTemplates();
            
            return response()->json($dueTemplates);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to get due templates', 'error' => $e->getMessage()], 500);
        }
    }
    
    /**
     * Create an order from a specific template.
     */
    public function createOrder(string $id)
    {
        try {
            $order = $this->templateService->createOrderFromTemplate($id);
            
            if (!$order) {
                return response()->json(['message' => 'Failed to create order from template'], 400);
            }
            
            // Log activity
            activity()
                ->performedOn($order)
                ->causedBy(Auth::user())
                ->withProperties(['ip' => request()->ip(), 'template_id' => $id])
                ->log('Created order from template');
            
            return response()->json([
                'message' => 'Order created successfully',
                'order' => $order
            ]);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to create order from template', 'error' => $e->getMessage()], 500);
        }
    }
}
