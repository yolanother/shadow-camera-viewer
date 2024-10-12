// src/CameraChooser.tsx
import React, { useEffect, useState } from 'react';

interface CameraDevice {
  deviceId: string;
  label: string;
}

interface CameraChooserProps {
  onSelect: (deviceId: string) => void;
}

const CameraChooser: React.FC<CameraChooserProps> = ({ onSelect }) => {
  const [devices, setDevices] = useState<CameraDevice[]>([]);
  const [previews, setPreviews] = useState<{ [deviceId: string]: MediaStream }>({});

  useEffect(() => {
    const getDevices = async () => {
      try {
        const mediaDevices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = mediaDevices.filter(device => device.kind === 'videoinput');
        const deviceList = videoDevices.map(device => ({
          deviceId: device.deviceId,
          label: device.label || `Camera ${device.deviceId}`,
        }));
        setDevices(deviceList);
      } catch (err) {
        console.error('Error fetching devices:', err);
      }
    };

    getDevices();
  }, []);

  useEffect(() => {
    // Get preview streams for each device
    const getPreviewStreams = async () => {
      for (const device of devices) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { deviceId: { exact: device.deviceId } },
        });
        setPreviews(prev => ({ ...prev, [device.deviceId]: stream }));
      }
    };

    if (devices.length) {
      getPreviewStreams();
    }
  }, [devices]);

  return (
    <div className="camera-grid">
      {devices.map(device => (
        <div key={device.deviceId} className="camera-preview" onClick={() => onSelect(device.deviceId)}>
          <h4>{device.label}</h4>
          <video
            autoPlay
            muted
            playsInline
            ref={video => {
              if (video && previews[device.deviceId]) {
                video.srcObject = previews[device.deviceId];
              }
            }}
          />
        </div>
      ))}
    </div>
  );
};

export default CameraChooser;
