import { DraggableNode } from './draggableNode';
import { useStore } from './store';
import React from 'react';

export const PipelineToolbar = ({ isMobile, isTablet, isDesktop }) => {
    const { 
        addGroupFrame, 
        toggleAnnotations, 
        showAnnotations,
        getNodeID,
        annotateMode,
        setAnnotateMode,
        annotationColor,
        setAnnotationColor
    } = useStore();
    
    const handleAddSticky = () => {
        setAnnotateMode(annotateMode === 'sticky' ? null : 'sticky');
    };

    const handleAddFrame = () => {
        const id = getNodeID('frame');
        addGroupFrame({
            id,
            type: 'frame',
            label: 'New Group',
            position: { x: 50, y: 50 },
            size: { width: 300, height: 200 },
            nodeIds: []
        });
    };

    const handleAddComment = () => {
        setAnnotateMode(annotateMode === 'comment' ? null : 'comment');
    };

    // Responsive scaling for labels
    const getLabel = (full, short) => {
        if (isDesktop) return full;
        if (isTablet) return short;
        return ''; // Mobile handled by FAB logic if needed, but here we show small text or icons
    };

    return (
        <div style={{ 
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            background: 'var(--bg-sidebar)',
            borderBottom: '1px solid var(--border-color)',
            zIndex: 100,
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            flexShrink: 0
        }}>
            {/* Main Node Bar */}
            <div style={{ 
                padding: '12px 24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '24px',
                overflowX: 'auto',
                scrollbarWidth: 'none'
            }}>
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  minWidth: 'max-content'
                }}>
                  <span style={{ 
                      color: 'var(--text-primary)', 
                      fontSize: '14px', 
                      fontWeight: '800',
                      letterSpacing: '0.05em',
                      textTransform: 'uppercase'
                  }}>
                      VectorShift
                  </span>
                  <span style={{ 
                      color: 'var(--text-label)', 
                      fontSize: '10px', 
                      fontWeight: '600',
                      textTransform: 'uppercase',
                      letterSpacing: '0.1em'
                  }}>
                      Pipeline Editor
                  </span>
                </div>

                <div style={{ height: '32px', width: '1px', background: 'var(--border-color)', flexShrink: 0 }} />

                <div style={{ display: 'flex', gap: '12px', flexWrap: 'nowrap' }}>
                    <DraggableNode type='customInput' label={getLabel('Input', 'In')} color="var(--accent-indigo)" />
                    <DraggableNode type='llm' label={getLabel('LLM', 'LLM')} color="var(--accent-red)" />
                    <DraggableNode type='customOutput' label={getLabel('Output', 'Out')} color="var(--accent-emerald)" />
                    <DraggableNode type='text' label={getLabel('Text', 'Txt')} color="var(--accent-amber)" />
                    <DraggableNode type='promptTemplate' label={getLabel('Prompt', 'Prm')} color="var(--accent-violet)" />
                    <DraggableNode type='apiCall' label={getLabel('API', 'API')} color="var(--accent-cyan)" />
                    <DraggableNode type='conditional' label={getLabel('Logic', 'If')} color="#b45309" />
                    <DraggableNode type='memory' label={getLabel('Memory', 'Mem')} color="var(--accent-teal)" />
                    <DraggableNode type='dataTransform' label={getLabel('Transform', 'Tsf')} color="var(--accent-pink)" />
                </div>
            </div>

            {/* Annotate Toolbar (Desktop/Tablet) */}
            <div style={{ 
                display: isMobile ? 'none' : 'flex', 
                alignItems: 'center', 
                gap: '16px', 
                borderTop: '1px solid var(--border-color)', 
                padding: '8px 24px',
                background: 'rgba(255,255,255,0.02)'
            }}>
                <span style={{ fontSize: '10px', fontWeight: 'bold', color: 'var(--text-label)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Annotate</span>
                
                <div style={{ display: 'flex', gap: '8px' }}>
                    <button 
                        onClick={handleAddSticky} 
                        style={{ ...btnStyle, border: annotateMode === 'sticky' ? '1px solid var(--accent-indigo)' : btnStyle.border }}
                    >
                        Sticky Note {isDesktop && (annotateMode === 'sticky' ? ' (Drop anywhere)' : '')}
                    </button>
                    <button 
                        onClick={handleAddComment} 
                        style={{ ...btnStyle, border: annotateMode === 'comment' ? '1px solid var(--accent-indigo)' : btnStyle.border }}
                    >
                        Node Comment {isDesktop && (annotateMode === 'comment' ? ' (Click a node)' : '')}
                    </button>
                    <button onClick={handleAddFrame} style={btnStyle}>Group Frame</button>
                    
                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center', marginLeft: '8px' }}>
                        {['amber', 'teal', 'coral'].map(c => (
                            <div 
                                key={c}
                                onClick={() => setAnnotationColor(c)}
                                style={{
                                    width: '16px',
                                    height: '16px',
                                    borderRadius: '50%',
                                    background: `var(--bg-sticky-${c})`,
                                    border: annotationColor === c ? '2px solid white' : `1px solid var(--border-sticky-${c})`,
                                    cursor: 'pointer',
                                    transition: 'transform 0.2s'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.2)'}
                                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                            />
                        ))}
                    </div>
                </div>

                <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center' }}>
                    <button 
                        onClick={toggleAnnotations} 
                        style={{ 
                            ...btnStyle, 
                            background: showAnnotations ? 'rgba(99, 102, 241, 0.1)' : 'var(--bg-node-header)',
                            borderColor: showAnnotations ? 'var(--accent-indigo)' : 'var(--border-color)',
                            color: showAnnotations ? 'var(--accent-indigo)' : 'var(--text-primary)'
                        }}
                    >
                        {showAnnotations ? 'Hide Annotations' : 'Show Annotations'}
                    </button>
                </div>
            </div>
        </div>
    );
};

const btnStyle = {
    background: 'var(--bg-node-header)',
    border: '1px solid var(--border-color)',
    borderRadius: '6px',
    color: 'var(--text-primary)',
    fontSize: '11px',
    padding: '6px 12px',
    cursor: 'pointer',
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: '0.02em',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
};
