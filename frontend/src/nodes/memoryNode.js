import React, { useState } from 'react';
import { BaseNode } from './BaseNode';
import { useStore } from '../store';

export const MemoryNode = ({ id, data }) => {
  const [key, setKey] = useState(data?.key || '');
  const [windowSize, setWindowSize] = useState(data?.windowSize || 10);
  const updateNodeField = useStore((state) => state.updateNodeField);

  const handleKeyChange = (e) => {
    const value = e.target.value;
    setKey(value);
    updateNodeField(id, 'key', value);
  };

  const handleSizeChange = (e) => {
    const value = parseInt(e.target.value) || 1;
    setWindowSize(value);
    updateNodeField(id, 'windowSize', value);
  };

  return (
    <BaseNode
      id={id}
      title="Global Memory"
      headerColor="var(--accent-teal)"
      inputHandles={[{ id: `${id}-write`, label: 'write', position_pct: 33 }]}
      outputHandles={[{ id: `${id}-read`, label: 'read', position_pct: 50 }]}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div>
          <label>Storage Key</label>
          <input
            type="text"
            placeholder="e.g. session_history"
            value={key}
            onChange={handleKeyChange}
            className="nodrag"
          />
        </div>
        <div>
          <label>Window Context</label>
          <input
            type="number"
            min="1"
            max="100"
            value={windowSize}
            onChange={handleSizeChange}
            className="nodrag"
          />
        </div>
      </div>
    </BaseNode>
  );
};
