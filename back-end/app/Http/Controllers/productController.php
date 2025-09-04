<?php

namespace App\Http\Controllers;

use App\Models\Produit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            $user = auth()->user();

            if (!$user) {
                Log::warning('Unauthenticated user trying to access products');
                return response()->json([
                    'error' => 'Unauthenticated',
                    'message' => 'Please login to access your products'
                ], 401);
            }

            Log::info('Fetching products for user ID: ' . $user->id);

            // Fetch products with the image_url accessor automatically included
            $produits = Produit::where('user_id', $user->id)
                ->orderBy('created_at', 'desc')
                ->get();

            Log::info('Found ' . $produits->count() . ' products for user ' . $user->id);

            return response()->json($produits, 200);

        } catch (\Exception $e) {
            Log::error('Error in products index: ' . $e->getMessage(), [
                'user_id' => auth()->id() ?? 'guest',
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'error' => 'Internal server error',
                'message' => 'An error occurred while fetching products.'
            ], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'prix' => 'required|numeric|min:0',
                'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            ]);

            $path = null;
            if ($request->hasFile('image')) {
                $path = $request->file('image')->store('products', 'public');
                Log::info('Image stored at: ' . $path);
            }

            $produit = Produit::create([
                'name' => $validated['name'],
                'prix' => $validated['prix'],
                'path' => $path,
                'user_id' => Auth::id()
                ,'type' => $request->type
            ]);

            Log::info('Product created successfully', ['product_id' => $produit->id]);

            return response()->json([
                'success' => true,
                'message' => 'Produit créé avec succès',
                'data' => $produit->fresh()
            ], 201);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            Log::error('Error creating product: ' . $e->getMessage(), [
                'user_id' => auth()->id(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'An error occurred while creating the product.'
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Produit $product)
    {
        try {
            // Check if user owns this product
            if ($product->user_id !== auth()->id()) {
                return response()->json([
                    'error' => 'Unauthorized access to this product'
                ], 403);
            }

            return response()->json([
                'success' => true,
                'data' => $product
            ], 200);

        } catch (\Exception $e) {
            Log::error('Error showing product: ' . $e->getMessage(), [
                'product_id' => $product->id,
                'user_id' => auth()->id()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Error retrieving product'
            ], 500);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Produit $produit)
    {
        try {
            // Check if user owns this product
            if ($produit->user_id !== auth()->id()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized access to this product'
                ], 403);
            }

            // Validate incoming data
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'prix' => 'required|numeric|min:0',
                'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            ]);

            // Prepare data for update
            $updateData = [
                'name' => $validated['name'],
                'prix' => $validated['prix'],
            ];

            // Handle file upload
            if ($request->hasFile('image')) {
                // Delete old image if exists
                if ($produit->path && Storage::disk('public')->exists($produit->path)) {
                    Storage::disk('public')->delete($produit->path);
                    Log::info('Old image deleted: ' . $produit->path);
                }

                // Store new image
                $path = $request->file('image')->store('products', 'public');
                $updateData['path'] = $path;
                Log::info('New image stored: ' . $path);
            }

            $produit->update($updateData);

            Log::info('Product updated successfully', ['product_id' => $produit->id]);

            return response()->json([
                'success' => true,
                'message' => 'Product updated successfully',
                'data' => $produit->fresh(),
            ], 200);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            Log::error('Update error: ' . $e->getMessage(), [
                'product_id' => $produit->id,
                'user_id' => auth()->id(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Update failed: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        try {
            if (!auth()->check()) {
                return response()->json([
                    'success' => false,
                    'error' => 'User not authenticated'
                ], 401);
            }

            // Find the product and check ownership
            $produit = Produit::where('id', $id)
                             ->where('user_id', auth()->id())
                             ->first();

            if (!$produit) {
                return response()->json([
                    'success' => false,
                    'error' => 'Product not found or not authorized'
                ], 404);
            }

 
            if ($produit->path && Storage::disk('public')->exists($produit->path)) {
                Storage::disk('public')->delete($produit->path);
                Log::info('Image file deleted: ' . $produit->path);
            }

            // Delete the product
            $produit->delete();

            Log::info('Product deleted successfully', [
                'product_id' => $id,
                'user_id' => auth()->id()
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Product deleted successfully'
            ], 200);

        } catch (\Exception $e) {
            Log::error('Error deleting product: ' . $e->getMessage(), [
                'product_id' => $id,
                'user_id' => auth()->id(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'error' => 'Failed to delete product',
                'message' => $e->getMessage()
            ], 500);
        }
    }
}