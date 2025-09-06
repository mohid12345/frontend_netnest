import React, { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { useFormik } from "formik";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import Cropper from "react-easy-crop";
import Loader from "../loader/loader";
import { addPost } from "../../services/user/apiMethods";

function getCroppedImg(imageSrc, crop) {
  const createImage = (
    url //helper fn to load img html img
  ) =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.addEventListener("load", () => resolve(image));
      image.addEventListener("error", (error) => reject(error));
      image.setAttribute("crossOrigin", "anonymous"); // For CORS image handling
      image.src = url;
    });

  return createImage(imageSrc).then((image) => {
    const canvas = document.createElement("canvas");
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext("2d");

    ctx.drawImage(
      //above code crops and here cropped img is drawn
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );

    return new Promise((resolve, reject) => {
      //return with cropped img url
      canvas.toBlob((blob) => {
        if (!blob) {
          toast.error("Image crop failed.");
          return;
        }
        blob.name = "cropped.jpeg";
        const croppedImageUrl = URL.createObjectURL(blob);
        resolve(croppedImageUrl);
        // console.log('cropped img url :', croppedImageUrl);//a localhos img url is generated
      }, "image/jpeg");
    });
  });
}

//handles crop mechanism and img adding from form
function CreatePost({ closeAddPost }) {
  const selectedUser = (state) => state.auth.user || "";
  const user = useSelector(selectedUser);
  const userId = user._id || "";
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [croppedImages, setCroppedImages] = useState([]); //for setting img for cloudinay
  const [selectedImage, setSelectedImage] = useState(croppedImages[0]);

  const navigate = useNavigate();

  const resetState = () => {
    formik.resetForm();
    setImages([]);
    setCroppedImages([]);
    setCurrentImageIndex(0);
  };

  const postinitialValues = {
    images: [],
    title: "",
    description: "",
  };

  const postvalidationSchema = Yup.object({
    // images: Yup.array()
    //   .min(1, "At least one image is required")
    //   .required("Image file required"),
    title: Yup.string()
      .trim()
      .required("Title is required")
      .matches(/^\S+.*\S$/, "Title cannot contain only spaces"),
    description: Yup.string()
      .trim()
      .required("Description is required")
      .matches(/^\S+.*\S$/, "Description cannot contain only spaces"),
  });

  const handleFileChange = useCallback((event) => {
    const files = Array.from(event.target.files);
    const validImageTypes = ["image/jpeg", "image/png", "image/gif"];
    const validFiles = files.filter((file) =>
      validImageTypes.includes(file.type)
    ); //checking the image type and filtering

    if (validFiles.length !== files.length) {
      // checking the actual arraya adn filtered array
      toast.error("Some files were not images and were excluded");
    }

    const imagePromises = validFiles.map((file) => {
      return new Promise((resolve) => {
        const reader = new FileReader(); //The FileReader API reads the file content and converts it into a base64-encoded data URL using reader.readAsDataURL(file)
        reader.onload = (e) => resolve(e.target.result);
        reader.readAsDataURL(file);
      });
    });

    Promise.all(imagePromises).then((results) => {
      //The resulting array of promises (one per valid file) is stored in imagePromises.Why Promise.all? Even though each FileReader instance only returns one value (a single image), the process is asynchronous for each file. If there are multiple files, you need to handle all of them concurrently and ensure that you don't proceed until all files are done processing. That's why Promise.all is used
      setImages((prevImages) => [...prevImages, ...results]);
    });
  }, []);

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const showCroppedImage = useCallback(async () => {
    try {
      const croppedImageUrl = await getCroppedImg(
        images[currentImageIndex],
        croppedAreaPixels
      );
      setCroppedImages((prev) => [...prev, croppedImageUrl]);
      // Always increment the currentImageIndex, even for the last image
      setCurrentImageIndex((prev) => prev + 1);
    } catch (e) {
      toast.error("Crop failed.");
    }
  }, [croppedAreaPixels, images, currentImageIndex]);

  const formik = useFormik({
    initialValues: postinitialValues,
    validationSchema: postvalidationSchema,
    onSubmit: async (values, { resetForm }) => {
      setLoading(true);
      const { title, description } = values;
      const imageUrls = [];

      try {

        for (let i = 0; i < croppedImages.length; i++) {
          const response = await fetch(croppedImages[i]);
          const blob = await response.blob();

          const formData = new FormData();
          formData.append("file", blob, `cropped_${i}.jpeg`);
          formData.append("upload_preset", import.meta.env.VITE_UPLOAD_PRESET);

          const cloudinaryResponse = await axios.post(
            import.meta.env.VITE_CLOUDINARY_URL,
            formData
          );
          imageUrls.push(cloudinaryResponse.data.url);
        }

        const postResponse = await addPost({
          userId,
          imgUrl: imageUrls,
          title,
          description,
        });

        if (postResponse.status === 200) {
          toast.success(postResponse.data.message);
          resetState();
          resetForm();
          closeAddPost();
          navigate("/");
          window.location.reload();
        } else {
          toast.error(postResponse.data.message);
        }
      } catch (error) {
        console.error("Error submitting post:", error);
        toast.error(
          error.response?.data?.message ||
            error.message ||
            "An error occurred while uploading the images or creating the post"
        );
      } finally {
        setLoading(false);
      }
    },
  });

  //detete selected image
  const handleDeleteImage = (index) => {
    if (croppedImages.length <= 1) {
      toast.info("Minimum one image needed");
    } else {
      const updatedImages = croppedImages.filter((_, i) => i !== index); // _ is the current element , so in my case this argument is not needed so its left as _ this is a conventiion of variable unused
      setCroppedImages(updatedImages);
    }
  };

  useEffect(() => {
    if (croppedImages.length > 0) {
      setSelectedImage(croppedImages[0]);
    } else {
      setSelectedImage(null); // Reset if there are no images
    }
  }, [croppedImages]);

  return (
    // page 1
    <div className="fixed w-screen h-screen top-0 left-0 z-50 bg-black bg-opacity-50 backdrop-blur-md ">
      <div className="flex justify-center items-center h-full">
        <div className="dark:bg-black bg-white p-10 space-y-4 w-full md:mx-80 rounded-md max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center">
            <h2 className="font-semibold text-xl text-gray-800 dark:text-white">
              Create new post
            </h2>
            <button
              onClick={closeAddPost}
              className="text-white px-2 py-2 rounded"
            >
              <svg
                className="w-6 h-6 text-gray-800 dark:text-white"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18 17.94 6M18 18 6.06 6"
                />
              </svg>
            </button>
          </div>

          {/* final upload */}
          {loading ? (
            <div className="max-w-md flex flex-col justify-center items-center mx-auto h-[70vh]">
              <Loader />
              <p className="mt-6 flex justify-center">Uploading...</p>
            </div>
          ) : (
            // first page
            <div className="max-w-md mx-auto h-[70vh]">
              {images.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full border border-dashed border-gray-400 p-4">
                  <svg
                    className="w-24 h-24 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M13 10a1 1 0 0 1 1-1h.01a1 1 0 1 1 0 2H14a1 1 0 0 1-1-1Z"
                      clipRule="evenodd"
                    />
                    <path
                      fillRule="evenodd"
                      d="M2 6a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v12c0 .556-.227 1.06-.593 1.422A.999.999 0 0 1 20.5 20H4a2.002 2.002 0 0 1-2-2V6Zm6.892 12 3.833-5.356-3.99-4.322a1 1 0 0 0-1.549.097L4 12.879V6h16v9.95l-3.257-3.619a1 1 0 0 0-1.557.088L11.2 18H8.892Z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <p className="text-gray-500 text-sm mb-2">
                    Select Images From Choose File
                  </p>
                  <label className="cursor-pointer bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
                    Choose Files
                    <input
                      type="file"
                      multiple
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </label>
                </div>
              ) : currentImageIndex < images.length ? (
                <div className="relative h-full w-full">
                  <Cropper
                    image={images[currentImageIndex]}
                    crop={crop}
                    zoom={zoom}
                    aspect={5.5/3}
                    onCropChange={setCrop}
                    onZoomChange={setZoom}
                    onCropComplete={onCropComplete}
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-white flex justify-center">
                    <button
                      onClick={showCroppedImage}
                      className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md"
                    >
                      {currentImageIndex === images.length - 1
                        ? "Crop Last Image"
                        : "Crop & Next"}
                    </button>
                  </div>
                </div>
              ) : (
                <form
                  onSubmit={formik.handleSubmit}
                  className="flex flex-col items-center h-full"
                >
                  <div className="flex overflow-x-auto w-full mb-4 ">
                    {croppedImages.map((img, index) => (
                      <div key={index} className="relative h-20 w-20 mr-2">
                        <img
                          src={img}
                          alt={`Cropped ${index + 1}`}
                          className="h-full w-full object-cover cursor-pointer rounded-md"
                          onClick={() => setSelectedImage(img)} //onclick selects the image
                        />

                        <button
                          onClick={() => handleDeleteImage(index)} // Add this function to handle image deletion
                          className="absolute top-0 right-0 bg-pink-500 text-white rounded-full h-5 w-5 flex items-center justify-center"
                        >
                          &times;
                        </button>
                      </div>
                    ))}
                  </div>

                  <div>
                    {selectedImage ? (
                      <img
                        src={selectedImage} // selected image from state
                        alt="selected"
                        className="h-80 w-full  object-contain"
                      />
                    ) : (
                      <p>No image selected</p>
                    )}
                  </div>

                  <input
                    type="text"
                    name="title"
                    placeholder="Write a caption.."
                    value={formik.values.title}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="mt-4 p-2 border-0 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none focus:ring-0 w-full"
                  />
                  {formik.touched.title && formik.errors.title && (
                    <div className="text-red-500">{formik.errors.title}</div>
                  )}
                  <input
                    type="text"
                    name="description"
                    placeholder="Write a description.."
                    value={formik.values.description}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="mt-4 p-2 border-0 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none focus:ring-0 w-full"
                  />
                  {formik.touched.description && formik.errors.description && (
                    <div className="text-red-500">
                      {formik.errors.description}
                    </div>
                  )}
                  <button
                    type="submit"
                    className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
                    disabled={formik.isSubmitting}
                  >
                    {formik.isSubmitting ? "Sharing..." : "Share"}
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CreatePost;
