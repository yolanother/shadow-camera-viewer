import React, { useRef, useEffect, useState } from 'react';

interface WebcamViewerProps {
  deviceId: string;
  onBack: () => void;
}

const WebcamViewer: React.FC<WebcamViewerProps> = ({ deviceId, onBack }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

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

      setIsFullscreen(true);
    };

    const exitFullScreen = () => {
      setIsFullscreen(false);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onBack();
        exitFullScreen();
      }
    };

    const handleVideoClick = () => {
      if (!document.fullscreenElement) {
        enterFullScreen(); // Re-enter fullscreen if it's not active
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    document.addEventListener('fullscreenchange', () => {
      if (!document.fullscreenElement) {
        exitFullScreen();
      }
    });

    if (videoRef.current) {
      videoRef.current.addEventListener('click', handleVideoClick);
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('fullscreenchange', exitFullScreen);
      if (videoRef.current) {
        videoRef.current.removeEventListener('click', handleVideoClick);
      }
    };
  }, [onBack]);

  return (
    <div className={`webcam-container ${isFullscreen ? 'hide-cursor' : ''}`}>
      <video ref={videoRef} className="webcam-video" autoPlay muted playsInline />
    </div>
  );
};

export default WebcamViewer;
