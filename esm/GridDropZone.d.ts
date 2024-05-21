import * as React from "react";
import { ChildRender } from "./grid-types";
declare type GridDropZoneProps<T> = {
    items: T[];
    boxesPerRow: number;
    rowHeight: number;
    id: string;
    getKey: (item: T) => string | number;
    children: ChildRender<T>;
    disableDrag?: boolean;
    disableDrop?: boolean;
    style?: React.CSSProperties;
};
export declare function GridDropZone<T>({ items, id, boxesPerRow, children, getKey, disableDrag, disableDrop, rowHeight, ...other }: GridDropZoneProps<T>): JSX.Element;
export {};
