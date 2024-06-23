import { MessageSquareTextIcon } from "lucide-react";
import type { NodeProps } from "reactflow";
import { Handle, Position } from "reactflow";

export type PositionLoggerNodeData = {
  label?: string;
};

export function PositionLoggerNode({
  data,
}: NodeProps<PositionLoggerNodeData>) {


  return (
    // We add this class to use the same styles as React Flow's default nodes.
    <div className="border rounded w-44">
      <div className=" border border-bottom bg-green-300">
        <div className="flex justify-between items-center px-2 py-1">
          <div className="flex gap-1 items-center">
            <MessageSquareTextIcon className="w-3 h-3" />
            <h6 className="text-xs font-thin">Send Message</h6>
          </div>
          <div>
            <img src="/whatsapp.png" className="w-3 h-3" />
          </div>
        </div>
      </div>
      <div className="flex justify-center font-normal">
        {data.label && <div>{data.label}</div>}
      </div>

      <Handle type="target" position={Position.Left} isConnectableEnd />
      <Handle type="source" position={Position.Right} isConnectableStart />
    </div>
  );
}
