<?php

namespace Database\Factories;

use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;

class ProductFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Product::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => $this->faker->words(3, true),
            'description' => $this->faker->sentence,
            'sku' => $this->faker->unique()->ean8(), // ean8 for a shorter, more typical SKU
            'quantity' => $this->faker->numberBetween(0, 100),
            'price' => $this->faker->randomFloat(2, 1, 1000), // price between 1.00 and 1000.00
        ];
    }
}
