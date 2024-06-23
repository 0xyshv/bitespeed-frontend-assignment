import React, { useCallback, useState, useEffect } from 'react';
import {
  Controls,
  ReactFlow,
  addEdge,
  useNodesState,
  useEdgesState,
  Connection,
  Edge,
  Node,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { initialNodes, nodeTypes } from './nodes';
import { initialEdges, edgeTypes } from './edges';
import NodePanel from './components/nodePanel';
import SettingsPanel from './components/settingsPanel';

const STORAGE_KEY = 'reactflow_state';

const App: React.FC = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node[]>(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge[]>(initialEdges);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<'success' | 'error' | null>(null);

  useEffect(() => {
    const savedFlow = localStorage.getItem(STORAGE_KEY);
    if (savedFlow) {
      const { nodes, edges } = JSON.parse(savedFlow);
      setNodes(nodes);
      setEdges(edges);
    }
  }, [setNodes, setEdges]);

  const onConnect = useCallback(
    (connection: Connection | Edge) => {
      // Check if source already has an outgoing edge
      const existingEdges = edges.filter(edge => edge.source === connection.source && edge.sourceHandle === connection.sourceHandle);
      if (existingEdges.length > 0) {
        setMessageType('error');
        setMessage('Source handle can only have one outgoing edge.');
        return;
      }

      setEdges((eds) => addEdge(connection, eds));
    },
    [edges, setEdges]
  );

  const addNode = (node: Node) => {
    setNodes((nds) => [...nds, node]);
  };

  const handleNodeClick = (event: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
  };

  const handlePaneClick = () => {
    setSelectedNode(null);
  };

  const handleNodeUpdate = (updatedNode: Node) => {
    setNodes((nds) => nds.map((n) => (n.id === updatedNode.id ? updatedNode : n)));
  };

  const handleBack = () => {
    setSelectedNode(null);
  };

  const hasMultipleEmptyTargetHandles = (nodes: Node[], edges: Edge[]): boolean => {
    const targetNodeIds = new Set(edges.map(edge => edge.target));
    const nodesWithEmptyTargetHandles = nodes.filter(node => !targetNodeIds.has(node.id));
    return nodesWithEmptyTargetHandles.length > 1;
  };

  const saveFlow = () => {
    if (hasMultipleEmptyTargetHandles(nodes, edges)) {
      setMessageType('error');
      setMessage('There are more than one nodes with empty target handles.');
    } else {
      const flow = { nodes, edges };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(flow));
      setMessageType('success');
      setMessage('Flow saved successfully.');
    }
  };

  // Clear the timer if the component unmounts or message changes
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage(null);
        setMessageType(null);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleMessageClose = () => {
    setMessage(null);
    setMessageType(null);
  };


  return (
    <div className="flex flex-col h-screen">
      <div className="bg-slate-100 p-2 flex justify-between items-center pr-24">
        <p className='font-semibold'>
          ChatBot Flow Builder
        </p>
        {message && (
          <div className={`relative w-[600px] flex gap-2 items-center p-2 rounded ${messageType === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {message}
            <button onClick={handleMessageClose} className="absolute top-2 right-1 text-black  ">
              X
            </button>
          </div>
        )}
        <button
          onClick={saveFlow}
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
          onNodeClick={handleNodeClick}
          onPaneClick={handlePaneClick}
          fitView
        >
          <Controls />
        </ReactFlow>
        <div className="w-1/5 bg-white border-left border-slate-400 p-4 border-l">
          {selectedNode ? (
            <SettingsPanel
              selectedNode={selectedNode}
              onUpdate={handleNodeUpdate}
              onBack={handleBack}
            />
          ) : (
            <NodePanel onAdd={addNode} />
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
