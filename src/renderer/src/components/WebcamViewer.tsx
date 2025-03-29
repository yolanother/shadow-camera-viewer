/* eslint-disable prettier/prettier */
import React, { useRef, useEffect, useState } from 'react';
import CameraSettings from './CameraSettings';
import './WebcamViewer.css';

interface WebcamViewerProps {
  deviceId: string;
  onBack: () => void;
}

interface ContextMenuPosition {
  x: number;
  y: number;
}

const WebcamViewer: React.FC<WebcamViewerProps> = ({ deviceId, onBack }) => {
  const [showSettings, setShowSettings] = useState(false);
  const [contextMenu, setContextMenu] = useState<ContextMenuPosition | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null); // Keep track of the stream

  useEffect(() => {
    const getWebcam = async (): Promise<void> => {
      try {
        // Request 4K resolution (3840x2160) for the selected camera
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            deviceId: { exact: deviceId },
            width: { ideal: 3840, max: 3840 },  // Request 4K resolution width
            height: { ideal: 2160, max: 2160 },  // Request 4K resolution height
            frameRate: { ideal: 60, max: 60 },  // Prefer 60 FPS
          },
        });
        streamRef.current = stream; // Store the stream
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
      } catch (err) {
        console.error('Error accessing webcam: ', err);
        alert('Unable to access the webcam at 4K resolution. Please check your device capabilities.');
      }
    };

    getWebcam();

    return (): void => {
      // Use streamRef for cleanup
      if (streamRef.current) {
        const tracks = streamRef.current.getTracks();
        tracks.forEach(track => track.stop());
        streamRef.current = null;
      }
      if (videoRef.current) {
        videoRef.current.srcObject = null; // Clear srcObject as well
      }
    };
  }, [deviceId]);

  useEffect(() => {
    const enterFullScreen = (): void => {
      const elem = document.documentElement;
      if (elem.requestFullscreen) {
        elem.requestFullscreen().catch(err => {
          console.error(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
        });
      }
    };

    // Attempt fullscreen on mount
    // enterFullScreen(); // Commenting out auto-fullscreen for easier debugging/interaction

    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') {
        if (document.fullscreenElement) {
          document.exitFullscreen();
        }
        onBack();
      }
    };

    const handleVideoClick = (): void => {
      if (!document.fullscreenElement) {
        enterFullScreen(); // Re-enter fullscreen if it's not active
      }
    };

    // Context menu handler
    const handleContextMenu = (event: MouseEvent): void => {
      event.preventDefault(); // Prevent default right-click menu
      // Show custom context menu at mouse position
      setContextMenu({ x: event.clientX, y: event.clientY });
      
      if (document.fullscreenElement) {
        document.exitFullscreen(); // Exit fullscreen before showing context menu
      }
    };
    
    // Handle clicks outside the context menu
    const handleOutsideClick = (): void => {
      if (contextMenu) {
        setContextMenu(null);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    document.addEventListener('click', handleOutsideClick);

    const currentVideoRef = videoRef.current; // Capture ref value
    if (currentVideoRef) {
      currentVideoRef.addEventListener('click', handleVideoClick);
      // Add the context menu listener using native addEventListener
      currentVideoRef.addEventListener('contextmenu', handleContextMenu as EventListener);
    }

    return (): void => {
      window.removeEventListener('keydown', handleKeyDown);
      if (currentVideoRef) {
        currentVideoRef.removeEventListener('click', handleVideoClick);
        // Remove the context menu listener
        currentVideoRef.removeEventListener('contextmenu', handleContextMenu as EventListener);
      }
    };
  }, [onBack, contextMenu]);

  return (
    <div className="webcam-container">
      <video
        ref={videoRef}
        className="webcam-video"
        autoPlay
        muted
        playsInline
      />
      
      {/* Custom Context Menu */}
      {contextMenu && (
        <div
          className="context-menu"
          style={{
            top: `${contextMenu.y}px`,
            left: `${contextMenu.x}px`
          }}
        >
          <div
            className="context-menu-item"
            onClick={() => {
              setContextMenu(null);
              setShowSettings(true);
            }}
          >
            Camera Settings
          </div>
        </div>
      )}
      
      {/* Camera Settings Overlay */}
      {showSettings && (
        <CameraSettings
          deviceId={deviceId}
          stream={streamRef.current}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  );
};

export default WebcamViewer;
