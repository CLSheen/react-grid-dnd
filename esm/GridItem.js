import * as tslib_1 from "tslib";
import * as React from "react";
import { useGestureResponder } from "react-gesture-responder";
import { animated, interpolate, useSpring } from "react-spring";
export function GridItem(_a) {
    var item = _a.item, top = _a.top, left = _a.left, children = _a.children, i = _a.i, isDragging = _a.dragging, onMove = _a.onMove, mountWithTraverseTarget = _a.mountWithTraverseTarget, grid = _a.grid, disableDrag = _a.disableDrag, endTraverse = _a.endTraverse, onEnd = _a.onEnd;
    var columnWidth = grid.columnWidth, rowHeight = grid.rowHeight;
    var dragging = React.useRef(false);
    var startCoords = React.useRef([left, top]);
    var _b = tslib_1.__read(useSpring(function () {
        if (mountWithTraverseTarget) {
            // this feels really brittle. unsure of a better
            // solution for now.
            return {
                xy: mountWithTraverseTarget,
                immediate: true,
                zIndex: "1",
                scale: 1.1,
                opacity: 0.8
            };
            endTraverse();
        }
        return {
            xy: [left, top],
            immediate: true,
            zIndex: "0",
            scale: 1,
            opacity: 1
        };
    }), 2), styles = _b[0], set = _b[1];
    // handle move updates imperatively
    function handleMove(state, e) {
        var x = startCoords.current[0] + state.delta[0];
        var y = startCoords.current[1] + state.delta[1];
        set({
            xy: [x, y],
            zIndex: "1",
            immediate: true,
            opacity: 0.8,
            scale: 1.1
        });
        onMove(state, x, y);
    }
    // handle end of drag
    function handleEnd(state) {
        var x = startCoords.current[0] + state.delta[0];
        var y = startCoords.current[1] + state.delta[1];
        dragging.current = false;
        onEnd(state, x, y);
    }
    var bind = useGestureResponder({
        onMoveShouldSet: function (state) {
            if (disableDrag) {
                return false;
            }
            startCoords.current = [left, top];
            dragging.current = true;
            return true;
        },
        onMove: handleMove,
        onTerminationRequest: function () {
            if (dragging.current) {
                return false;
            }
            return true;
        },
        onTerminate: handleEnd,
        onRelease: handleEnd
    }, {
        enableMouse: true
    }).bind;
    /**
     * Update our position when left or top
     * values change
     */
    React.useEffect(function () {
        if (!dragging.current) {
            set({
                xy: [left, top],
                zIndex: "0",
                opacity: 1,
                scale: 1,
                immediate: false
            });
        }
    }, [dragging.current, left, top]);
    return (React.createElement(animated.div, tslib_1.__assign({}, bind, { style: {
            cursor: "grab",
            zIndex: styles.zIndex,
            position: "absolute",
            width: columnWidth + "px",
            opacity: styles.opacity,
            height: rowHeight + "px",
            boxSizing: "border-box",
            transform: interpolate([styles.xy, styles.scale], function (xy, s) {
                return "translate3d(" + xy[0] + "px, " + xy[1] + "px, 0) scale(" + s + ")";
            })
        } }), children(item, i, {
        dragging: isDragging,
        disabled: !!disableDrag,
        grid: grid
    })));
}
