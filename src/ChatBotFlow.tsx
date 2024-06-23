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
  useReactFlow,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { initialNodes, nodeTypes } from './nodes';
import { initialEdges, edgeTypes } from './edges';
import NodePanel from './components/nodePanel';
import SettingsPanel from './components/settingsPanel';
import { nanoid } from 'nanoid'
const STORAGE_KEY = 'reactflow_state';


const getId = () => `chatbotnode_${nanoid()}`;

const ChatBotFlow: React.FC = () => {

  // State hooks for nodes, edges, selected node, message, and message type

  const [nodes, setNodes, onNodesChange] = useNodesState<Node[]>(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge[]>(initialEdges);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<'success' | 'error' | null>(null);
  const { screenToFlowPosition } = useReactFlow();

  // Load saved flow from localStorage when the component mounts
  useEffect(() => {
    const savedFlow = localStorage.getItem(STORAGE_KEY);
    if (savedFlow) {
      const { nodes, edges } = JSON.parse(savedFlow);
      setNodes(nodes);
      setEdges(edges);
    }
  }, [setNodes, setEdges]);

  // Function to save the flow to localStorage
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

  // Callback function to handle connecting nodes
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

  // Function to add a new node
  const addNode = (node: Node) => {
    setNodes((nds) => [...nds, node]);
  };

  // Function to handle clicking on a node

  const handleNodeClick = (event: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
    console.log(event);

  };

  // Function to handle clicking on the pane (deselect node)
  const handlePaneClick = () => {
    setSelectedNode(null);
  };

  // Function to update a node
  const handleNodeUpdate = (updatedNode: Node) => {
    setNodes((nds) => nds.map((n) => (n.id === updatedNode.id ? updatedNode : n)));
  };

  // Function to handle going back from the settings panel
  const handleBack = () => {
    setSelectedNode(null);
  };

  // Drag and drop functionalities for message node
  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      const type = event.dataTransfer.getData("application/reactflow");
      // check if the dropped element is valid
      if (typeof type === "undefined" || !type) {
        return;
      }
      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });
      const newNode = {
        id: getId(),
        type,
        position,
        data: { label: `${type} node` },
      };
      addNode(newNode)
    },
    [screenToFlowPosition]
  );

  // Function to check if there are multiple nodes with empty target handles
  const hasMultipleEmptyTargetHandles = (nodes: Node[], edges: Edge[]): boolean => {
    const targetNodeIds = new Set(edges.map(edge => edge.target));
    const nodesWithEmptyTargetHandles = nodes.filter(node => !targetNodeIds.has(node.id));
    return nodesWithEmptyTargetHandles.length > 1;
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

  // Function to close the message
  const handleMessageClose = () => {
    setMessage(null);
    setMessageType(null);
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Header  */}
      <div className="bg-slate-100 p-2 flex justify-between items-center pr-24">
        <p className='font-bold text-violet-900'>
          ChatBot Flow Builder
        </p>
        {message && (
          <div className={`relative w-[600px] flex justify-center items-center p-2 rounded-lg ${messageType === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {message}
            <button onClick={handleMessageClose} className="absolute top-2 right-4 text-black  ">
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
      {/* Chatbot Flow  */}
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
          onDrop={onDrop}
          onDragOver={onDragOver}
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
            <NodePanel />
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatBotFlow;
