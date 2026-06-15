import React, { useState } from 'react';
import { getSmoothStepPath, EdgeLabelRenderer } from 'reactflow';
import { useStore } from '../store';

export const LabeledEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  data = {},
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [label, setLabel] = useState(data.label || '');
  const updateEdge = useStore((state) => state.updateEdge);
  const showAnnotations = useStore((state) => state.showAnnotations);

  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const onDoubleClick = (e) => {
    e.stopPropagation();
    setIsEditing(true);
  };

  const handleSave = () => {
    setIsEditing(false);
    updateEdge(id, { data: { ...data, label } });
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSave();
    if (e.key === 'Escape') setIsEditing(false);
  };

  return (
    <>
      <path
        id={id}
        style={style}
        className="react-flow__edge-path"
        d={edgePath}
        markerEnd={markerEnd}
      />
      {showAnnotations && (
        <EdgeLabelRenderer>
          <div
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              pointerEvents: 'all',
            }}
            className="nodrag nopan"
            onDoubleClick={onDoubleClick}
          >
            {(label || isEditing) && (
              <div
                style={{
                  background: 'var(--bg-edge-label)',
                  border: '1px solid var(--border-edge-label)',
                  color: 'var(--text-edge-label)',
                  padding: '3px 7px',
                  borderRadius: '4px',
                  fontSize: '11px',
                  fontWeight: 'bold',
                  cursor: 'text',
                }}
              >
                {isEditing ? (
                  <input
                    autoFocus
                    value={label}
                    onChange={(e) => setLabel(e.target.value)}
                    onBlur={handleSave}
                    onKeyDown={handleKeyDown}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: 'inherit',
                      fontFamily: 'inherit',
                      fontSize: 'inherit',
                      padding: 0,
                      width: '80px',
                      outline: 'none',
                    }}
                  />
                ) : (
                  label
                )}
              </div>
            )}
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
};
