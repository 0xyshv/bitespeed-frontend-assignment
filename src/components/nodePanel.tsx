import { MessageCirclePlusIcon } from 'lucide-react';
import React from 'react';
import type { NodeTypes } from "reactflow";
import { TextMessageNode } from '../nodes/TextMessageNode';

const NodePanel: React.FC = () => {

  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <div className="space-y-4">
      <div
        className="w-40 bg-transparent hover:bg-transparent text-violet-700 font-semibold hover:text-violet-700 py-2 px-4 border border-violet-500 hover:border-violet-500 rounded"
        onDragStart={(event) => onDragStart(event, "text-message")}
        draggable
      >
        <span className='flex flex-col justify-center items-center'>
          <MessageCirclePlusIcon className='' />
          <span>Message</span>
        </span>
      </div>
    </div>
  );
};

export default NodePanel;

export const nodeTypes = {
  "text-message": TextMessageNode,
  // CAN ADD YOUR CUSTOM NODES HERE !!!
} satisfies NodeTypes;