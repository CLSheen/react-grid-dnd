/// <reference types="react" />
import { StateType } from "react-gesture-responder";
import { ChildRender, GridSettings } from "./grid-types";
declare type GridItemProps<T> = {
    item: T;
    grid: GridSettings;
    onMove: (state: StateType, x: number, y: number) => void;
    i: number;
    endTraverse: () => void;
    disableDrag?: boolean;
    onEnd: (state: StateType, x: number, y: number) => void;
    children: ChildRender<T>;
    dragging: boolean;
    top: number;
    left: number;
    /** values represent the starrt point where the item should mount */
    mountWithTraverseTarget?: [number, number];
};
export declare function GridItem<T>({ item, top, left, children, i, dragging: isDragging, onMove, mountWithTraverseTarget, grid, disableDrag, endTraverse, onEnd }: GridItemProps<T>): JSX.Element;
export {};
