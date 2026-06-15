import React from 'react';
import { useStore } from './store';
import { shallow } from 'zustand/shallow';

const selector = (state) => ({
  nodes: state.nodes,
  edges: state.edges,
});

export const SubmitButton = ({ isMobile, isTablet, isDesktop }) => {
  const { nodes, edges } = useStore(selector, shallow);

  const isDAG = React.useMemo(() => {
    if (nodes.length === 0) return true;
    const adj = new Map();
    nodes.forEach(n => adj.set(n.id, []));
    edges.forEach(e => {
        if (adj.has(e.source)) adj.get(e.source).push(e.target);
    });
    const visited = new Set();
    const stack = new Set();
    const hasCycle = (u) => {
        visited.add(u);
        stack.add(u);
        const neighbors = adj.get(u) || [];
        for (const v of neighbors) {
            if (!visited.has(v)) {
                if (hasCycle(v)) return true;
            } else if (stack.has(v)) return true;
        }
        stack.delete(u);
        return false;
    };
    for (const node of nodes) {
        if (!visited.has(node.id)) {
            if (hasCycle(node.id)) return false;
        }
    }
    return true;
  }, [nodes, edges]);

  const handleSubmit = async () => {
    try {
      const response = await fetch('http://localhost:9992/pipelines/parse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nodes, edges }),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const result = await response.json();

      alert(
        `Pipeline Analysis Complete\n\n` +
        `📦 Nodes: ${result.num_nodes}\n` +
        `🔗 Edges: ${result.num_edges}\n` +
        `✅ Valid DAG: ${result.is_dag ? 'Yes — no cycles detected' : 'No — cycles found'}`
      );
    } catch (err) {
      alert(`Error connecting to backend.\n\nMake sure the FastAPI server is running on port 9992:\n  cd backend && uvicorn main:app --reload --port 9992\n\nDetails: ${err.message}`);
    }
  };

  return (
    <footer style={{
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        padding: isMobile ? '12px 20px 24px 20px' : '16px 48px',
        background: 'var(--bg-sidebar)',
        borderTop: '1px solid var(--border-color)',
        boxShadow: '0 -4px 12px rgba(0,0,0,0.2)',
        zIndex: 1100,
        width: '100%',
        flexShrink: 0
    }}>
        <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ color: 'var(--text-label)', fontSize: '9px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                    Workspace Stats
                </span>
                <div style={{ display: 'flex', gap: '16px', marginTop: '2px' }}>
                    <span style={{ color: 'var(--text-primary)', fontSize: '13px', fontWeight: '700' }}>
                        Nodes: <span style={{ color: 'var(--accent-indigo)' }}>{nodes.length}</span>
                    </span>
                    <span style={{ color: 'var(--text-primary)', fontSize: '13px', fontWeight: '700' }}>
                        Edges: <span style={{ color: 'var(--accent-indigo)' }}>{edges.length}</span>
                    </span>
                </div>
            </div>
            
            <div style={{ height: '32px', width: '1px', background: 'var(--border-color)' }} />
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ 
                    width: '10px', 
                    height: '10px', 
                    borderRadius: '50%', 
                    backgroundColor: nodes.length === 0 ? 'var(--text-label)' : (isDAG ? 'var(--accent-emerald)' : 'var(--accent-red)'),
                    boxShadow: nodes.length === 0 ? 'none' : (isDAG ? '0 0 10px var(--accent-emerald)' : '0 0 10px var(--accent-red)'),
                    transition: 'all 0.3s'
                }} />
                <span style={{ color: 'var(--text-primary)', fontSize: '12px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {nodes.length === 0 ? 'Empty Canvas' : (isDAG ? 'Pipeline Healthy' : 'Cycle Detected')}
                </span>
            </div>
        </div>

        <button 
            onClick={handleSubmit}
            style={{
                background: 'var(--accent-indigo)',
                color: 'white',
                border: 'none',
                padding: '10px 48px',
                borderRadius: '30px',
                fontSize: '14px',
                fontWeight: '800',
                cursor: 'pointer',
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: '0 4px 14px rgba(99, 102, 241, 0.4)',
                minHeight: '44px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#4f46e5';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(99, 102, 241, 0.6)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'var(--accent-indigo)';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 14px rgba(99, 102, 241, 0.4)';
            }}
        >
            Deploy Pipeline
        </button>
    </footer>
  );
}
