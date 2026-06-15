import React, { useEffect } from 'react';
import { Handle, Position, useUpdateNodeInternals } from 'reactflow';
import { useStore } from '../store';

export const BaseNode = ({
  id,
  title,
  headerColor,
  children,
  inputHandles = [],
  outputHandles = [],
  minWidth = 260,
  style = {},
  isSpecial = false,
}) => {
  const updateNodeInternals = useUpdateNodeInternals();
  const deleteNode = useStore((state) => state.deleteNode);
  const nodeComments = useStore((state) => state.nodeComments);
  const showAnnotations = useStore((state) => state.showAnnotations);
  
  const comments = nodeComments.filter(c => c.nodeId === id);

  useEffect(() => {
    updateNodeInternals(id);
  }, [id, inputHandles.length, outputHandles.length, updateNodeInternals]);

  const maxHandles = Math.max(inputHandles.length, outputHandles.length);
  const computedMinHeight = Math.max(160, maxHandles * 48 + 48);

  return (
    <div
      style={{
        minWidth: '200px',
        maxWidth: '80vw',
        width: `${minWidth}px`,
        minHeight: `${computedMinHeight}px`,
        border: isSpecial ? `2px solid ${headerColor}` : '1px solid var(--border-color)',
        borderRadius: 'var(--border-radius-node)',
        background: 'var(--bg-node)',
        boxShadow: isSpecial ? `0 0 20px ${headerColor}33, var(--shadow-node)` : 'var(--shadow-node)',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        transition: 'border 0.2s, box-shadow 0.2s',
        ...style,
      }}
    >
      {/* Node Comments */}
      {showAnnotations && comments.length > 0 && (
          <div style={{ position: 'absolute', top: '-10px', right: '-10px', zIndex: 100, display: 'flex', gap: '4px' }}>
              {comments.map(comment => (
                  <div 
                    key={comment.id}
                    title={`${comment.author}: ${comment.text}`}
                    style={{
                      width: '16px',
                      height: '16px',
                      background: '#7c6fe0',
                      borderRadius: '50%',
                      border: '2px solid white',
                      cursor: 'pointer',
                      boxShadow: '0 0 4px #7c6fe0',
                      opacity: comment.resolved ? 0.3 : 1
                    }}
                  />
              ))}
          </div>
      )}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '12px 16px',
          background: 'var(--bg-node-header)',
          borderTopLeftRadius: 'calc(var(--border-radius-node) - 1px)',
          borderTopRightRadius: 'calc(var(--border-radius-node) - 1px)',
          borderBottom: '1px solid var(--border-color)',
          borderLeft: `5px solid ${headerColor}`,
          gap: '12px',
          overflow: 'hidden'
        }}
      >
        <span
          style={{
            color: 'var(--text-primary)',
            fontSize: '13px',
            fontWeight: '700',
            letterSpacing: '0.02em',
            userSelect: 'none',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            flex: 1
          }}
        >
          {title}
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
            {isSpecial && (
                <div style={{
                    background: headerColor,
                    color: 'white',
                    fontSize: '9px',
                    fontWeight: '900',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    textTransform: 'uppercase'
                }}>
                    Core
                </div>
            )}
            <button
                onClick={() => deleteNode(id)}
                className="nodrag"
                style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-label)',
                    cursor: 'pointer',
                    fontSize: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '32px',
                    height: '32px',
                    borderRadius: '4px',
                    transition: 'all 0.2s ease',
                    lineHeight: '1'
                }}
            >
                &times;
            </button>
        </div>
      </div>

      <div
        style={{
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          flex: 1,
        }}
      >
        {children}
      </div>

      {inputHandles.map((handle) => (
        <div
          key={handle.id}
          style={{
            position: 'absolute',
            left: '0',
            top: `${handle.position_pct}%`,
            display: 'flex',
            alignItems: 'center',
            transform: 'translate(-50%, -50%)',
            zIndex: 10,
          }}
        >
          {handle.label && (
            <span
              style={{
                position: 'absolute',
                right: '28px',
                fontSize: '10px',
                fontWeight: '700',
                color: 'var(--text-secondary)',
                textTransform: 'lowercase',
                pointerEvents: 'none',
                whiteSpace: 'nowrap',
                backgroundColor: 'rgba(13, 15, 20, 0.8)',
                padding: '2px 6px',
                borderRadius: '4px',
                border: '1px solid var(--border-color)',
              }}
            >
              ({handle.label})
            </span>
          )}
          <Handle
            type="target"
            position={Position.Left}
            id={handle.id}
            className="nodrag"
            style={{
              position: 'static',
              width: 'var(--handle-size)',
              height: 'var(--handle-size)',
              background: 'var(--bg-app)',
              border: `3px solid ${headerColor}`,
              transition: 'all 0.2s ease',
              color: headerColor,
            }}
          />
        </div>
      ))}

      {outputHandles.map((handle) => (
        <div
          key={handle.id}
          style={{
            position: 'absolute',
            right: '0',
            top: `${handle.position_pct}%`,
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'row-reverse',
            transform: 'translate(50%, -50%)',
            zIndex: 10,
          }}
        >
          {handle.label && (
            <span
              style={{
                position: 'absolute',
                left: '28px',
                fontSize: '10px',
                fontWeight: '700',
                color: 'var(--text-secondary)',
                textTransform: 'lowercase',
                pointerEvents: 'none',
                whiteSpace: 'nowrap',
                backgroundColor: 'rgba(13, 15, 20, 0.8)',
                padding: '2px 6px',
                borderRadius: '4px',
                border: '1px solid var(--border-color)',
              }}
            >
              ({handle.label})
            </span>
          )}
          <Handle
            type="source"
            position={Position.Right}
            id={handle.id}
            className="nodrag"
            style={{
              position: 'static',
              width: 'var(--handle-size)',
              height: 'var(--handle-size)',
              background: 'var(--bg-app)',
              border: `3px solid ${headerColor}`,
              transition: 'all 0.2s ease',
              color: headerColor,
            }}
          />
        </div>
      ))}
    </div>
  );
};
