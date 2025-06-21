'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Draggable from 'react-draggable';
import { X, Copy, Palette, Type, Move, MoreVertical } from 'lucide-react';
import type { Note } from './StickyNotesBoard';

interface StickyNoteProps {
    note: Note;
    isSelected: boolean;
    onUpdate: (id: string, updates: Partial<Note>) => void;
    onDelete: (id: string) => void;
    onSelect: (id: string) => void;
    onDuplicate: (id: string) => void;
}

export function StickyNote({
    note,
    isSelected,
    onUpdate,
    onDelete,
    onSelect,
    onDuplicate,
}: StickyNoteProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [content, setContent] = useState(note.content);
    const [showContextMenu, setShowContextMenu] = useState(false);
    const [contextMenuPos, setContextMenuPos] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);

    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const noteRef = useRef<HTMLDivElement>(null);
    const contextMenuRef = useRef<HTMLDivElement>(null);

    // Handle double-click to edit
    const handleDoubleClick = useCallback(() => {
        if (!isDragging) {
            setIsEditing(true);
            onSelect(note.id);
        }
    }, [isDragging, note.id, onSelect]);

    // Handle single click to select
    const handleClick = useCallback(
        (e: React.MouseEvent) => {
            e.stopPropagation();
            onSelect(note.id);
        },
        [note.id, onSelect],
    );

    // Handle content save
    const handleSave = useCallback(() => {
        onUpdate(note.id, { content: content.trim() || 'Empty note...' });
        setIsEditing(false);
    }, [note.id, content, onUpdate]);

    // Handle escape key
    const handleKeyDown = useCallback(
        (e: React.KeyboardEvent) => {
            if (e.key === 'Escape') {
                setContent(note.content);
                setIsEditing(false);
            } else if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                handleSave();
            }
        },
        [note.content, handleSave],
    );

    // Handle context menu
    const handleContextMenu = useCallback(
        (e: React.MouseEvent) => {
            e.preventDefault();
            e.stopPropagation();
            setContextMenuPos({ x: e.clientX, y: e.clientY });
            setShowContextMenu(true);
            onSelect(note.id);
        },
        [note.id, onSelect],
    );

    // Handle drag events
    const handleDragStart = useCallback(() => {
        setIsDragging(true);
        onSelect(note.id);
    }, [note.id, onSelect]);

    const handleDragStop = useCallback(
        (e: any, data: any) => {
            setIsDragging(false);
            onUpdate(note.id, { x: data.x, y: data.y });
        },
        [note.id, onUpdate],
    );

    // Handle resize
    const handleResize = useCallback(
        (e: React.MouseEvent) => {
            e.preventDefault();
            e.stopPropagation();

            const startX = e.clientX;
            const startY = e.clientY;
            const startWidth = note.width;
            const startHeight = note.height;

            const handleMouseMove = (e: MouseEvent) => {
                const newWidth = Math.max(150, startWidth + (e.clientX - startX));
                const newHeight = Math.max(100, startHeight + (e.clientY - startY));
                onUpdate(note.id, { width: newWidth, height: newHeight });
            };

            const handleMouseUp = () => {
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);
            };

            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        },
        [note.id, note.width, note.height, onUpdate],
    );

    // Close context menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (contextMenuRef.current && !contextMenuRef.current.contains(e.target as Node)) {
                setShowContextMenu(false);
            }
        };

        if (showContextMenu) {
            document.addEventListener('mousedown', handleClickOutside);
            return () => document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [showContextMenu]);

    // Focus textarea when editing starts
    useEffect(() => {
        if (isEditing && textareaRef.current) {
            textareaRef.current.focus();
            textareaRef.current.select();
        }
    }, [isEditing]);

    // Update local content when note content changes
    useEffect(() => {
        setContent(note.content);
    }, [note.content]);

    const contextMenuItems = [
        {
            label: 'Duplicate',
            icon: Copy,
            action: () => {
                onDuplicate(note.id);
                setShowContextMenu(false);
            },
        },
        {
            label: 'Delete',
            icon: X,
            action: () => {
                onDelete(note.id);
                setShowContextMenu(false);
            },
            danger: true,
        },
    ];

    return (
        <>
            <Draggable
                position={{ x: note.x, y: note.y }}
                onStart={handleDragStart}
                onStop={handleDragStop}
                handle=".drag-handle"
                bounds="parent"
            >
                <div
                    ref={noteRef}
                    className={`absolute select-none transition-all duration-200 ${
                        isSelected
                            ? 'ring-2 ring-blue-500 ring-opacity-50 shadow-2xl'
                            : 'shadow-lg hover:shadow-xl'
                    }`}
                    style={{
                        width: note.width,
                        height: note.height,
                        zIndex: note.zIndex,
                        backgroundColor: note.color,
                    }}
                    onClick={handleClick}
                    onDoubleClick={handleDoubleClick}
                    onContextMenu={handleContextMenu}
                >
                    {/* Note Header */}
                    <div className="drag-handle flex items-center justify-between p-2 cursor-move bg-black/5 rounded-t-lg">
                        <div className="flex items-center space-x-1">
                            <Move className="h-3 w-3 text-gray-600" />
                            <span className="text-xs text-gray-600 font-medium">Note</span>
                        </div>
                        <div className="flex items-center space-x-1">
                            {isSelected && (
                                <div className="flex items-center space-x-1">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onDuplicate(note.id);
                                        }}
                                        className="p-1 hover:bg-black/10 rounded text-gray-600 hover:text-gray-800 transition-colors"
                                        title="Duplicate"
                                    >
                                        <Copy className="h-3 w-3" />
                                    </button>
                                </div>
                            )}
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onDelete(note.id);
                                }}
                                className="p-1 hover:bg-red-100 rounded text-gray-600 hover:text-red-600 transition-colors"
                                title="Delete"
                            >
                                <X className="h-3 w-3" />
                            </button>
                        </div>
                    </div>

                    {/* Note Content */}
                    <div className="p-3 h-full">
                        {isEditing ? (
                            <textarea
                                ref={textareaRef}
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                onBlur={handleSave}
                                onKeyDown={handleKeyDown}
                                className="w-full h-full resize-none border-none outline-none bg-transparent text-gray-800 placeholder-gray-500"
                                style={{
                                    fontSize: note.fontSize,
                                    fontFamily: note.fontFamily,
                                }}
                                placeholder="Type your note here..."
                            />
                        ) : (
                            <div
                                className="w-full h-full overflow-auto text-gray-800 whitespace-pre-wrap break-words cursor-text"
                                style={{
                                    fontSize: note.fontSize,
                                    fontFamily: note.fontFamily,
                                }}
                            >
                                {note.content || 'Empty note...'}
                            </div>
                        )}
                    </div>

                    {/* Resize Handle */}
                    {isSelected && (
                        <div
                            className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize bg-gray-400 hover:bg-gray-600 transition-colors"
                            style={{
                                clipPath: 'polygon(100% 0, 100% 100%, 0 100%)',
                            }}
                            onMouseDown={handleResize}
                        />
                    )}

                    {/* Selection indicator */}
                    {isSelected && (
                        <div className="absolute -top-1 -left-1 w-2 h-2 bg-blue-500 rounded-full"></div>
                    )}
                </div>
            </Draggable>

            {/* Context Menu */}
            {showContextMenu && (
                <div
                    ref={contextMenuRef}
                    className="fixed bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 py-1 z-50 min-w-[120px]"
                    style={{
                        left: contextMenuPos.x,
                        top: contextMenuPos.y,
                    }}
                >
                    {contextMenuItems.map((item, index) => (
                        <button
                            key={index}
                            onClick={item.action}
                            className={`w-full px-3 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2 transition-colors ${
                                item.danger
                                    ? 'text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20'
                                    : 'text-gray-700 dark:text-gray-300'
                            }`}
                        >
                            <item.icon className="h-4 w-4" />
                            <span>{item.label}</span>
                        </button>
                    ))}
                </div>
            )}
        </>
    );
}
