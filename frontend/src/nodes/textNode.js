import React, { useState, useRef, useEffect, useMemo } from 'react';
import { BaseNode } from './BaseNode';
import { useStore } from '../store';
import { useUpdateNodeInternals } from 'reactflow';

function extractVariables(text) {
  const regex = /\{\{\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\}\}/g;
  const vars = new Set();
  let match;
  while ((match = regex.exec(text)) !== null) {
    vars.add(match[1]);
  }
  return Array.from(vars);
}

export const TextNode = ({ id, data }) => {
  const [currText, setCurrText] = useState(data?.text || '{{input}}');
  const [nodeWidth, setNodeWidth] = useState(240);
  const updateNodeField = useStore((state) => state.updateNodeField);
  const updateNodeInternals = useUpdateNodeInternals();
  
  const textareaRef = useRef(null);
  const sizingRef = useRef(null);

  const variables = useMemo(() => extractVariables(currText), [currText]);

  const handleTextChange = (e) => {
    const value = e.target.value;
    setCurrText(value);
    updateNodeField(id, 'text', value);
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
      updateNodeInternals(id);
    }
  }, [currText, id, updateNodeInternals]);

  useEffect(() => {
    if (sizingRef.current) {
      const width = Math.max(240, sizingRef.current.offsetWidth + 64);
      setNodeWidth(width);
      updateNodeInternals(id);
    }
  }, [currText, id, updateNodeInternals]);

  const inputHandles = variables.map((varName, i) => ({
    id: `${id}-${varName}`,
    label: varName,
    position_pct: ((i + 1) / (variables.length + 1)) * 100,
  }));

  return (
    <BaseNode
      id={id}
      title="Text"
      headerColor="var(--accent-amber)"
      minWidth={nodeWidth}
      inputHandles={inputHandles}
      outputHandles={[{ id: `${id}-output`, label: 'output', position_pct: 50 }]}
    >
      <div style={{ position: 'relative', width: '100%' }}>
        <label>Content</label>
        <textarea
          ref={textareaRef}
          value={currText}
          onChange={handleTextChange}
          className="nodrag"
          rows={1}
          style={{
            overflow: 'hidden',
            display: 'block',
            minHeight: '60px',
            resize: 'none',
            fontSize: '14px',
            width: '100%'
          }}
        />
        <span
          ref={sizingRef}
          style={{
            position: 'absolute',
            visibility: 'hidden',
            whiteSpace: 'pre-wrap',
            fontSize: '14px',
            lineHeight: '1.5',
            padding: '0 12px',
            left: 0,
            top: 0,
            maxWidth: 'calc(90vw - 40px)', // Fluid max width
          }}
        >
          {currText || ' '}
        </span>
      </div>
    </BaseNode>
  );
};
