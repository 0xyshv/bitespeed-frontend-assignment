import type { Node, NodeTypes } from "reactflow";
import { PositionLoggerNode } from "./PositionLoggerNode";

export const initialNodes = [
  {
    id: "a",
    type: "position-logger",
    position: { x: -200, y: 50 },
    data: { label: "Node 1" },
  },

  {
    id: "b",
    type: "position-logger",
    position: { x: 0, y: 200 },
    data: { label: "Node 2" },
  },
] satisfies Node[];

export const nodeTypes = {
  "position-logger": PositionLoggerNode,
  // Add any of your custom nodes here!
} satisfies NodeTypes;