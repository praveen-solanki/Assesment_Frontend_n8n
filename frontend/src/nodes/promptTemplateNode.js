import React, { useState } from 'react';
import { BaseNode } from './BaseNode';
import { useStore } from '../store';

export const PromptTemplateNode = ({ id, data }) => {
  const [template, setTemplate] = useState(data?.template || '');
  const updateNodeField = useStore((state) => state.updateNodeField);

  const handleTemplateChange = (e) => {
    const value = e.target.value;
    setTemplate(value);
    updateNodeField(id, 'template', value);
  };

  return (
    <BaseNode
      id={id}
      title="Prompt Template"
      headerColor="var(--accent-violet)"
      inputHandles={[{ id: `${id}-context`, label: 'context', position_pct: 50 }]}
      outputHandles={[{ id: `${id}-prompt`, label: 'prompt', position_pct: 50 }]}
    >
      <div>
        <label>Template</label>
        <textarea
          rows={3}
          placeholder="Use {{var}} for variables..."
          value={template}
          onChange={handleTemplateChange}
          className="nodrag"
        />
      </div>
    </BaseNode>
  );
};
