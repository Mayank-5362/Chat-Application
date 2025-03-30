import React from 'react';

const DebugPanel = ({ messages, isConnected, clients }) => {
  const [showDebug, setShowDebug] = useState(false);

  if (!showDebug) {
    return (
      <button 
        onClick={() => setShowDebug(true)}
        style={{ 
          position: 'fixed', 
          bottom: '10px', 
          right: '10px',
          padding: '5px', 
          fontSize: '12px',
          backgroundColor: '#f0f0f0',
          border: '1px solid #ccc',
          cursor: 'pointer'
        }}
      >
        Show Debug
      </button>
    );
  }

  return (
    <div style={{
      position: 'fixed',
      bottom: '10px',
      right: '10px',
      width: '300px',
      height: '200px',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      color: 'white',
      padding: '10px',
      overflowY: 'auto',
      fontSize: '12px',
      zIndex: 1000,
      fontFamily: 'monospace'
    }}>
      <button 
        onClick={() => setShowDebug(false)}
        style={{ 
          position: 'absolute', 
          top: '5px', 
          right: '5px',
          padding: '2px 5px',
          backgroundColor: '#f44336',
          color: 'white',
          border: 'none',
          cursor: 'pointer'
        }}
      >
        X
      </button>
      <h3>Debug Info</h3>
      <p>Connected: {isConnected ? 'Yes' : 'No'}</p>
      <p>Clients: {clients}</p>
      <h4>Messages ({messages.length}):</h4>
      <pre>{JSON.stringify(messages, null, 2)}</pre>
    </div>
  );
};

export default DebugPanel;
