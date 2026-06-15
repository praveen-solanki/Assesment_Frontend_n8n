import React from 'react';
import { BaseNode } from './BaseNode';

export const LLMNode = ({ id, data }) => {
  return (
    <BaseNode
      id={id}
      title="Language Model"
      headerColor="var(--accent-red)"
      isSpecial={true}
      inputHandles={[
        { id: `${id}-system`, label: 'system', position_pct: 33 },
        { id: `${id}-prompt`, label: 'prompt', position_pct: 66 },
      ]}
      outputHandles={[{ id: `${id}-response`, label: 'response', position_pct: 50 }]}
    >
      <div style={{ 
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'center', 
          justifyContent: 'center', 
          height: '80px', 
          gap: '12px',
          background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.05) 0%, rgba(239, 68, 68, 0.1) 100%)',
          borderRadius: '8px',
          border: '1px dashed rgba(239, 68, 68, 0.2)'
      }}>
        <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: 'var(--accent-red)',
            boxShadow: '0 0 15px rgba(239, 68, 68, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '18px'
        }}>
            ✨
        </div>
        <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', textAlign: 'center' }}>
          Neural Engine Active
        </span>
      </div>
    </BaseNode>
  );
};
