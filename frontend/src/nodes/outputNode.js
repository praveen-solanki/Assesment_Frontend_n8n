import React, { useState } from 'react';
import { BaseNode } from './BaseNode';
import { useStore } from '../store';

export const OutputNode = ({ id, data }) => {
  const [currName, setCurrName] = useState(data?.outputName || id.replace('customOutput-', 'output_'));
  const [outputType, setOutputType] = useState(data.outputType || 'Text');
  const updateNodeField = useStore((state) => state.updateNodeField);

  const handleNameChange = (e) => {
    const value = e.target.value;
    setCurrName(value);
    updateNodeField(id, 'outputName', value);
  };

  const handleTypeChange = (e) => {
    const value = e.target.value;
    setOutputType(value);
    updateNodeField(id, 'outputType', value);
  };

  return (
    <BaseNode
      id={id}
      title="Output"
      headerColor="var(--accent-emerald)"
      inputHandles={[{ id: `${id}-value`, label: 'value', position_pct: 50 }]}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div>
          <label>Target Name</label>
          <input
            type="text"
            value={currName}
            onChange={handleNameChange}
            className="nodrag"
            placeholder="e.g. final_result"
          />
        </div>
        <div>
          <label>Response Format</label>
          <select
            value={outputType}
            onChange={handleTypeChange}
            className="nodrag"
          >
            <option value="Text">Plain Text</option>
            <option value="Image">Media/Image</option>
          </select>
        </div>
      </div>
    </BaseNode>
  );
};
