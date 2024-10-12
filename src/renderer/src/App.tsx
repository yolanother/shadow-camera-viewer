// src/App.tsx
import React, { useState } from 'react';
import './App.css';
import CameraChooser from './components/CameraChooser';
import WebcamViewer from './components/WebcamViewer';

const App: React.FC = () => {
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);

  return (
    <div className="App">
      {!selectedDeviceId ? (
        <CameraChooser onSelect={setSelectedDeviceId} />
      ) : (
        <WebcamViewer
          deviceId={selectedDeviceId}
          onBack={() => setSelectedDeviceId(null)}  // Return to camera chooser
        />
      )}
    </div>
  );
};

export default App;
