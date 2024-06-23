import { MessageCirclePlusIcon } from 'lucide-react';
import React from 'react';
import type { Node, NodeTypes } from "reactflow";
import { PositionLoggerNode } from '../nodes/PositionLoggerNode';

interface NodePanelProps {
  onAdd: (node: Node) => void;
}

const NodePanel: React.FC<NodePanelProps> = ({ onAdd }) => {
  const handleAddNode = () => {
    const newNode: Node = {
      id: `${Math.random()}`,
      type: 'position-logger',
      data: { label: 'Message' },
      position: { x: 250, y: 250 },
    };
    onAdd(newNode);
  };

  return (
    <div className="space-y-4">
      <button
        onClick={handleAddNode}
        className="w-40 bg-transparent hover:bg-transparent text-violet-700 font-semibold hover:text-violet-700 py-2 px-4 border border-violet-500 hover:border-violet-500 rounded"
      >
        <span className='flex flex-col justify-center items-center'>
          <MessageCirclePlusIcon className='' />
          <span>Message</span>
        </span>

      </button>
    </div>
  );
};

export default NodePanel;

export const nodeTypes = {
  "position-logger": PositionLoggerNode,
  // Add any of your custom nodes here!
} satisfies NodeTypes;