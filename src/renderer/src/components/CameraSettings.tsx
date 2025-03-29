/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react';
import './CameraSettings.css';

interface CameraSettingsProps {
  deviceId: string;
  stream: MediaStream | null;
  onClose: () => void;
}

interface Resolution {
  width: number;
  height: number;
  label: string;
}

const CameraSettings: React.FC<CameraSettingsProps> = ({ deviceId, stream, onClose }) => {
  const [resolutions, setResolutions] = useState<Resolution[]>([]);
  const [frameRates, setFrameRates] = useState<number[]>([]);
  const [selectedResolution, setSelectedResolution] = useState<string>('');
  const [selectedFrameRate, setSelectedFrameRate] = useState<string>('');

  useEffect(() => {
    if (stream) {
      const videoTrack = stream.getVideoTracks()[0];
      if (videoTrack) {
        // Get capabilities if supported
        if ('getCapabilities' in videoTrack) {
          const capabilities = videoTrack.getCapabilities();
          console.log('Camera capabilities:', capabilities);

          // Extract available resolutions
          if (capabilities.width && capabilities.height) {
            const availableResolutions: Resolution[] = [
              { width: 3840, height: 2160, label: '4K (3840x2160)' },
              { width: 1920, height: 1080, label: 'Full HD (1920x1080)' },
              { width: 1280, height: 720, label: 'HD (1280x720)' },
              { width: 640, height: 480, label: 'SD (640x480)' }
            ].filter(res => {
              // Filter resolutions based on camera capabilities
              const widthCap = capabilities.width as MediaTrackCapabilities['width'];
              const heightCap = capabilities.height as MediaTrackCapabilities['height'];

              return (!widthCap?.min || res.width >= widthCap.min) &&
                (!widthCap?.max || res.width <= widthCap.max) &&
                (!heightCap?.min || res.height >= heightCap.min) &&
                (!heightCap?.max || res.height <= heightCap.max);
            });

            setResolutions(availableResolutions);

            // Set current resolution as selected
            const currentWidth = videoTrack.getSettings().width;
            const currentHeight = videoTrack.getSettings().height;
            if (currentWidth && currentHeight) {
              setSelectedResolution(`${currentWidth}x${currentHeight}`);
            } else if (availableResolutions.length > 0) {
              setSelectedResolution(`${availableResolutions[0].width}x${availableResolutions[0].height}`);
            }
          }

          // Extract available framerates
          if (capabilities.frameRate) {
            const standardFrameRates = [60, 30, 24, 15];
            const frameRateCap = capabilities.frameRate as MediaTrackCapabilities['frameRate'];
            const availableFrameRates = standardFrameRates.filter(rate =>
              (!frameRateCap?.min || rate >= frameRateCap.min) &&
              (!frameRateCap?.max || rate <= frameRateCap.max)
            );

            setFrameRates(availableFrameRates);

            // Set current framerate as selected
            const currentFrameRate = videoTrack.getSettings().frameRate;
            if (currentFrameRate) {
              setSelectedFrameRate(currentFrameRate.toString());
            } else if (availableFrameRates.length > 0) {
              setSelectedFrameRate(availableFrameRates[0].toString());
            }
          }
        } else {
          // Fallback for browsers that don't support getCapabilities
          setResolutions([
            { width: 3840, height: 2160, label: '4K (3840x2160)' },
            { width: 1920, height: 1080, label: 'Full HD (1920x1080)' },
            { width: 1280, height: 720, label: 'HD (1280x720)' },
            { width: 640, height: 480, label: 'SD (640x480)' }
          ]);
          setFrameRates([60, 30, 24, 15]);
        }
      }
    }
  }, [stream, deviceId]);

  const applySettings = (): void => {
    if (stream) {
      const videoTrack = stream.getVideoTracks()[0];
      if (videoTrack && selectedResolution && selectedFrameRate) {
        const [width, height] = selectedResolution.split('x').map(Number);
        const frameRate = Number(selectedFrameRate);

        const constraints = {
          width: { ideal: width },
          height: { ideal: height },
          frameRate: { ideal: frameRate }
        };

        if ('applyConstraints' in videoTrack) {
          videoTrack.applyConstraints(constraints)
            .then(() => console.log('Applied new constraints:', constraints))
            .catch(err => console.error('Error applying constraints:', err));
        }
      }
    }
  };

  return (
    <div className="settings-overlay">
      <div className="settings-content">
        <h2>Camera Settings</h2>
        <p>Device ID: {deviceId.substring(0, 15)}...</p>

        <div className="settings-group">
          <label>Resolution:</label>
          <select
            value={selectedResolution}
            onChange={(e) => setSelectedResolution(e.target.value)}
          >
            {resolutions.map((res) => (
              <option key={`${res.width}x${res.height}`} value={`${res.width}x${res.height}`}>
                {res.label}
              </option>
            ))}
          </select>
        </div>

        <div className="settings-group">
          <label>Frame Rate:</label>
          <select
            value={selectedFrameRate}
            onChange={(e) => setSelectedFrameRate(e.target.value)}
          >
            {frameRates.map((rate) => (
              <option key={rate} value={rate.toString()}>
                {rate} FPS
              </option>
            ))}
          </select>
        </div>

        <div className="settings-actions">
          <button onClick={applySettings}>Apply</button>
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default CameraSettings;