<?php

namespace Tests\Feature\Api;

use App\Models\Project;
use App\Models\StickyNote;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use Illuminate\Support\Carbon;

class StickyNoteControllerTest extends TestCase
{
    use RefreshDatabase, WithFaker;

    protected User $user;
    protected string $token;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create();
        $this->token = $this->user->createToken('test-token')->plainTextToken;
    }

    private function actingAsUser(): self
    {
        return $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->token,
            'Accept' => 'application/json',
        ]);
    }

    private function getStickyNoteBaseData(array $overrides = []): array
    {
        return array_merge([
            'content' => $this->faker->paragraph,
            'x' => $this->faker->numberBetween(0, 1000),
            'y' => $this->faker->numberBetween(0, 600),
            'width' => $this->faker->numberBetween(200, 400),
            'height' => $this->faker->numberBetween(150, 300),
            'color' => $this->faker->hexColor,
            'z_index' => $this->faker->numberBetween(1, 100),
            'font_size' => $this->faker->numberBetween(12, 24),
            'font_family' => $this->faker->fontFamily,
        ], $overrides);
    }

    /** @test */
    public function user_can_create_sticky_note_with_reminder_and_category()
    {
        $project = Project::factory()->create(['user_id' => $this->user->id]);
        $reminderDate = Carbon::now()->addDays(7)->toIso8601String();
        $category = 'Work';

        $data = $this->getStickyNoteBaseData([
            'project_id' => $project->id,
            'reminder_at' => $reminderDate,
            'category' => $category,
        ]);

        $response = $this->actingAsUser()->postJson('/api/v1/sticky-notes', $data);

        $response->assertStatus(201)
            ->assertJsonPath('note.content', $data['content'])
            ->assertJsonPath('note.category', $category)
            ->assertJsonPath('note.reminderAt', function ($value) use ($reminderDate) {
                return Carbon::parse($value)->toIso8601String() === $reminderDate;
            });

        $this->assertDatabaseHas('sticky_notes', [
            'user_id' => $this->user->id,
            'project_id' => $project->id,
            'content' => $data['content'],
            'category' => $category,
            'reminder_at' => Carbon::parse($reminderDate)->format('Y-m-d H:i:s'),
        ]);
    }

    /** @test */
    public function user_can_create_sticky_note_without_reminder_or_category()
    {
        $data = $this->getStickyNoteBaseData();

        $response = $this->actingAsUser()->postJson('/api/v1/sticky-notes', $data);

        $response->assertStatus(201)
            ->assertJsonPath('note.content', $data['content'])
            ->assertJsonPath('note.category', null)
            ->assertJsonPath('note.reminderAt', null);

        $this->assertDatabaseHas('sticky_notes', [
            'user_id' => $this->user->id,
            'content' => $data['content'],
            'category' => null,
            'reminder_at' => null,
        ]);
    }

    /** @test */
    public function user_can_update_sticky_note_with_reminder_and_category()
    {
        $note = StickyNote::factory()->create(['user_id' => $this->user->id]);
        $newReminderDate = Carbon::now()->addMonths(1)->toIso8601String();
        $newCategory = 'Personal';

        $updateData = [
            'content' => 'Updated content for test',
            'reminder_at' => $newReminderDate,
            'category' => $newCategory,
        ];

        $response = $this->actingAsUser()->putJson("/api/v1/sticky-notes/{$note->id}", $updateData);

        $response->assertStatus(200)
            ->assertJsonPath('note.content', $updateData['content'])
            ->assertJsonPath('note.category', $newCategory)
            ->assertJsonPath('note.reminderAt', function ($value) use ($newReminderDate) {
                 return Carbon::parse($value)->toIso8601String() === $newReminderDate;
            });

        $this->assertDatabaseHas('sticky_notes', [
            'id' => $note->id,
            'content' => $updateData['content'],
            'category' => $newCategory,
            'reminder_at' => Carbon::parse($newReminderDate)->format('Y-m-d H:i:s'),
        ]);
    }

    /** @test */
    public function user_can_update_sticky_note_to_set_reminder_to_null()
    {
        $note = StickyNote::factory()->create([
            'user_id' => $this->user->id,
            'reminder_at' => Carbon::now()->addDay(),
            'category' => 'Old Category'
        ]);

        $updateData = [
            'reminder_at' => null,
            'category' => 'Category Kept, Reminder Nullified',
        ];

        $response = $this->actingAsUser()->putJson("/api/v1/sticky-notes/{$note->id}", $updateData);

        $response->assertStatus(200)
            ->assertJsonPath('note.category', $updateData['category'])
            ->assertJsonPath('note.reminderAt', null);

        $this->assertDatabaseHas('sticky_notes', [
            'id' => $note->id,
            'category' => $updateData['category'],
            'reminder_at' => null,
        ]);
    }

    /** @test */
    public function user_can_update_sticky_note_category_without_affecting_reminder()
    {
        $existingReminderDate = Carbon::now()->addDay();
        $note = StickyNote::factory()->create([
            'user_id' => $this->user->id,
            'reminder_at' => $existingReminderDate,
            'category' => 'Old Category'
        ]);

        $newCategory = 'New Category Only';
        $updateData = [
            'category' => $newCategory,
            // reminder_at is intentionally omitted from updateData
        ];

        $response = $this->actingAsUser()->putJson("/api/v1/sticky-notes/{$note->id}", $updateData);

        $response->assertStatus(200)
            ->assertJsonPath('note.category', $newCategory)
            ->assertJsonPath('note.reminderAt', function ($value) use ($existingReminderDate) {
                 return Carbon::parse($value)->equalTo($existingReminderDate->startOfSecond()); // Compare after parsing & standardizing
            });

        $this->assertDatabaseHas('sticky_notes', [
            'id' => $note->id,
            'category' => $newCategory,
            'reminder_at' => $existingReminderDate->format('Y-m-d H:i:s'),
        ]);
    }

    /** @test */
    public function reminder_at_must_be_a_valid_date()
    {
        $data = $this->getStickyNoteBaseData(['reminder_at' => 'not-a-date']);
        $response = $this->actingAsUser()->postJson('/api/v1/sticky-notes', $data);
        $response->assertStatus(422)->assertJsonValidationErrors('reminder_at');
    }

    /** @test */
    public function category_must_be_a_string_and_not_too_long()
    {
        $data1 = $this->getStickyNoteBaseData(['category' => 12345]); // Not a string
        $response1 = $this->actingAsUser()->postJson('/api/v1/sticky-notes', $data1);
        $response1->assertStatus(422)->assertJsonValidationErrors('category');

        $data2 = $this->getStickyNoteBaseData(['category' => $this->faker->realText(300)]); // Too long
        $response2 = $this->actingAsUser()->postJson('/api/v1/sticky-notes', $data2);
        $response2->assertStatus(422)->assertJsonValidationErrors('category');
    }

    /** @test */
    public function index_endpoint_returns_reminder_and_category()
    {
        $reminderDate = Carbon::now()->addWeeks(1);
        StickyNote::factory()->count(3)->create(['user_id' => $this->user->id]);
        StickyNote::factory()->create([
            'user_id' => $this->user->id,
            'reminder_at' => $reminderDate,
            'category' => 'Test Category Index'
        ]);

        $response = $this->actingAsUser()->getJson('/api/v1/sticky-notes');

        $response->assertStatus(200)
            ->assertJsonCount(4, 'notes')
            ->assertJsonPath('notes.3.category', 'Test Category Index') // Assuming last created is last in list if ordered by z_index default or ID
            ->assertJsonPath('notes.3.reminderAt', function ($value) use ($reminderDate) {
                return Carbon::parse($value)->equalTo($reminderDate->startOfSecond());
            });
    }

    /** @test */
    public function show_endpoint_returns_reminder_and_category()
    {
        $reminderDate = Carbon::now()->addHour();
        $note = StickyNote::factory()->create([
            'user_id' => $this->user->id,
            'reminder_at' => $reminderDate,
            'category' => 'Test Category Show'
        ]);

        $response = $this->actingAsUser()->getJson("/api/v1/sticky-notes/{$note->id}");

        $response->assertStatus(200)
            ->assertJsonPath('note.category', 'Test Category Show')
            ->assertJsonPath('note.reminderAt', function ($value) use ($reminderDate) {
                return Carbon::parse($value)->equalTo($reminderDate->startOfSecond());
            });
    }
}
