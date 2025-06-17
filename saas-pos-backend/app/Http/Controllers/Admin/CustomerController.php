<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User; // Assuming customers are also Users with 'customer' role

class CustomerController extends Controller
{
    /**
     * Display a listing of the customers.
     */
    public function index(Request $request)
    {
        // Placeholder logic:
        // $customers = User::where('role', 'customer')->get();
        // return response()->json($customers);
        $customers = [
            ['id' => 1, 'name' => 'Test Customer 1', 'email' => 'customer1@example.com', 'role' => 'customer', 'created_at' => now()->toDateTimeString()],
            ['id' => 2, 'name' => 'Test Customer 2', 'email' => 'customer2@example.com', 'role' => 'customer', 'created_at' => now()->toDateTimeString()],
        ];
        return response()->json($customers);
    }

    /**
     * Store a newly created customer in storage.
     */
    public function store(Request $request)
    {
        // Placeholder logic:
        // $validated = $request->validate([
        // 'name' => 'required|string|max:255',
        // 'email' => 'required|string|email|max:255|unique:users,email',
        // 'password' => 'required|string|min:8',
        // ]);
        // $customer = User::create([
        // 'name' => $validated['name'],
        // 'email' => $validated['email'],
        // 'password' => bcrypt($validated['password']),
        // 'role' => 'customer',
        // ]);
        // return response()->json($customer, 201);
        $newCustomer = array_merge(['id' => rand(100,200)], $request->all(), ['role' => 'customer', 'created_at' => now()->toDateTimeString()]);
        return response()->json($newCustomer, 201);
    }

    /**
     * Display the specified customer.
     */
    public function show($id) // Changed from User $customer due to no route model binding setup
    {
        // Placeholder logic:
        // $customer = User::where('role', 'customer')->findOrFail($id);
        // return response()->json($customer);
        return response()->json([
            'id' => (int)$id, 'name' => 'Customer ' . $id, 'email' => "customer{$id}@example.com", 'role' => 'customer', 'created_at' => now()->toDateTimeString()
        ]);
    }

    /**
     * Update the specified customer in storage.
     */
    public function update(Request $request, $id) // Changed from User $customer
    {
        // Placeholder logic:
        // $customer = User::where('role', 'customer')->findOrFail($id);
        // $validated = $request->validate([
        // 'name' => 'sometimes|required|string|max:255',
        // 'email' => 'sometimes|required|string|email|max:255|unique:users,email,'.$customer->id,
        // 'password' => 'nullable|string|min:8',
        // ]);
        // $dataToUpdate = $request->only(['name', 'email']);
        // if ($request->filled('password')) {
        // $dataToUpdate['password'] = bcrypt($request->password);
        // }
        // $customer->update($dataToUpdate);
        // return response()->json($customer);
        $updatedData = array_merge(['id' => (int)$id], $request->all());
        return response()->json($updatedData);
    }

    /**
     * Remove the specified customer from storage.
     */
    public function destroy($id) // Changed from User $customer
    {
        // Placeholder logic:
        // $customer = User::where('role', 'customer')->findOrFail($id);
        // $customer->delete();
        // return response()->json(null, 204);
        return response()->json(null, 204);
    }
}
