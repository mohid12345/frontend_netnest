import React from 'react'
import { useState } from 'react'
import Cropper from 'react-easy-crop'


function CropImg() {
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)

  const onCropComplete = (croppedArea, croppedAreaPixels) => {
    console.log(croppedArea, croppedAreaPixels)
  }

  return (
    <div>
      <Cropper
      image={yourImage}
      crop={crop}
      zoom={zoom}
      aspect={4 / 3}
      onCropChange={setCrop}
      onCropComplete={onCropComplete}
      onZoomChange={setZoom}
    />
    </div>
  )
}

export default CropImg