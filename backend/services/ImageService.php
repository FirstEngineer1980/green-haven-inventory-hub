
<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ImageService
{
    /**
     * Store an image and return the path.
     *
     * @param UploadedFile $image
     * @param string $directory
     * @return string
     */
    public function store(UploadedFile $image, string $directory = 'images'): string
    {
        $filename = Str::uuid() . '.' . $image->getClientOriginalExtension();
        $path = $image->storeAs($directory, $filename, 'public');
        
        return $path;
    }
    
    /**
     * Delete an image from storage.
     *
     * @param string $path
     * @return bool
     */
    public function delete(string $path): bool
    {
        if (Storage::disk('public')->exists($path)) {
            return Storage::disk('public')->delete($path);
        }
        
        return false;
    }
    
    /**
     * Check if a string is a base64 encoded image and store it.
     *
     * @param string $base64String
     * @param string $directory
     * @return string|null
     */
    public function storeBase64Image(string $base64String, string $directory = 'images'): ?string
    {
        // Check if it's a base64 encoded image
        if (Str::startsWith($base64String, 'data:image')) {
            // Extract image data
            $imageData = explode(',', $base64String);
            $imageTypeData = explode(';', $imageData[0]);
            $imageType = str_replace('data:image/', '', $imageTypeData[0]);
            
            // Decode base64
            $decodedImage = base64_decode($imageData[1]);
            
            // Generate filename
            $filename = Str::uuid() . '.' . $imageType;
            $path = $directory . '/' . $filename;
            
            // Store file
            Storage::disk('public')->put($path, $decodedImage);
            
            return $path;
        }
        
        return null;
    }
}
