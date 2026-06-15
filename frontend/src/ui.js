// ui.js
// Displays the drag-and-drop UI
// --------------------------------------------------

import React, { useState, useRef, useCallback, useEffect } from 'react';
import ReactFlow, { Background, MiniMap, Panel, useReactFlow } from 'reactflow';
import { useStore } from './store';
import { shallow } from 'zustand/shallow';
import { InputNode } from './nodes/inputNode';
import { LLMNode } from './nodes/llmNode';
import { OutputNode } from './nodes/outputNode';
import { TextNode } from './nodes/textNode';
import { PromptTemplateNode } from './nodes/promptTemplateNode';
import { ApiCallNode } from './nodes/apiCallNode';
import { ConditionalNode } from './nodes/conditionalNode';
import { MemoryNode } from './nodes/memoryNode';
import { DataTransformNode } from './nodes/dataTransformNode';
import { StickyNode } from './nodes/stickyNode';
import { FrameNode } from './nodes/frameNode';
import { LabeledEdge } from './nodes/labeledEdge';

import 'reactflow/dist/style.css';

const gridSize = 20;
const proOptions = { hideAttribution: true };
const nodeTypes = {
  customInput: InputNode,
  llm: LLMNode,
  customOutput: OutputNode,
  text: TextNode,
  promptTemplate: PromptTemplateNode,
  apiCall: ApiCallNode,
  conditional: ConditionalNode,
  memory: MemoryNode,
  dataTransform: DataTransformNode,
  sticky: StickyNode,
  frame: FrameNode,
};

const edgeTypes = {
  labeled: LabeledEdge,
};

const selector = (state) => ({
  nodes: state.nodes,
  edges: state.edges,
  stickyNotes: state.stickyNotes,
  groupFrames: state.groupFrames,
  getNodeID: state.getNodeID,
  addNode: state.addNode,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  onConnect: state.onConnect,
  deleteEdge: state.deleteEdge,
  addStickyNote: state.addStickyNote,
  addNodeComment: state.addNodeComment,
  annotateMode: state.annotateMode,
  setAnnotateMode: state.setAnnotateMode,
  annotationColor: state.annotationColor,
  deleteStickyNote: state.deleteStickyNote,
  deleteGroupFrame: state.deleteGroupFrame,
  updateStickyNote: state.updateStickyNote,
  updateGroupFrame: state.updateGroupFrame,
});

const STORAGE_KEY = 'vectorshift_viewport';

export const PipelineUI = ({ isMobile, isDesktop }) => {
  const reactFlowWrapper = useRef(null);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [isMiniMapVisible, setIsMiniMapVisible] = useState(isDesktop);

  const [miniMapPos, setMiniMapPos] = useState({ x: 20, y: 20 });
  const [isDraggingMap, setIsDraggingMap] = useState(false);

  const { zoomIn, zoomOut, fitView, setViewport } = useReactFlow();
  const {
    nodes,
    edges,
    stickyNotes,
    groupFrames,
    getNodeID,
    addNode,
    onNodesChange,
    onEdgesChange,
    onConnect,
    deleteEdge,
    addStickyNote,
    addNodeComment,
    annotateMode,
    setAnnotateMode,
    annotationColor,
    deleteStickyNote,
    deleteGroupFrame,
    updateStickyNote,
    updateGroupFrame,
  } = useStore(selector, shallow);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const viewport = JSON.parse(saved);
        setViewport(viewport);
      } catch (e) {
        fitView();
      }
    } else {
      setTimeout(fitView, 100);
    }
  }, [setViewport, fitView]);

  const onMoveEnd = useCallback((event, viewport) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(viewport));
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key.toLowerCase() === 'n' && !['input', 'textarea'].includes(document.activeElement.tagName.toLowerCase())) {
        const id = getNodeID('sticky');
        addStickyNote({
          id,
          type: 'sticky',
          text: '',
          color: annotationColor,
          author: 'VS',
          createdAt: new Date().toISOString(),
          position: reactFlowInstance ? reactFlowInstance.project({ x: window.innerWidth / 2, y: window.innerHeight / 2 }) : { x: 200, y: 200 },
          resolved: false,
        });
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [reactFlowInstance, getNodeID, addStickyNote, annotationColor]);

  useEffect(() => {
    if (!isDraggingMap) return;

    const handlePointerMove = (e) => {
      const bounds = reactFlowWrapper.current.getBoundingClientRect();
      setMiniMapPos({
        x: Math.max(10, Math.min(e.clientX - bounds.left - 100, bounds.width - 210)),
        y: Math.max(10, Math.min(bounds.height - (e.clientY - bounds.top) - 100, bounds.height - 200)),
      });
    };

    const handlePointerUp = () => {
      setIsDraggingMap(false);
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [isDraggingMap]);

  const onPaneClick = useCallback((event) => {
    if (!annotateMode || !reactFlowInstance) return;

    const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
    const position = reactFlowInstance.project({
      x: event.clientX - reactFlowBounds.left,
      y: event.clientY - reactFlowBounds.top,
    });

    if (annotateMode === 'sticky') {
      const id = getNodeID('sticky');
      addStickyNote({
        id,
        type: 'sticky',
        text: '',
        color: annotationColor,
        author: 'VS',
        createdAt: new Date().toISOString(),
        position,
        resolved: false,
      });
      setAnnotateMode(null);
    }
  }, [annotateMode, reactFlowInstance, getNodeID, addStickyNote, annotationColor, setAnnotateMode]);

  const onNodeClick = useCallback((event, node) => {
    if (annotateMode === 'comment') {
      const id = getNodeID('comment');
      addNodeComment({
        id,
        type: 'nodeComment',
        nodeId: node.id,
        text: 'New comment',
        author: 'VS',
        createdAt: new Date().toISOString(),
        resolved: false,
      });
      setAnnotateMode(null);
    }
  }, [annotateMode, getNodeID, addNodeComment, setAnnotateMode]);

  const onNodesDelete = useCallback((deleted) => {
    deleted.forEach((node) => {
      if (node.type === 'sticky') deleteStickyNote(node.id);
      if (node.type === 'frame') deleteGroupFrame(node.id);
    });
  }, [deleteStickyNote, deleteGroupFrame]);

  const allNodes = React.useMemo(() => {
    const frames = groupFrames.map((f) => ({
      id: f.id,
      type: 'frame',
      position: f.position,
      data: { label: f.label },
      style: { width: f.size.width, height: f.size.height, zIndex: -1 },
    }));

    const stickies = stickyNotes.map((s) => ({
      id: s.id,
      type: 'sticky',
      position: s.position,
      data: {
        text: s.text,
        color: s.color,
        author: s.author,
        createdAt: s.createdAt,
        resolved: s.resolved,
      },
      style: { width: 200, height: 150 },
    }));

    return [...frames, ...stickies, ...nodes];
  }, [nodes, stickyNotes, groupFrames]);

  const getInitNodeData = (nodeID, type) => {
    const nodeData = { id: nodeID, nodeType: `${type}` };
    return nodeData;
  };

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      if (event?.dataTransfer?.getData('application/reactflow')) {
        const appData = JSON.parse(event.dataTransfer.getData('application/reactflow'));
        const type = appData?.nodeType;

        if (typeof type === 'undefined' || !type) {
          return;
        }

        const position = reactFlowInstance.project({
          x: event.clientX - reactFlowBounds.left,
          y: event.clientY - reactFlowBounds.top,
        });

        const nodeID = getNodeID(type);
        const newNode = {
          id: nodeID,
          type,
          position,
          data: getInitNodeData(nodeID, type),
        };

        addNode(newNode);
      }
    },
    [reactFlowInstance, getNodeID, addNode],
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onEdgeClick = useCallback((event, edge) => {
    deleteEdge(edge.id);
  }, [deleteEdge]);

  const nodeColor = (node) => {
    switch (node.type) {
      case 'customInput': return '#6366f1';
      case 'llm': return '#ef4444';
      case 'customOutput': return '#10b981';
      case 'text': return '#f59e0b';
      case 'promptTemplate': return '#8b5cf6';
      case 'apiCall': return '#06b6d4';
      case 'conditional': return '#b45309';
      case 'memory': return '#14b8a6';
      case 'dataTransform': return '#ec4899';
      default: return '#475569';
    }
  };

  const handleArrange = () => {
    if (nodes.length === 0) return;
    const spacingX = 400;
    const spacingY = 240;
    const adj = {};
    const inDegree = {};
    nodes.forEach(n => {
      adj[n.id] = [];
      inDegree[n.id] = 0;
    });
    edges.forEach(e => {
      if (adj[e.source]) adj[e.source].push(e.target);
      if (inDegree[e.target] !== undefined) inDegree[e.target]++;
    });
    const queue = nodes.filter(n => inDegree[n.id] === 0).map(n => n.id);
    const nodeLevels = {};
    queue.forEach(id => { nodeLevels[id] = 0; });
    let head = 0;
    while (head < queue.length) {
      const u = queue[head++];
      const level = nodeLevels[u];
      (adj[u] || []).forEach(v => {
        nodeLevels[v] = Math.max(nodeLevels[v] || 0, level + 1);
        if (!queue.includes(v)) queue.push(v);
      });
    }
    nodes.forEach(n => { if (nodeLevels[n.id] === undefined) nodeLevels[n.id] = 0; });
    const levelGroups = {};
    Object.entries(nodeLevels).forEach(([id, lvl]) => {
      if (!levelGroups[lvl]) levelGroups[lvl] = [];
      levelGroups[lvl].push(id);
    });
    const changes = [];
    Object.entries(levelGroups).forEach(([lvl, ids]) => {
      ids.forEach((id, idx) => {
        changes.push({
          id,
          type: 'position',
          position: { x: parseInt(lvl) * spacingX, y: idx * spacingY },
        });
      });
    });
    onNodesChange(changes);
    setTimeout(() => fitView({ duration: 800 }), 50);
  };

  const isValidConnection = useCallback((connection) => {
    if (connection.source === connection.target) return false;
    const adj = new Map();
    nodes.forEach((n) => adj.set(n.id, []));
    edges.forEach((e) => {
      if (adj.has(e.source)) adj.get(e.source).push(e.target);
    });
    if (adj.has(connection.source)) {
      adj.get(connection.source).push(connection.target);
    } else {
      adj.set(connection.source, [connection.target]);
    }
    const visited = new Set();
    const stack = new Set();
    const hasCycle = (u) => {
      visited.add(u);
      stack.add(u);
      const neighbors = adj.get(u) || [];
      for (const v of neighbors) {
        if (!visited.has(v)) {
          if (hasCycle(v)) return true;
        } else if (stack.has(v)) {
          return true;
        }
      }
      stack.delete(u);
      return false;
    };
    for (const node of nodes) {
      if (!visited.has(node.id)) {
        if (hasCycle(node.id)) return true;
      }
    }
    return true;
  }, [nodes, edges]);

  return (
    <div
      ref={reactFlowWrapper}
      style={{
        flex: 1,
        minHeight: 0,
        backgroundColor: '#141416',
        position: 'relative',
      }}
      onPointerMove={(e) => {
          if (isDraggingMap) {
            const bounds = reactFlowWrapper.current.getBoundingClientRect();
            setMiniMapPos({
              x: Math.max(10, Math.min(e.clientX - bounds.left - 100, bounds.width - 210)),
              y: Math.max(10, Math.min(bounds.height - (e.clientY - bounds.top) - 100, bounds.height - 200)),
            });
          }
      }}
      onPointerUp={() => setIsDraggingMap(false)}
    >
      <ReactFlow
        nodes={allNodes}
        edges={edges}
        onNodesChange={(changes) => {
          onNodesChange(changes);
          changes.forEach((change) => {
            if (change.type === 'position' && change.position) {
              const sticky = stickyNotes.find((s) => s.id === change.id);
              if (sticky) updateStickyNote(change.id, { position: change.position });
              const frame = groupFrames.find((f) => f.id === change.id);
              if (frame) updateGroupFrame(change.id, { position: change.position });
            }
            if (change.type === 'dimensions' && change.dimensions) {
              const frame = groupFrames.find((f) => f.id === change.id);
              if (frame) updateGroupFrame(change.id, { size: change.dimensions });
            }
          });
        }}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onEdgeClick={onEdgeClick}
        onPaneClick={onPaneClick}
        onNodeClick={onNodeClick}
        onNodesDelete={onNodesDelete}
        onMoveEnd={onMoveEnd}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onInit={setReactFlowInstance}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        proOptions={proOptions}
        snapGrid={[gridSize, gridSize]}
        connectionLineType="smoothstep"
        isValidConnection={isValidConnection}
        colorMode="dark"
        nodesDraggable={!isMobile}
        nodesConnectable={!isMobile}
        elementsSelectable
        panOnScroll
        zoomOnPinch
        zoomOnDoubleTap
        panOnDrag
        preventScrolling
        defaultEdgeOptions={{
          type: 'labeled',
          animated: true,
          style: {
            strokeWidth: 3,
            stroke: '#6366f1',
            filter: 'drop-shadow(0 0 4px #6366f1)',
          },
          markerEnd: {
            type: 'arrow',
            color: '#6366f1',
            width: 15,
            height: 15,
          },
        }}
      >
        <Background color="#1e293b" gap={gridSize} variant="dots" />

        {isMiniMapVisible && (
          <Panel
            position="bottom-left"
            style={{
              margin: 0,
              left: `${miniMapPos.x}px`,
              bottom: `${miniMapPos.y}px`,
              position: 'absolute',
              cursor: isDraggingMap ? 'grabbing' : 'grab',
              touchAction: 'none',
            }}
          >
            <div
              onPointerDown={(e) => {
                e.stopPropagation();
                setIsDraggingMap(true);
              }}
              style={{
                padding: '4px',
                background: 'rgba(255,255,255,0.05)',
                borderRadius: '14px',
              }}
            >
              <MiniMap
                nodeColor={nodeColor}
                nodeStrokeWidth={3}
                zoomable
                pannable
                style={{ margin: 0, position: 'static' }}
              />
              <div
                style={{
                  position: 'absolute',
                  top: '4px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '30px',
                  height: '4px',
                  background: 'rgba(255,255,255,0.2)',
                  borderRadius: '2px',
                  pointerEvents: 'none',
                }}
              />
            </div>
          </Panel>
        )}

        <Panel
          position="bottom-right"
          style={{
            marginBottom: isMobile ? '20px' : (isMiniMapVisible ? '160px' : '20px'),
            marginRight: '12px',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              alignItems: 'flex-end',
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                background: 'var(--bg-sidebar)',
                border: '1px solid var(--border-color)',
                borderRadius: '10px',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-node)',
              }}
            >
              <button
                type="button"
                onClick={() => zoomIn()}
                style={controlBtnStyle}
                title="Zoom In"
              >
                +
              </button>
              <button
                type="button"
                onClick={() => zoomOut()}
                style={controlBtnStyle}
                title="Zoom Out"
              >
                −
              </button>
              <button
                type="button"
                onClick={() => fitView()}
                style={{
                  ...controlBtnStyle,
                  borderBottom: 'none',
                  fontSize: '10px',
                  fontWeight: 'bold',
                }}
                title="Fit View"
              >
                FIT
              </button>
            </div>

            {!isMobile && (
              <button
                type="button"
                onClick={() => setIsMiniMapVisible(!isMiniMapVisible)}
                style={{
                  background: 'var(--bg-sidebar)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '10px',
                  color: 'var(--text-secondary)',
                  padding: '12px',
                  cursor: 'pointer',
                  fontSize: '11px',
                  fontWeight: '700',
                  textTransform: 'uppercase',
                  boxShadow: 'var(--shadow-node)',
                  minWidth: '48px',
                  minHeight: '48px',
                }}
              >
                {isMiniMapVisible ? 'Hide' : 'Map'}
              </button>
            )}

            {!isMobile && (
              <button
                type="button"
                onClick={handleArrange}
                style={{
                  background: 'var(--bg-sidebar)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '10px',
                  color: 'var(--text-secondary)',
                  padding: '12px',
                  cursor: 'pointer',
                  fontSize: '11px',
                  fontWeight: '700',
                  textTransform: 'uppercase',
                  boxShadow: 'var(--shadow-node)',
                  minWidth: '48px',
                  minHeight: '48px',
                }}
              >
                Arrange
              </button>
            )}
          </div>
        </Panel>

        {allNodes.length === 0 && (
          <Panel position="top-center" style={{ marginTop: '120px' }}>
            <div
              style={{
                padding: '24px 32px',
                background: 'var(--bg-sidebar)',
                border: '1px dashed var(--accent-indigo)',
                borderRadius: '16px',
                color: 'var(--text-secondary)',
                fontSize: '14px',
                fontWeight: '600',
                textAlign: 'center',
                boxShadow: 'var(--shadow-node)',
                pointerEvents: 'none',
                userSelect: 'none',
                maxWidth: '85vw',
                lineHeight: '1.6',
              }}
            >
              {isMobile ? "Add nodes via the '+' button to begin." : 'Drag nodes from the toolbar to build your pipeline.'}
              <br />
              EMPTY CANVAS
            </div>
          </Panel>
        )}
      </ReactFlow>
    </div>
  );
};

const controlBtnStyle = {
  background: 'none',
  border: 'none',
  borderBottom: '1px solid var(--border-color)',
  color: 'white',
  padding: '12px',
  cursor: 'pointer',
  minWidth: '48px',
  minHeight: '48px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '18px',
};
