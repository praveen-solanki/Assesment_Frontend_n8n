import React, { useState, useEffect } from 'react';
import { NodeResizer } from 'reactflow';
import { useStore } from '../store';

const colorMap = {
  amber: { bg: 'var(--bg-sticky-amber)', border: 'var(--border-sticky-amber)', text: 'var(--text-sticky-amber)' },
  teal: { bg: 'var(--bg-sticky-teal)', border: 'var(--border-sticky-teal)', text: 'var(--text-sticky-teal)' },
  coral: { bg: 'var(--bg-sticky-coral)', border: 'var(--border-sticky-coral)', text: 'var(--text-sticky-coral)' },
};

export const StickyNode = ({ id, data, selected }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(data.text || '');
  const updateStickyNote = useStore((state) => state.updateStickyNote);
  const deleteStickyNote = useStore((state) => state.deleteStickyNote);
  const showAnnotations = useStore((state) => state.showAnnotations);

  const colors = colorMap[data.color] || colorMap.amber;

  useEffect(() => {
    setText(data.text);
  }, [data.text]);

  const handleDoubleClick = () => setIsEditing(true);
  
  const handleSave = () => {
    setIsEditing(false);
    updateStickyNote(id, { text });
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') handleSave();
  };

  return (
    <div
      className={`${!showAnnotations ? 'annotation-hidden' : ''} ${data.resolved ? 'annotation-resolved' : ''}`}
      onDoubleClick={handleDoubleClick}
      style={{
        background: colors.bg,
        border: `1px solid ${colors.border}`,
        borderRadius: '8px',
        padding: '12px',
        minWidth: '150px',
        minHeight: '100px',
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: 'var(--shadow-node)',
        color: 'var(--text-primary)',
        fontSize: '12px',
        lineHeight: '1.45',
        position: 'relative',
        maxWidth: '85vw'
      }}
    >
      <NodeResizer minWidth={100} minHeight={80} isVisible={selected} />
      
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '8px',
        borderBottom: `1px solid ${colors.border}`,
        paddingBottom: '4px'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ color: colors.text, fontWeight: 'bold', fontSize: '10px' }}>
                {data.author || '??'}
            </span>
            <span style={{ fontSize: '9px', color: '#555' }}>
                {data.createdAt ? new Date(data.createdAt).toLocaleTimeString() : ''}
            </span>
        </div>
        <button
          onClick={() => deleteStickyNote(id)}
          className="nodrag"
          style={{
            background: 'none',
            border: 'none',
            color: '#555',
            cursor: 'pointer',
            fontSize: '24px',
            lineHeight: '1',
            minWidth: '44px',
            minHeight: '44px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          &times;
        </button>
      </div>

      <div style={{ flex: 1 }}>
        {isEditing ? (
          <textarea
            autoFocus
            value={text}
            onChange={(e) => setText(e.target.value)}
            onBlur={handleSave}
            onKeyDown={handleKeyDown}
            className="nodrag"
            style={{
              width: '100%',
              height: '100%',
              background: 'transparent',
              border: 'none',
              color: 'inherit',
              fontFamily: 'inherit',
              fontSize: 'inherit',
              resize: 'none',
              padding: 0,
              outline: 'none'
            }}
          />
        ) : (
          <div style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', overflow: 'hidden', textOverflow: 'ellipsis' }}>{text || 'Click to edit...'}</div>
        )}
      </div>

      {data.resolved && (
          <div style={{
              position: 'absolute',
              top: '4px',
              right: '32px',
              fontSize: '9px',
              color: 'var(--accent-emerald)',
              fontWeight: 'bold'
          }}>
              RESOLVED
          </div>
      )}
    </div>
  );
};
