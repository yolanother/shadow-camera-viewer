import React, { useRef, useEffect } from 'react';

interface WebcamViewerProps {
  deviceId: string;
  onBack: () => void;
}

const WebcamViewer: React.FC<WebcamViewerProps> = ({ deviceId, onBack }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const getWebcam = async () => {
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

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, [deviceId]);

  useEffect(() => {
    const enterFullScreen = () => {
      const elem = document.documentElement;
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      }
    };

    enterFullScreen();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onBack();
      }
    };

    const handleVideoClick = () => {
      if (!document.fullscreenElement) {
        enterFullScreen(); // Re-enter fullscreen if it's not active
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    if (videoRef.current) {
      videoRef.current.addEventListener('click', handleVideoClick);
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (videoRef.current) {
        videoRef.current.removeEventListener('click', handleVideoClick);
      }
    };
  }, [onBack]);

  return (
    <div className="webcam-container">
      <video ref={videoRef} className="webcam-video" autoPlay muted playsInline />
    </div>
  );
};

export default WebcamViewer;
