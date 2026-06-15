// draggableNode.js

import React from 'react';

export const DraggableNode = ({ type, label, color }) => {
    const onDragStart = (event, nodeType) => {
      const appData = { nodeType }
      event.target.style.cursor = 'grabbing';
      event.dataTransfer.setData('application/reactflow', JSON.stringify(appData));
      event.dataTransfer.effectAllowed = 'move';
    };
  
    return (
      <div
        className={type}
        onDragStart={(event) => onDragStart(event, type)}
        onDragEnd={(event) => {
            event.target.style.cursor = 'grab';
        }}
        style={{ 
          cursor: 'grab', 
          padding: '8px 16px',
          display: 'flex', 
          alignItems: 'center', 
          borderRadius: '24px',
          backgroundColor: 'var(--bg-node-header)',
          border: '1px solid var(--border-color)',
          justifyContent: 'center', 
          flexDirection: 'row',
          gap: '10px',
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          userSelect: 'none'
        }} 
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = color;
          e.currentTarget.style.boxShadow = `0 0 12px ${color}33`;
          e.currentTarget.style.transform = 'translateY(-1px)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = 'var(--border-color)';
          e.currentTarget.style.boxShadow = 'none';
          e.currentTarget.style.transform = 'translateY(0)';
        }}
        draggable
      >
          <div style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: color,
              boxShadow: `0 0 8px ${color}`
          }} />
          <span style={{ 
              color: 'var(--text-primary)',
              fontSize: '13px',
              fontWeight: '600',
              letterSpacing: '0.01em'
          }}>
              {label}
          </span>
      </div>
    );
  };
