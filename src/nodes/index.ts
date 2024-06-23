import type { Node, NodeTypes } from "reactflow";
import { TextMessageNode } from "./TextMessageNode";

export const initialNodes: Node[] = [
  {
    id: "a",
    type: "text-message",
    position: { x: -500, y: -100 },
    data: { label: "test-message 1" },
  },

  {
    id: "b",
    type: "text-message",
    position: { x: -200, y: 50 },
    data: { label: "test-message 2" },
  },
] satisfies Node[];

export const nodeTypes = {
  "text-message": TextMessageNode,
  // Add any of your custom nodes here!
} satisfies NodeTypes;
