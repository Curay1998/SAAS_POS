<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\StickyNote;
use Illuminate\Http\Request;

class StickyNoteController extends Controller
{
    public function index(Request $request)
    {
        $notes = StickyNote::where('user_id', $request->user()->id)
            ->orderBy('z_index')
            ->get();

        return response()->json([
            'notes' => $notes->map(function ($note) {
                return [
                    'id' => $note->id,
                    'content' => $note->content,
                    'x' => $note->x,
                    'y' => $note->y,
                    'width' => $note->width,
                    'height' => $note->height,
                    'color' => $note->color,
                    'zIndex' => $note->z_index,
                    'fontSize' => $note->font_size,
                    'fontFamily' => $note->font_family,
                    'createdAt' => $note->created_at,
                    'updatedAt' => $note->updated_at,
                ];
            })
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'content' => 'required|string',
            'x' => 'required|integer',
            'y' => 'required|integer',
            'width' => 'required|integer|min:100',
            'height' => 'required|integer|min:100',
            'color' => 'required|string',
            'z_index' => 'required|integer',
            'font_size' => 'required|integer|min:8|max:32',
            'font_family' => 'required|string',
            'project_id' => 'nullable|exists:projects,id',
        ]);

        $note = StickyNote::create([
            'user_id' => $request->user()->id,
            'project_id' => $request->project_id,
            'content' => $request->content,
            'x' => $request->x,
            'y' => $request->y,
            'width' => $request->width,
            'height' => $request->height,
            'color' => $request->color,
            'z_index' => $request->z_index,
            'font_size' => $request->font_size,
            'font_family' => $request->font_family,
        ]);

        return response()->json([
            'note' => [
                'id' => $note->id,
                'content' => $note->content,
                'x' => $note->x,
                'y' => $note->y,
                'width' => $note->width,
                'height' => $note->height,
                'color' => $note->color,
                'zIndex' => $note->z_index,
                'fontSize' => $note->font_size,
                'fontFamily' => $note->font_family,
                'createdAt' => $note->created_at,
                'updatedAt' => $note->updated_at,
            ]
        ], 201);
    }

    public function show(Request $request, StickyNote $stickyNote)
    {
        if ($stickyNote->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        return response()->json([
            'note' => [
                'id' => $stickyNote->id,
                'content' => $stickyNote->content,
                'x' => $stickyNote->x,
                'y' => $stickyNote->y,
                'width' => $stickyNote->width,
                'height' => $stickyNote->height,
                'color' => $stickyNote->color,
                'zIndex' => $stickyNote->z_index,
                'fontSize' => $stickyNote->font_size,
                'fontFamily' => $stickyNote->font_family,
                'createdAt' => $stickyNote->created_at,
                'updatedAt' => $stickyNote->updated_at,
            ]
        ]);
    }

    public function update(Request $request, StickyNote $stickyNote)
    {
        if ($stickyNote->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $request->validate([
            'content' => 'sometimes|string',
            'x' => 'sometimes|integer',
            'y' => 'sometimes|integer',
            'width' => 'sometimes|integer|min:100',
            'height' => 'sometimes|integer|min:100',
            'color' => 'sometimes|string',
            'z_index' => 'sometimes|integer',
            'font_size' => 'sometimes|integer|min:8|max:32',
            'font_family' => 'sometimes|string',
        ]);

        $stickyNote->update($request->only([
            'content', 'x', 'y', 'width', 'height', 'color', 'z_index', 'font_size', 'font_family'
        ]));

        return response()->json([
            'note' => [
                'id' => $stickyNote->id,
                'content' => $stickyNote->content,
                'x' => $stickyNote->x,
                'y' => $stickyNote->y,
                'width' => $stickyNote->width,
                'height' => $stickyNote->height,
                'color' => $stickyNote->color,
                'zIndex' => $stickyNote->z_index,
                'fontSize' => $stickyNote->font_size,
                'fontFamily' => $stickyNote->font_family,
                'createdAt' => $stickyNote->created_at,
                'updatedAt' => $stickyNote->updated_at,
            ]
        ]);
    }

    public function destroy(Request $request, StickyNote $stickyNote)
    {
        if ($stickyNote->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $stickyNote->delete();

        return response()->json(['message' => 'Note deleted successfully']);
    }
}