import * as tslib_1 from "tslib";
import * as React from "react";
import { useMeasure } from "./use-measure";
import { GridContext } from "./GridContext";
import { GridItem } from "./GridItem";
import swap from "./swap";
import { getPositionForIndex, getTargetIndex } from "./helpers";
export function GridDropZone(_a) {
    var items = _a.items, id = _a.id, boxesPerRow = _a.boxesPerRow, children = _a.children, getKey = _a.getKey, _b = _a.disableDrag, disableDrag = _b === void 0 ? false : _b, _c = _a.disableDrop, disableDrop = _c === void 0 ? false : _c, rowHeight = _a.rowHeight, other = tslib_1.__rest(_a, ["items", "id", "boxesPerRow", "children", "getKey", "disableDrag", "disableDrop", "rowHeight"]);
    var _d = React.useContext(GridContext), traverse = _d.traverse, startTraverse = _d.startTraverse, endTraverse = _d.endTraverse, register = _d.register, onChange = _d.onChange, remove = _d.remove, getActiveDropId = _d.getActiveDropId;
    var ref = React.useRef(null);
    var bounds = useMeasure(ref).bounds;
    var _e = tslib_1.__read(React.useState(null), 2), draggingIndex = _e[0], setDraggingIndex = _e[1];
    var _f = tslib_1.__read(React.useState(null), 2), placeholder = _f[0], setPlaceholder = _f[1];
    var traverseIndex = traverse && !traverse.execute && traverse.targetId === id
        ? traverse.targetIndex
        : null;
    var grid = {
        columnWidth: bounds.width / boxesPerRow,
        boxesPerRow: boxesPerRow,
        rowHeight: rowHeight
    };
    /**
     * Register our dropzone with our grid context
     */
    React.useEffect(function () {
        register(id, {
            top: bounds.top,
            bottom: bounds.bottom,
            left: bounds.left,
            right: bounds.right,
            width: bounds.width,
            height: bounds.height,
            count: items.length,
            grid: grid,
            disableDrop: disableDrop
        });
    }, [items, disableDrop, bounds, id, grid]);
    /**
     * Unregister when unmounting
     */
    React.useEffect(function () {
        return function () { return remove(id); };
    }, [id]);
    // keep an initial list of our item indexes. We use this
    // when animating swap positions on drag events
    var itemsIndexes = items.map(function (_, i) { return i; });
    return (React.createElement("div", tslib_1.__assign({ ref: ref }, other), grid.columnWidth === 0
        ? null
        : items.map(function (item, i) {
            var isTraverseTarget = traverse &&
                traverse.targetId === id &&
                traverse.targetIndex === i;
            var order = placeholder
                ? swap(itemsIndexes, placeholder.startIndex, placeholder.targetIndex)
                : itemsIndexes;
            var pos = getPositionForIndex(order.indexOf(i), grid, traverseIndex);
            /**
             * Handle a child being dragged
             * @param state
             * @param x
             * @param y
             */
            function onMove(state, x, y) {
                if (draggingIndex !== i) {
                    setDraggingIndex(i);
                }
                var targetDropId = getActiveDropId(id, x + grid.columnWidth / 2, y + grid.rowHeight / 2);
                if (targetDropId && targetDropId !== id) {
                    startTraverse(id, targetDropId, x, y, i);
                }
                else {
                    endTraverse();
                }
                var targetIndex = targetDropId !== id
                    ? items.length
                    : getTargetIndex(i, grid, items.length, state.delta[0], state.delta[1]);
                if (targetIndex !== i) {
                    if ((placeholder && placeholder.targetIndex !== targetIndex) ||
                        !placeholder) {
                        setPlaceholder({
                            targetIndex: targetIndex,
                            startIndex: i
                        });
                    }
                }
                else if (placeholder) {
                    setPlaceholder(null);
                }
            }
            /**
             * Handle drag end events
             */
            function onEnd(state, x, y) {
                var targetDropId = getActiveDropId(id, x + grid.columnWidth / 2, y + grid.rowHeight / 2);
                var targetIndex = targetDropId !== id
                    ? items.length
                    : getTargetIndex(i, grid, items.length, state.delta[0], state.delta[1]);
                // traverse?
                if (traverse) {
                    onChange(traverse.sourceId, traverse.sourceIndex, traverse.targetIndex, traverse.targetId);
                }
                else {
                    onChange(id, i, targetIndex);
                }
                setPlaceholder(null);
                setDraggingIndex(null);
            }
            return (React.createElement(GridItem, { key: getKey(item), item: item, top: pos.xy[1], disableDrag: disableDrag, endTraverse: endTraverse, mountWithTraverseTarget: isTraverseTarget ? [traverse.tx, traverse.ty] : undefined, left: pos.xy[0], i: i, onMove: onMove, onEnd: onEnd, grid: grid, dragging: i === draggingIndex }, children));
        })));
}
