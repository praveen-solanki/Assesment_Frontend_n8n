import React, { useState, useEffect } from 'react';
import { useStore } from './store';

export const AnnotationSidebar = ({ isMobile }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [yPos, setYPos] = useState(200); // Draggable Y for the closed tab
  const [isDragging, setIsDragging] = useState(false);

  const stickyNotes = useStore((state) => state.stickyNotes);
  const nodeComments = useStore((state) => state.nodeComments);
  const updateStickyNote = useStore((state) => state.updateStickyNote);
  const resolveNodeComment = useStore((state) => state.resolveNodeComment);

  const unresolved = [
    ...stickyNotes.filter(n => !n.resolved).map(n => ({ ...n, origin: 'sticky' })),
    ...nodeComments.filter(c => !c.resolved).map(c => ({ ...c, origin: 'comment' }))
  ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  // Global listeners for dragging the trigger tab (only when closed)
  useEffect(() => {
    if (!isDragging || isOpen) return;

    const handlePointerMove = (e) => {
        // Constrain Y within viewport while dragging the tab
        setYPos(Math.max(100, Math.min(e.clientY - 22, window.innerHeight - 150)));
    };

    const handlePointerUp = () => {
        setIsDragging(false);
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    return () => {
        window.removeEventListener('pointermove', handlePointerMove);
        window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [isDragging, isOpen]);

  // Desktop styles
  const desktopSidebarStyle = {
    position: 'fixed',
    right: 0,
    top: '100px', // FIXED position when open (ignores yPos)
    bottom: '80px', 
    width: '300px',
    background: '#1c1c1f',
    borderLeft: '0.5px solid #2a2a2e',
    transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
    transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    zIndex: 1000,
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '-4px 0 12px rgba(0,0,0,0.3)',
    borderTopLeftRadius: '12px'
  };

  const desktopTriggerStyle = {
    position: 'fixed',
    right: 0,
    top: `${yPos}px`, // Dynamic Y position ONLY when closed
    width: '44px',
    height: '44px',
    background: '#1c1c1f',
    border: '1px solid #2a2a2e',
    borderRight: 'none',
    borderTopLeftRadius: '10px',
    borderBottomLeftRadius: '10px',
    cursor: isDragging ? 'grabbing' : 'grab',
    zIndex: 999,
    display: isOpen ? 'none' : 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'var(--text-secondary)',
    boxShadow: '-2px 0 8px rgba(0,0,0,0.2)',
    touchAction: 'none'
  };

  // Mobile styles (Bottom Sheet) - Unchanged for consistency
  const mobileSidebarStyle = {
    position: 'fixed',
    left: 0,
    right: 0,
    bottom: isOpen ? '0' : '-100%',
    height: '60dvh',
    background: '#1c1c1f',
    borderTop: '1px solid #2a2a2e',
    transition: 'bottom 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    zIndex: 1101,
    display: 'flex',
    flexDirection: 'column',
    borderTopLeftRadius: '20px',
    borderTopRightRadius: '20px',
    boxShadow: '0 -10px 25px rgba(0,0,0,0.5)'
  };

  const mobileTriggerStyle = {
    position: 'fixed',
    bottom: '100px',
    right: '20px',
    width: '56px',
    height: '56px',
    borderRadius: '50%',
    background: 'var(--accent-indigo)',
    boxShadow: 'var(--shadow-node)',
    border: 'none',
    color: 'white',
    fontSize: '24px',
    cursor: 'pointer',
    display: isOpen ? 'none' : 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1100
  };

  return (
    <>
      {/* Desktop Trigger (Movable when closed) */}
      {!isMobile && (
        <button 
          style={desktopTriggerStyle} 
          onClick={(e) => {
              if (!isDragging) setIsOpen(true);
          }}
          onPointerDown={(e) => {
              e.preventDefault();
              setIsDragging(true);
          }}
        >
          💬
        </button>
      )}

      {/* Mobile Trigger */}
      {isMobile && (
        <button style={mobileTriggerStyle} onClick={() => setIsOpen(true)}>
          📝
        </button>
      )}

      {/* Sidebar Panel (Fixed position when open) */}
      <div style={isMobile ? mobileSidebarStyle : desktopSidebarStyle}>
        {/* Header (No longer draggable) */}
        <div 
          style={{
            padding: '16px 20px',
            background: '#1c1c1f',
            borderBottom: '1px solid #2a2a2e',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderTopLeftRadius: '12px'
          }}
        >
          <h3 style={{ fontSize: '14px', margin: 0, color: 'var(--text-primary)', fontWeight: '700' }}>
            Annotations ({unresolved.length})
          </h3>
          <button 
            onClick={() => setIsOpen(false)}
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: 'none',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              height: '32px',
              padding: '0 12px',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '12px',
              fontWeight: '600',
              gap: '4px',
              transition: 'all 0.2s'
            }}
          >
            {!isMobile && <span>Close</span>}
            <span style={{ fontSize: '18px', lineHeight: '1' }}>{isMobile ? '↓' : '›'}</span>
          </button>
        </div>

        {/* Content Area */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
          {unresolved.length === 0 ? (
            <div style={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                justifyContent: 'center',
                gap: '12px',
                opacity: 0.8
            }}>
                <div style={{ fontSize: '32px' }}>✅</div>
                <span style={{ color: '#555', fontSize: '12px', fontWeight: '500' }}>
                    All caught up!
                </span>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {unresolved.map(item => (
                <div 
                  key={item.id}
                  style={{
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid #2a2a2e',
                    borderRadius: '10px',
                    padding: '14px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', marginBottom: '8px' }}>
                    <span style={{ color: 'var(--accent-indigo)', fontWeight: 'bold', textTransform: 'uppercase' }}>{item.author}</span>
                    <span style={{ color: '#555' }}>{new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  
                  <p style={{ fontSize: '12px', margin: '0 0 12px 0', color: 'var(--text-primary)', lineHeight: '1.5' }}>
                    {item.text || '(No content)'}
                  </p>

                  <button
                    onClick={() => {
                        if (item.origin === 'sticky') updateStickyNote(item.id, { resolved: true });
                        else resolveNodeComment(item.id);
                    }}
                    style={{
                      width: '100%',
                      padding: '8px',
                      fontSize: '11px',
                      fontWeight: '700',
                      background: 'rgba(16, 185, 129, 0.1)',
                      border: '1px solid rgba(16, 185, 129, 0.2)',
                      color: 'var(--accent-emerald)',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    Resolve
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Overlay for mobile bottom sheet */}
      {isMobile && isOpen && (
          <div 
            onClick={() => setIsOpen(false)}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(0,0,0,0.5)',
                zIndex: 1100,
                backdropFilter: 'blur(2px)'
            }}
          />
      )}
    </>
  );
};
