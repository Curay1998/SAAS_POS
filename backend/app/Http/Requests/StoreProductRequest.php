<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreProductRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true; // Assuming any authenticated user can manage products for now
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        // For 'sku' uniqueness:
        // - When creating, $this->product is null, so it checks 'sku' in 'products' table.
        // - When updating, $this->product is the product being updated.
        //   We ignore its own ID for the uniqueness check.
        $productId = $this->product ? $this->product->id : '';

        return [
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'sku' => 'nullable|string|max:100|unique:products,sku,' . $productId,
            'quantity' => 'required|integer|min:0',
            'price' => 'required|numeric|min:0',
        ];
    }
}
