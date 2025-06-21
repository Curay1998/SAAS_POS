'use client';

import { useState, useRef, useCallback } from 'react';
import { StickyNote } from './StickyNote';
import { Plus, Home, ArrowLeft, Palette, Download, Upload, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export interface Note {
    id: string;
    content: string;
    x: number;
    y: number;
    width: number;
    height: number;
    color: string;
    zIndex: number;
    fontSize: number;
    fontFamily: string;
    createdAt: Date;
    updatedAt: Date;
}

const COLORS = [
    '#fef3c7', // yellow
    '#fecaca', // red
    '#bbf7d0', // green
    '#bfdbfe', // blue
    '#e9d5ff', // purple
    '#fed7d7', // pink
    '#fde68a', // amber
    '#c7d2fe', // indigo
];

const FONT_FAMILIES = [
    'Inter, sans-serif',
    'Georgia, serif',
    'Monaco, monospace',
    'Comic Sans MS, cursive',
];

export function StickyNotesBoard() {
    const router = useRouter();
    const [notes, setNotes] = useState<Note[]>([]);
    const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
    const [maxZIndex, setMaxZIndex] = useState(1);
    const boardRef = useRef<HTMLDivElement>(null);

    const createNote = useCallback(() => {
        const newNote: Note = {
            id: `note-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            content: 'New note...',
            x: Math.random() * 300 + 50,
            y: Math.random() * 300 + 100,
            width: 200,
            height: 200,
            color: COLORS[Math.floor(Math.random() * COLORS.length)],
            zIndex: maxZIndex + 1,
            fontSize: 14,
            fontFamily: FONT_FAMILIES[0],
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        setNotes((prev) => [...prev, newNote]);
        setMaxZIndex((prev) => prev + 1);
        setSelectedNoteId(newNote.id);
    }, [maxZIndex]);

    const updateNote = useCallback((id: string, updates: Partial<Note>) => {
        setNotes((prev) =>
            prev.map((note) =>
                note.id === id ? { ...note, ...updates, updatedAt: new Date() } : note,
            ),
        );
    }, []);

    const deleteNote = useCallback(
        (id: string) => {
            setNotes((prev) => prev.filter((note) => note.id !== id));
            if (selectedNoteId === id) {
                setSelectedNoteId(null);
            }
        },
        [selectedNoteId],
    );

    const bringToFront = useCallback(
        (id: string) => {
            const newZIndex = maxZIndex + 1;
            setMaxZIndex(newZIndex);
            updateNote(id, { zIndex: newZIndex });
            setSelectedNoteId(id);
        },
        [maxZIndex, updateNote],
    );

    const duplicateNote = useCallback(
        (id: string) => {
            const originalNote = notes.find((note) => note.id === id);
            if (!originalNote) return;

            const newNote: Note = {
                ...originalNote,
                id: `note-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                x: originalNote.x + 20,
                y: originalNote.y + 20,
                zIndex: maxZIndex + 1,
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            setNotes((prev) => [...prev, newNote]);
            setMaxZIndex((prev) => prev + 1);
            setSelectedNoteId(newNote.id);
        },
        [notes, maxZIndex],
    );

    const exportNotes = useCallback(() => {
        const dataStr = JSON.stringify(notes, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

        const exportFileDefaultName = `sticky-notes-${new Date().toISOString().split('T')[0]}.json`;

        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
    }, [notes]);

    const importNotes = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const importedNotes = JSON.parse(e.target?.result as string);
                if (Array.isArray(importedNotes)) {
                    const processedNotes = importedNotes.map((note) => ({
                        ...note,
                        createdAt: new Date(note.createdAt),
                        updatedAt: new Date(note.updatedAt),
                    }));
                    setNotes(processedNotes);
                    const maxZ = Math.max(...processedNotes.map((n) => n.zIndex), 0);
                    setMaxZIndex(maxZ);
                }
            } catch (error) {
                alert('Error importing notes. Please check the file format.');
            }
        };
        reader.readAsText(file);

        // Reset the input
        event.target.value = '';
    }, []);

    const clearAllNotes = useCallback(() => {
        if (notes.length === 0) return;

        if (
            confirm(
                'Are you sure you want to delete all sticky notes? This action cannot be undone.',
            )
        ) {
            setNotes([]);
            setSelectedNoteId(null);
            setMaxZIndex(1);
        }
    }, [notes.length]);

    const selectedNote = selectedNoteId ? notes.find((note) => note.id === selectedNoteId) : null;

    return (
        <div className="h-full bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
            {/* Toolbar */}
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
                <div className="px-6 py-4">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2">
                                <Palette className="h-5 w-5 text-yellow-500" />
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    {notes.length} {notes.length === 1 ? 'note' : 'notes'}
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center space-x-2">
                            <button
                                onClick={createNote}
                                className="flex items-center space-x-2 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg transition-colors shadow-lg hover:shadow-xl"
                            >
                                <Plus className="h-4 w-4" />
                                <span>New Note</span>
                            </button>

                            <div className="flex items-center space-x-1 border-l border-gray-300 dark:border-gray-600 pl-2">
                                <button
                                    onClick={exportNotes}
                                    disabled={notes.length === 0}
                                    className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    title="Export Notes"
                                >
                                    <Download className="h-5 w-5" />
                                </button>

                                <label
                                    className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white cursor-pointer transition-colors"
                                    title="Import Notes"
                                >
                                    <Upload className="h-5 w-5" />
                                    <input
                                        type="file"
                                        accept=".json"
                                        onChange={importNotes}
                                        className="hidden"
                                    />
                                </label>

                                <button
                                    onClick={clearAllNotes}
                                    disabled={notes.length === 0}
                                    className="p-2 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    title="Clear All Notes"
                                >
                                    <Trash2 className="h-5 w-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Toolbar for selected note */}
            {selectedNote && (
                <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 px-6 py-3">
                    <div className="flex items-center space-x-4">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Note Settings:
                        </span>

                        {/* Color picker */}
                        <div className="flex items-center space-x-1">
                            {COLORS.map((color) => (
                                <button
                                    key={color}
                                    onClick={() => updateNote(selectedNote.id, { color })}
                                    className={`w-6 h-6 rounded-full border-2 transition-all ${
                                        selectedNote.color === color
                                            ? 'border-gray-800 dark:border-white scale-110'
                                            : 'border-gray-300 dark:border-gray-600 hover:scale-105'
                                    }`}
                                    style={{ backgroundColor: color }}
                                />
                            ))}
                        </div>

                        {/* Font size */}
                        <select
                            value={selectedNote.fontSize}
                            onChange={(e) =>
                                updateNote(selectedNote.id, { fontSize: parseInt(e.target.value) })
                            }
                            className="px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        >
                            <option value={12}>12px</option>
                            <option value={14}>14px</option>
                            <option value={16}>16px</option>
                            <option value={18}>18px</option>
                            <option value={20}>20px</option>
                        </select>

                        {/* Font family */}
                        <select
                            value={selectedNote.fontFamily}
                            onChange={(e) =>
                                updateNote(selectedNote.id, { fontFamily: e.target.value })
                            }
                            className="px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        >
                            <option value="Inter, sans-serif">Sans Serif</option>
                            <option value="Georgia, serif">Serif</option>
                            <option value="Monaco, monospace">Monospace</option>
                            <option value="Comic Sans MS, cursive">Comic Sans</option>
                        </select>

                        <div className="flex-1"></div>

                        <span className="text-xs text-gray-500 dark:text-gray-400">
                            Created: {selectedNote.createdAt.toLocaleDateString()}
                        </span>
                    </div>
                </div>
            )}

            {/* Notes Board */}
            <div
                ref={boardRef}
                className="relative w-full overflow-hidden"
                style={{ height: 'calc(100vh - 200px)' }}
                onClick={(e) => {
                    if (e.target === boardRef.current) {
                        setSelectedNoteId(null);
                    }
                }}
            >
                {notes.length === 0 && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                            <Palette className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />

                            <h3 className="text-lg font-medium text-gray-500 dark:text-gray-400 mb-2">
                                No sticky notes yet
                            </h3>
                            <p className="text-gray-400 dark:text-gray-500 mb-4">
                                Create your first sticky note to get started
                            </p>
                            <button
                                onClick={createNote}
                                className="flex items-center space-x-2 bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-lg transition-colors shadow-lg hover:shadow-xl mx-auto"
                            >
                                <Plus className="h-5 w-5" />
                                <span>Create Note</span>
                            </button>
                        </div>
                    </div>
                )}

                {notes.map((note) => (
                    <StickyNote
                        key={note.id}
                        note={note}
                        isSelected={selectedNoteId === note.id}
                        onUpdate={updateNote}
                        onDelete={deleteNote}
                        onSelect={bringToFront}
                        onDuplicate={duplicateNote}
                    />
                ))}
            </div>

            {/* Info panel */}
            <div className="fixed bottom-4 right-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg p-3 shadow-lg border border-gray-200 dark:border-gray-700">
                <div className="text-xs text-gray-600 dark:text-gray-400">
                    <div>Notes: {notes.length}</div>
                    <div className="mt-1 text-gray-500 dark:text-gray-500">
                        Double-click to edit • Right-click for options
                    </div>
                </div>
            </div>
        </div>
    );
}
