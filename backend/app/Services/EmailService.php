
<?php

namespace App\Services;

use Illuminate\Support\Facades\Mail;
use App\Models\Setting;
use Illuminate\Mail\Message;
use Illuminate\Support\Facades\Log;

class EmailService
{
    /**
     * Send an email notification.
     *
     * @param string $to Recipient email address
     * @param string $subject Email subject
     * @param string $view Email template view
     * @param array $data Data to be passed to the view
     * @param array $attachments Optional attachments
     * @return bool Whether the email was sent successfully
     */
    public function send($to, $subject, $view, $data = [], $attachments = [])
    {
        try {
            $companyName = Setting::get('company_name', 'Inventory System');
            $fromEmail = Setting::get('notification_email', config('mail.from.address'));
            
            Mail::send($view, $data, function (Message $message) use ($to, $subject, $companyName, $fromEmail, $attachments) {
                $message->to($to)
                    ->subject($subject)
                    ->from($fromEmail, $companyName);
                
                // Add attachments if any
                foreach ($attachments as $attachment) {
                    if (isset($attachment['path']) && file_exists($attachment['path'])) {
                        $message->attach($attachment['path'], [
                            'as' => $attachment['name'] ?? basename($attachment['path']),
                            'mime' => $attachment['mime'] ?? null,
                        ]);
                    }
                }
            });
            
            return true;
        } catch (\Exception $e) {
            Log::error('Failed to send email: ' . $e->getMessage());
            return false;
        }
    }
    
    /**
     * Send low stock alert.
     *
     * @param array $products Low stock products
     * @param string $to Recipient email address
     * @return bool Whether the email was sent successfully
     */
    public function sendLowStockAlert($products, $to)
    {
        return $this->send(
            $to,
            'Low Stock Alert',
            'emails.low_stock',
            ['products' => $products]
        );
    }
    
    /**
     * Send purchase order notification.
     *
     * @param \App\Models\PurchaseOrder $purchaseOrder
     * @param string $to Recipient email address
     * @return bool Whether the email was sent successfully
     */
    public function sendPurchaseOrderNotification($purchaseOrder, $to)
    {
        return $this->send(
            $to,
            'Purchase Order #' . $purchaseOrder->po_number,
            'emails.purchase_order',
            ['purchaseOrder' => $purchaseOrder->load('items.product', 'vendor')]
        );
    }
    
    /**
     * Send report.
     *
     * @param string $to Recipient email address
     * @param string $subject Email subject
     * @param string $reportName Name of the report
     * @param array $reportData Report data
     * @param string $format Report format (pdf, csv, etc.)
     * @return bool Whether the email was sent successfully
     */
    public function sendReport($to, $subject, $reportName, $reportData, $format = 'pdf')
    {
        // Generate report file
        $reportPath = $this->generateReportFile($reportName, $reportData, $format);
        
        if (!$reportPath) {
            return false;
        }
        
        return $this->send(
            $to,
            $subject,
            'emails.report',
            ['reportName' => $reportName],
            [
                [
                    'path' => $reportPath,
                    'name' => $reportName . '.' . $format,
                    'mime' => $format === 'pdf' ? 'application/pdf' : 'text/csv',
                ]
            ]
        );
    }
    
    /**
     * Generate a report file.
     *
     * @param string $reportName Name of the report
     * @param array $reportData Report data
     * @param string $format Report format (pdf, csv, etc.)
     * @return string|bool The path to the generated file or false if generation failed
     */
    private function generateReportFile($reportName, $reportData, $format)
    {
        try {
            $fileName = $reportName . '_' . date('Ymd_His') . '.' . $format;
            $path = storage_path('app/reports/' . $fileName);
            
            // Create directory if it doesn't exist
            if (!file_exists(dirname($path))) {
                mkdir(dirname($path), 0755, true);
            }
            
            if ($format === 'csv') {
                $this->generateCsvReport($path, $reportData);
            } else {
                // Default to PDF
                $this->generatePdfReport($path, $reportName, $reportData);
            }
            
            return $path;
        } catch (\Exception $e) {
            Log::error('Failed to generate report file: ' . $e->getMessage());
            return false;
        }
    }
    
    /**
     * Generate a CSV report.
     *
     * @param string $path Path to save the CSV file
     * @param array $data Report data
     * @return bool Whether the CSV generation was successful
     */
    private function generateCsvReport($path, $data)
    {
        if (empty($data)) {
            return false;
        }
        
        $file = fopen($path, 'w');
        
        // Add headers
        fputcsv($file, array_keys((array)$data[0]));
        
        // Add data
        foreach ($data as $row) {
            fputcsv($file, (array)$row);
        }
        
        fclose($file);
        return true;
    }
    
    /**
     * Generate a PDF report.
     *
     * @param string $path Path to save the PDF file
     * @param string $reportName Name of the report
     * @param array $data Report data
     * @return bool Whether the PDF generation was successful
     */
    private function generatePdfReport($path, $reportName, $data)
    {
        // This is a placeholder for PDF generation
        // In a real application, you would use a PDF library like FPDF, TCPDF, or Dompdf
        
        $html = '<html><head><title>' . $reportName . '</title></head><body>';
        $html .= '<h1>' . $reportName . '</h1>';
        
        if (!empty($data)) {
            $html .= '<table border="1"><tr>';
            
            // Add headers
            foreach (array_keys((array)$data[0]) as $header) {
                $html .= '<th>' . $header . '</th>';
            }
            
            $html .= '</tr>';
            
            // Add data rows
            foreach ($data as $row) {
                $html .= '<tr>';
                foreach ((array)$row as $value) {
                    $html .= '<td>' . $value . '</td>';
                }
                $html .= '</tr>';
            }
            
            $html .= '</table>';
        } else {
            $html .= '<p>No data available for this report.</p>';
        }
        
        $html .= '</body></html>';
        
        // Save HTML to file for now (in a real app, convert to PDF)
        file_put_contents($path, $html);
        
        return true;
    }
}
