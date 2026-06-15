import { PipelineToolbar } from './toolbar';
import { PipelineUI } from './ui';
import { SubmitButton } from './submit';
import { AnnotationSidebar } from './AnnotationSidebar';
import { ReactFlowProvider } from 'reactflow';
import React, { useState, useEffect } from 'react';

function App() {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowWidth < 768;
  const isTablet = windowWidth >= 768 && windowWidth <= 1024;
  const isDesktop = windowWidth > 1024;

  return (
    <ReactFlowProvider>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        width: '100vw',
        backgroundColor: 'var(--bg-app)',
        overflow: 'hidden'
      }}>
        <PipelineToolbar isMobile={isMobile} isTablet={isTablet} isDesktop={isDesktop} />
        
        <div style={{ 
          flex: 1, 
          display: 'flex', 
          flexDirection: 'row', // Default to row for desktop/tablet
          minHeight: 0, 
          position: 'relative',
          overflow: 'hidden'
        }}>
          <PipelineUI isMobile={isMobile} isTablet={isTablet} isDesktop={isDesktop} />
          <AnnotationSidebar isMobile={isMobile} isTablet={isTablet} isDesktop={isDesktop} />
        </div>

        <SubmitButton isMobile={isMobile} isTablet={isTablet} isDesktop={isDesktop} />
      </div>
    </ReactFlowProvider>
  );
}

export default App;
