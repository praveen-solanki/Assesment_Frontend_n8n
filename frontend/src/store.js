// store.js

import { create } from "zustand";
import {
    addEdge,
    applyNodeChanges,
    applyEdgeChanges,
    MarkerType,
  } from 'reactflow';

export const useStore = create((set, get) => ({
    nodes: [],
    edges: [],
    getNodeID: (type) => {
        const newIDs = {...get().nodeIDs};
        if (newIDs[type] === undefined) {
            newIDs[type] = 0;
        }
        newIDs[type] += 1;
        set({nodeIDs: newIDs});
        return `${type}-${newIDs[type]}`;
    },
    addNode: (node) => {
        set({
            nodes: [...get().nodes, node]
        });
    },
    onNodesChange: (changes) => {
      set({
        nodes: applyNodeChanges(changes, get().nodes),
      });
    },
    onEdgesChange: (changes) => {
      set({
        edges: applyEdgeChanges(changes, get().edges),
      });
    },
    onConnect: (connection) => {
      set({
        edges: addEdge({
          ...connection, 
          type: 'smoothstep', 
          animated: true, 
          style: { 
            strokeWidth: 3, 
            stroke: '#6366f1',
            filter: 'drop-shadow(0 0 4px #6366f1)'
          },
          markerEnd: {
            type: MarkerType.Arrow, 
            height: '15px', 
            width: '15px', 
            color: '#6366f1'
          }
        }, get().edges),
      });
    },
    updateNodeField: (nodeId, fieldName, fieldValue) => {
      set({
        nodes: get().nodes.map((node) => {
          if (node.id === nodeId) {
            node.data = { ...node.data, [fieldName]: fieldValue };
          }
  
          return node;
        }),
      });
    },
    deleteNode: (nodeId) => {
        set({
            nodes: get().nodes.filter((node) => node.id !== nodeId),
            edges: get().edges.filter((edge) => edge.source !== nodeId && edge.target !== nodeId),
        });
    },
    deleteEdge: (edgeId) => {
        set({
            edges: get().edges.filter((edge) => edge.id !== edgeId),
        });
    },
    updateEdge: (edgeId, updates) => {
        set({
            edges: get().edges.map((edge) => edge.id === edgeId ? { ...edge, ...updates } : edge),
        });
    },

    // Annotations State
    stickyNotes: [],
    groupFrames: [],
    nodeComments: [],
    showAnnotations: true,
    annotateMode: null, // 'sticky' | 'frame' | 'comment'
    annotationColor: 'amber',

    setAnnotateMode: (mode) => set({ annotateMode: mode }),
    setAnnotationColor: (color) => set({ annotationColor: color }),
    toggleAnnotations: () => set({ showAnnotations: !get().showAnnotations }),

    addStickyNote: (note) => set({ stickyNotes: [...get().stickyNotes, note] }),
    updateStickyNote: (id, updates) => set({
        stickyNotes: get().stickyNotes.map(n => n.id === id ? { ...n, ...updates } : n)
    }),
    deleteStickyNote: (id) => set({
        stickyNotes: get().stickyNotes.filter(n => n.id !== id)
    }),

    addGroupFrame: (frame) => set({ groupFrames: [...get().groupFrames, frame] }),
    updateGroupFrame: (id, updates) => set({
        groupFrames: get().groupFrames.map(f => f.id === id ? { ...f, ...updates } : f)
    }),
    deleteGroupFrame: (id) => set({
        groupFrames: get().groupFrames.filter(f => f.id !== id)
    }),

    addNodeComment: (comment) => set({ nodeComments: [...get().nodeComments, comment] }),
    updateNodeComment: (id, updates) => set({
        nodeComments: get().nodeComments.map(c => n.id === id ? { ...c, ...updates } : c)
    }),
    deleteNodeComment: (id) => set({
        nodeComments: get().nodeComments.filter(c => c.id !== id)
    }),
    resolveNodeComment: (id) => set({
        nodeComments: get().nodeComments.map(c => c.id === id ? { ...c, resolved: true } : c)
    }),
  }));
