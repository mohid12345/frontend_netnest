import React from 'react'
import getCropImg from '../../helpers/getCroppedImages'
import Cropper from 'react-easy-crop'

const CropImage = ({ imgUrl, aspectInit, setCroppedImg, handleNextImage }) => {
  const [disable, setDisable] = useState(false);
  const zoomInit = 1;
  const cropInit = { x: 0, y: 0 };
  
  const [zoom, setZoom] = useState(zoomInit);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [croppedAreaPx, setCroppedAreaPx] = useState(null);

  const onCropChange = (crop) => {
    setCrop(crop);
  };

  const onZoomChange = (zoom) => {
    setZoom(zoom);
  };

  const onCropComplete = (croppedArea, croppedAreaPxc) => {
    setCroppedAreaPx(croppedAreaPxc);
  };

  const onCrop = async () => {
    setDisable(true);
    try {
      // Assuming UseCropImage is replaced with getCroppedImg or similar function
      const croppedUrl = await getCropImg(imgUrl, croppedAreaPx); // Adjust this line based on your actual implementation
      setDisable(false);
      setCroppedImg(prevImages => [...prevImages, croppedUrl]);
      handleNextImage();
      console.log(croppedUrl);
    } catch (error) {
      setDisable(false);
      console.error('Error cropping image:', error);
    }
  };
  return (
    <div className="">
      <div className="fixed bg-black top-0 left-0 right-0 bottom-0 z-10"></div>
      <div className="fixed top-0 left-0 right-0 bottom-[120px] z-20">
        <Cropper
          image={imgUrl}
          zoom={zoom}
          crop={crop}
          aspect={aspectInit.value}
          onCropChange={onCropChange}
          onZoomChange={onZoomChange}
          onCropComplete={onCropComplete}
        />
      </div>
      <div className="fixed bottom-32 left-0 w-[100%] h-[80px] z-20">
        <div className="text-center">
          <input
            type="range"
            min={1}
            max={3}
            step={0.1}
            value={zoom}
            onInput={(e) => {
              onZoomChange(parseFloat(e.target.value));
            }}
            className="w-[50%]"
          />
        </div>
        <div className="text-center">
          <button type="button"
            className="bg-red-500 text-white px-4 p-1 mr-5 rounded-lg"
            onClick={() => setimgSelected(false)}
          >
            cancel
          </button>
          {disable ? (
            <button type="button" className="bg-green-500 text-white px-4 p-1 rounded-lg pointer-events-none">
              crop
            </button>
          ) : (
            <button
              className="bg-green-500 text-white px-4 p-1 rounded-lg"
              onClick={onCrop}
            >
              crop
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default CropImage