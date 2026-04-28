import React, { useState, useEffect } from 'react';
import InstructionScreen from './components/Instruction';
import MainApp from './components/MainUI';

export default function App() {
  const [showMain, setShowMain] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreen = () => {
      setIsMobile(window.innerWidth < 768); // mobile breakpoint
    };

    checkScreen(); // initial check
    window.addEventListener('resize', checkScreen);

    return () => window.removeEventListener('resize', checkScreen);
  }, []);

  if (isMobile) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        padding: '20px'
      }}>
        <h2>📱Mobile Not Supported</h2>
        <p>This application is designed for desktop use only.</p>
        <p>Please open it on a laptop or PC.</p>
      </div>
    );
  }

  return (
    <>
      {!showMain ? (
        <InstructionScreen onContinue={() => setShowMain(true)} />
      ) : (
        <MainApp setShowMain={setShowMain} />
      )}
    </>
  );
}