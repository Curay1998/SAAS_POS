declare module 'react-draggable' {
    import { Component, ReactNode } from 'react';

    export interface DraggableData {
        node: HTMLElement;
        x: number;
        y: number;
        deltaX: number;
        deltaY: number;
        lastX: number;
        lastY: number;
    }

    export interface DraggableProps {
        axis?: 'both' | 'x' | 'y' | 'none';
        bounds?: string | { left?: number; top?: number; right?: number; bottom?: number } | false;
        defaultClassName?: string;
        defaultClassNameDragging?: string;
        defaultClassNameDragged?: string;
        defaultPosition?: { x: number; y: number };
        disabled?: boolean;
        grid?: [number, number];
        handle?: string;
        cancel?: string;
        onStart?: (e: MouseEvent, data: DraggableData) => void | false;
        onDrag?: (e: MouseEvent, data: DraggableData) => void | false;
        onStop?: (e: MouseEvent, data: DraggableData) => void | false;
        onMouseDown?: (e: MouseEvent) => void;
        position?: { x: number; y: number };
        positionOffset?: { x: number | string; y: number | string };
        scale?: number;
        children: ReactNode;
    }

    export default class Draggable extends Component<DraggableProps> {}
}
