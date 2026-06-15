import React, { useState } from 'react';
import { NodeResizer } from 'reactflow';
import { useStore } from '../store';

export const FrameNode = ({ id, data, selected }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [label, setLabel] = useState(data.label || 'Group Frame');
  const updateGroupFrame = useStore((state) => state.updateGroupFrame);
  const showAnnotations = useStore((state) => state.showAnnotations);

  const handleDoubleClick = () => setIsEditing(true);
  
  const handleSave = () => {
    setIsEditing(false);
    updateGroupFrame(id, { label });
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === 'Escape') handleSave();
  };

  return (
    <div
      className={!showAnnotations ? 'annotation-hidden' : ''}
      style={{
        width: '100%',
        height: '100%',
        border: '1.5px dashed var(--border-frame)',
        borderRadius: '8px',
        position: 'relative',
        background: 'rgba(58, 58, 80, 0.05)',
        pointerEvents: 'all'
      }}
    >
      <NodeResizer minWidth={200} minHeight={150} isVisible={selected} />
      
      <div
        onDoubleClick={handleDoubleClick}
        style={{
          position: 'absolute',
          top: '-24px',
          left: '0',
          color: 'var(--label-frame)',
          fontSize: '12px',
          fontWeight: 'bold',
          letterSpacing: '0.05em',
          cursor: 'text',
          userSelect: 'none'
        }}
      >
        {isEditing ? (
          <input
            autoFocus
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            onBlur={handleSave}
            onKeyDown={handleKeyDown}
            className="nodrag"
            style={{
              background: 'var(--bg-sidebar)',
              border: '1px solid var(--border-color)',
              color: 'inherit',
              fontSize: 'inherit',
              fontWeight: 'inherit',
              padding: '2px 8px',
              borderRadius: '4px',
              outline: 'none'
            }}
          />
        ) : (
          label
        )}
      </div>
    </div>
  );
};
