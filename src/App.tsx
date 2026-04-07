import React, { useEffect } from 'react';
import { HexMapProvider, useHexMap } from './context/HexMapContext';
import TopToolbar from './components/Toolbars/TopToolbar';
import LeftToolbar from './components/Toolbars/LeftToolbar';
import HexGrid from './components/HexGrid/HexGrid';
import DrawCanvas from './components/DrawCanvas/DrawCanvas';
import styles from './App.module.css';

const AppInner: React.FC = () => {
  const { undo } = useHexMap();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && !e.shiftKey && e.key === 'z') {
        e.preventDefault();
        undo();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [undo]);

  return (
    <div className={styles.app}>
      <TopToolbar />
      <div className={styles.body}>
        <LeftToolbar />
        <div className={styles.main}>
          <HexGrid />
          <DrawCanvas />
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => (
  <HexMapProvider>
    <AppInner />
  </HexMapProvider>
);

export default App;