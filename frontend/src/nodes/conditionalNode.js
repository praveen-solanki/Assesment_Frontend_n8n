import React, { useState } from 'react';
import { BaseNode } from './BaseNode';
import { useStore } from '../store';

export const ConditionalNode = ({ id, data }) => {
  const [condition, setCondition] = useState(data?.condition || '');
  const updateNodeField = useStore((state) => state.updateNodeField);

  const handleConditionChange = (e) => {
    const value = e.target.value;
    setCondition(value);
    updateNodeField(id, 'condition', value);
  };

  return (
    <BaseNode
      id={id}
      title="Conditional"
      headerColor="#b45309"
      inputHandles={[{ id: `${id}-input`, label: 'input', position_pct: 50 }]}
      outputHandles={[
        { id: `${id}-true`, label: 'true', position_pct: 33 },
        { id: `${id}-false`, label: 'false', position_pct: 66 },
      ]}
    >
      <div>
        <label>JS Condition</label>
        <input
          type="text"
          placeholder="e.g. results.score > 10"
          value={condition}
          onChange={handleConditionChange}
          className="nodrag"
        />
      </div>
    </BaseNode>
  );
};
