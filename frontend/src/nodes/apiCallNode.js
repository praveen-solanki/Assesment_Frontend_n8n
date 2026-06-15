import React, { useState } from 'react';
import { BaseNode } from './BaseNode';
import { useStore } from '../store';

export const ApiCallNode = ({ id, data }) => {
  const [url, setUrl] = useState(data?.url || '');
  const [method, setMethod] = useState(data?.method || 'GET');
  const updateNodeField = useStore((state) => state.updateNodeField);

  const handleUrlChange = (e) => {
    const value = e.target.value;
    setUrl(value);
    updateNodeField(id, 'url', value);
  };

  const handleMethodChange = (e) => {
    const value = e.target.value;
    setMethod(value);
    updateNodeField(id, 'method', value);
  };

  return (
    <BaseNode
      id={id}
      title="External API"
      headerColor="var(--accent-cyan)"
      inputHandles={[{ id: `${id}-payload`, label: 'payload', position_pct: 50 }]}
      outputHandles={[{ id: `${id}-response`, label: 'response', position_pct: 50 }]}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div>
          <label>Endpoint URL</label>
          <input
            type="text"
            placeholder="https://api.vshift.ai/v1/..."
            value={url}
            onChange={handleUrlChange}
            className="nodrag"
          />
        </div>
        <div>
          <label>Request Method</label>
          <select
            value={method}
            onChange={handleMethodChange}
            className="nodrag"
          >
            <option value="GET">GET</option>
            <option value="POST">POST</option>
            <option value="PUT">PUT</option>
            <option value="DELETE">DELETE</option>
          </select>
        </div>
      </div>
    </BaseNode>
  );
};
