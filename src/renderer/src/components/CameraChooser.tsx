import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

interface CameraDevice {
  deviceId: string
  label: string
}

interface CameraChooserProps {
  onSelect: (deviceId: string) => void
}

const CameraChooser: React.FC<CameraChooserProps> = ({ onSelect }): JSX.Element => {
  const [devices, setDevices] = useState<CameraDevice[]>([])
  const [previews, setPreviews] = useState<{ [deviceId: string]: MediaStream }>({})
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null)

  useEffect(() => {
    const getDevices = async (): Promise<void> => {
      try {
        const mediaDevices = await navigator.mediaDevices.enumerateDevices()
        const videoDevices = mediaDevices.filter((device) => device.kind === 'videoinput')
        const deviceList = videoDevices.map((device) => ({
          deviceId: device.deviceId,
          label: device.label || `Camera ${device.deviceId}`
        }))
        setDevices(deviceList)
      } catch (err) {
        console.error('Error fetching devices:', err)
        toast.error('Error fetching camera devices.')
      }
    }

    getDevices()
  }, [])

  useEffect(() => {
    // Get preview streams for each device at lower resolution
    const getPreviewStreams = async (): Promise<void> => {
      for (const device of devices) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: {
              deviceId: { exact: device.deviceId },
              width: { ideal: 1920 },
              height: { ideal: 1080 }
            }
          })
          setPreviews((prev) => ({ ...prev, [device.deviceId]: stream }))
        } catch (err) {
          console.error('Error accessing device:', device.deviceId, err)
          toast.error(`Error accessing camera: ${device.label}`)
        }
      }
    }

    if (devices.length) {
      getPreviewStreams()
    }

    return (): void => {
      // Clean up all preview streams
      Object.values(previews).forEach((stream) => {
        stream.getTracks().forEach((track) => track.stop())
      })
    }
  }, [devices])

  const handleSelect = (deviceId: string): void => {
    // Stop preview streams when a camera is selected
    Object.values(previews).forEach((stream) => {
      stream.getTracks().forEach((track) => track.stop())
    })

    setSelectedDeviceId(deviceId)
    onSelect(deviceId)
  }

  return (
    <div className="camera-grid">
      {devices.map((device) => (
        <div
          key={device.deviceId}
          className="camera-preview"
          onClick={() => handleSelect(device.deviceId)}
        >
          <h4>{device.label}</h4>
          <video
            autoPlay
            muted
            playsInline
            ref={(video) => {
              if (video && previews[device.deviceId] && device.deviceId !== selectedDeviceId) {
                video.srcObject = previews[device.deviceId]
              }
            }}
          />
        </div>
      ))}
    </div>
  )
}

export default CameraChooser
