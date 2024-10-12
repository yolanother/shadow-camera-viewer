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
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { deviceId: { exact: deviceId } },
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
      } catch (err) {
        console.error('Error accessing webcam: ', err);
        alert('Unable to access the webcam. Please check permissions.');
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

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onBack]);

  return (
    <div className="webcam-container">
      <video ref={videoRef} className="webcam-video" autoPlay muted playsInline />
    </div>
  );
};

export default WebcamViewer;
