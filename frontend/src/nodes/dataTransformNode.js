import React, { useState } from 'react';
import { BaseNode } from './BaseNode';
import { useStore } from '../store';

export const DataTransformNode = ({ id, data }) => {
  const [transform, setTransform] = useState(data?.transform || 'JSON Parse');
  const updateNodeField = useStore((state) => state.updateNodeField);

  const handleTransformChange = (e) => {
    const value = e.target.value;
    setTransform(value);
    updateNodeField(id, 'transform', value);
  };

  return (
    <BaseNode
      id={id}
      title="Data Transform"
      headerColor="var(--accent-pink)"
      inputHandles={[{ id: `${id}-input`, label: 'input', position_pct: 50 }]}
      outputHandles={[{ id: `${id}-output`, label: 'output', position_pct: 50 }]}
    >
      <div>
        <label>Transform Logic</label>
        <select
          value={transform}
          onChange={handleTransformChange}
          className="nodrag"
        >
          <option value="JSON Parse">JSON Parse</option>
          <option value="JSON Stringify">JSON Stringify</option>
          <option value="Extract Field">Extract Field</option>
          <option value="Trim">Trim</option>
          <option value="Uppercase">Uppercase</option>
          <option value="Lowercase">Lowercase</option>
        </select>
      </div>
    </BaseNode>
  );
};
