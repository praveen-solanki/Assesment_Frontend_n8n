import React, { useState } from 'react';
import { BaseNode } from './BaseNode';
import { useStore } from '../store';

export const InputNode = ({ id, data }) => {
  const [currName, setCurrName] = useState(data?.inputName || id.replace('customInput-', 'input_'));
  const [inputType, setInputType] = useState(data.inputType || 'Text');
  const updateNodeField = useStore((state) => state.updateNodeField);

  const handleNameChange = (e) => {
    const value = e.target.value;
    setCurrName(value);
    updateNodeField(id, 'inputName', value);
  };

  const handleTypeChange = (e) => {
    const value = e.target.value;
    setInputType(value);
    updateNodeField(id, 'inputType', value);
  };

  return (
    <BaseNode
      id={id}
      title="Input"
      headerColor="var(--accent-indigo)"
      outputHandles={[{ id: `${id}-value`, label: 'value', position_pct: 50 }]}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div>
          <label>Variable Name</label>
          <input
            type="text"
            value={currName}
            onChange={handleNameChange}
            className="nodrag"
            placeholder="e.g. user_input"
          />
        </div>
        <div>
          <label>Source Type</label>
          <select
            value={inputType}
            onChange={handleTypeChange}
            className="nodrag"
          >
            <option value="Text">Text Stream</option>
            <option value="File">Binary File</option>
          </select>
        </div>
      </div>
    </BaseNode>
  );
};
