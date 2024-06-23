import React, { useCallback, } from "react";
import {
  Controls,
  ReactFlow,
  addEdge,
  useNodesState,
  useEdgesState,
  Connection,
  Edge,
  Node,
} from "reactflow";

import "reactflow/dist/style.css";

import { initialNodes, nodeTypes } from "./nodes";
import { initialEdges, edgeTypes } from "./edges";
import NodePanel from "./components/nodePanel";

const App: React.FC = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node[]>(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge[]>(initialEdges);

  const onConnect = useCallback(
    (connection: Connection | Edge) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges]
  );

  const addNode = (node: Node) => {
    setNodes((nds) => [...nds, node]);
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="bg-slate-100 p-2 flex justify-end pr-24">
        <button
          // onClick={saveFlow}
          className="bg-transparent hover:bg-violet-500 text-violet-700 font-semibold hover:text-white py-2 px-4 border border-violet-500 hover:border-transparent rounded"
        >
          Save Flow
        </button>
      </div>
      <div className="flex flex-1">
        <ReactFlow
          nodes={nodes}
          nodeTypes={nodeTypes}
          onNodesChange={onNodesChange}
          edges={edges}
          edgeTypes={edgeTypes}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          fitView
        >
          <Controls />
        </ReactFlow>
        <div className="w-1/5 bg-white border-left border-slate-400 p-4 border-l">
          <NodePanel onAdd={addNode} />
        </div>
      </div>
    </div>
  );
};

export default App;
