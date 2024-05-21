import * as React from "react";
import { storiesOf } from "@storybook/react";
import { GridContext, GridDropZone, GridContextProvider } from "../src";
import swap from "../src/swap";

const move = (
  source: Array<any>,
  destination: Array<any>,
  droppableSource: number,
  droppableDestination: number
) => {
  const sourceClone = Array.from(source);
  const destClone = Array.from(destination);

  const [removed] = sourceClone.splice(droppableSource, 1);

  destClone.splice(droppableDestination, 0, removed);

  return [sourceClone, destClone];
};

function DragBetweenExample({ single }: any) {
  const [left, setLeft] = React.useState([
    { id: 1, name: "ben" },
    { id: 2, name: "joe" },
    { id: 3, name: "jason" },
    { id: 4, name: "chris" },
    { id: 5, name: "heather" },
    { id: 6, name: "Richard" }
  ]);
  const [right, setRight] = React.useState([
    { id: 7, name: "george" },
    { id: 8, name: "rupert" },
    { id: 9, name: "alice" },
    { id: 10, name: "katherine" },
    { id: 11, name: "pam" },
    { id: 12, name: "katie" }
  ]);

  function addItem() {
    setLeft([
      {
        id: Math.random(),
        name: "roger"
      },
      ...left
    ]);
  }

  function onChange(
    sourceId: string,
    sourceIndex: number,
    targetIndex: number,
    targetId?: string
  ) {
    if (!targetId) {
      if (sourceId === "right") {
        const arr = swap(right, sourceIndex, targetIndex);
        setRight(arr);
      } else {
        setLeft(swap(left, sourceIndex, targetIndex));
      }
      return;
    }

    if (sourceId === "left") {
      const [p, d] = move(left, right, sourceIndex, targetIndex);

      setRight(d);
      setLeft(p);
    } else {
      const [d, p] = move(right, left, sourceIndex, targetIndex);
      setRight(d);
      setLeft(p);
    }
  }

  return (
    <GridContextProvider onChange={onChange}>
      <div
        style={{
          display: "flex",
          touchAction: "none"
        }}
      >
        <GridDropZone
          style={{
            flex: 1,
            height: "400px",
            border: "1px solid #bbb",
            borderRadius: "1rem",
            marginRight: "10px",
            touchAction: "none"
          }}
          id="left"
          boxesPerRow={4}
          getKey={item => item.id}
          rowHeight={70}
          items={left}
        >
          {item => {
            return (
              <div
                style={{
                  padding: "10px",
                  width: "100%",
                  height: "100%",
                  boxSizing: "border-box"
                }}
              >
                <div
                  style={{
                    width: "50px",
                    height: "50px",
                    boxSizing: "border-box",
                    background: "#08e",
                    display: "flex",
                    justifyContent: "center",
                    color: "white",
                    fontFamily: "helvetica",
                    alignItems: "center",
                    borderRadius: "50%"
                  }}
                >
                  {item.name[0].toUpperCase()}
                </div>
              </div>
            );
          }}
        </GridDropZone>

        {!single && (
          <GridDropZone
            style={{
              flex: 1,
              height: "400px",
              border: "1px solid #bbb",
              borderRadius: "1rem",
              marginLeft: "10px",
              touchAction: "none"
            }}
            id="right"
            getKey={item => item.id}
            boxesPerRow={4}
            rowHeight={70}
            items={right}
          >
            {item => {
              return (
                <div
                  style={{
                    padding: "10px",
                    width: "100%",
                    height: "100%",
                    boxSizing: "border-box"
                  }}
                >
                  <div
                    style={{
                      width: "50px",
                      height: "50px",
                      boxSizing: "border-box",
                      background: "#08e",
                      display: "flex",
                      justifyContent: "center",
                      color: "white",
                      fontFamily: "helvetica",
                      alignItems: "center",
                      borderRadius: "50%"
                    }}
                  >
                    {item.name[0].toUpperCase()}
                  </div>
                </div>
              );
            }}
          </GridDropZone>
        )}
      </div>
      <div>
        <button onClick={addItem}>add item</button>
      </div>
    </GridContextProvider>
  );
}

storiesOf("Hello", module)
  .add("Drag between", () => <DragBetweenExample />)
  .add("single", () => {
    return <DragBetweenExample single />;
  });
