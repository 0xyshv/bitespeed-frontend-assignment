import React, { useState, useEffect } from 'react';
import type { Node } from 'reactflow';
import { ArrowLeftIcon } from 'lucide-react';

interface SettingsPanelProps {
  selectedNode: Node | null;
  onUpdate: (node: Node) => void;
  onBack: () => void; // onBack prop for going back to NodePanel
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ selectedNode, onUpdate, onBack }) => {
  const [label, setLabel] = useState<string>('');

  useEffect(() => {
    if (selectedNode) {
      setLabel(selectedNode.data.label || '');
    }
  }, [selectedNode]);

  const handleLabelChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLabel(event.target.value);
  };

  const handleSave = () => {
    if (selectedNode) {
      onUpdate({ ...selectedNode, data: { ...selectedNode.data, label } });
    }
  };

  if (!selectedNode) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center">
        <button onClick={onBack} className="mr-2">
          <ArrowLeftIcon />
        </button>
        <h3 className="text-xl font-bold">Message</h3>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Label</label>
        <input
          type="text"
          value={label}
          onChange={handleLabelChange}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
        />
      </div>
      <button
        onClick={handleSave}
        className="mt-2 bg-violet-500 text-white font-semibold py-2 px-4 rounded"
      >
        Save
      </button>
    </div>
  );
};

export default SettingsPanel;
