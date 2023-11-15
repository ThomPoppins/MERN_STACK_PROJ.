import React, { useEffect, useState, useCallback, useRef } from 'react'
import PropTypes from 'prop-types'
import { AiOutlineClose } from 'react-icons/ai'
import { BACKEND_URL } from '../../../config'
import { useDropzone } from 'react-dropzone'
import ReactCrop from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'
import store from '../../store/store.jsx'
import axios from 'axios'
import { useSnackbar } from 'notistack'

// Canvas image crop component to crop the selected image
const setCanvasImage = (image, canvas, crop) => {
  if (!crop || !canvas || !image) {
    return
  }

  // **Information:**
  // https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement/naturalWidth
  // https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement/naturalHeight
  // https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement/width
  // https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement/height
  // https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/getContext
  // https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D
  // https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/imageSmoothingQuality
  // https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/drawImage
  // https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/setTransform
  // https://developer.mozilla.org/en-US/docs/Web/API/Window/devicePixelRatio
  // https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/drawImage
  // https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/imageSmoothingQuality

  // scaleX is the ratio of the original image width to the displayed image width,
  // for example if the original image width is 100px and the displayed image width is 50px, then scaleX = 2
  const scaleX = image.naturalWidth / image.width
  // scaleY is the ratio of the original image height to the displayed image height,
  const scaleY = image.naturalHeight / image.height
  // Get the canvas context, 2D means 2 dimensional context
  const ctx = canvas.getContext('2d')
  // refer https://developer.mozilla.org/en-US/docs/Web/API/Window/devicePixelRatio
  // The ratio of the resolution in physical pixels to the resolution in CSS pixels for the current display device.
  const pixelRatio = window.devicePixelRatio

  // Set the canvas width and height
  canvas.width = crop.width * pixelRatio * scaleX
  canvas.height = crop.height * pixelRatio * scaleY

  // refer https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/setTransform
  // Sets the transformation matrix to the matrix given by the arguments as described below.
  // The matrix is applied to the canvas context in the same way that it is applied when drawing objects onto a canvas.
  // The transformation matrix is applied before the current transformation matrix.
  // The arguments are as follows:
  // a (m11)
  // Horizontal scaling. A value of 1 results in no scaling.
  // b (m12)
  // Vertical skewing. Which means it distorts the shape of the object you are transforming.
  // c (m21)
  // Horizontal skewing. Which means it distorts the shape of the object you are transforming.
  // d (m22)
  // Vertical scaling. A value of 1 results in no scaling. A negative value flips the object vertically.
  // e (dx)
  // Horizontal translation (moving). A positive value moves the object to the right.
  // f (dy)
  // Vertical translation (moving). A positive value moves the object down.
  ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)

  // refer https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/imageSmoothingQuality
  // The imageSmoothingQuality property of the CanvasRenderingContext2D interface, part of the Canvas API,
  // determines the quality of image smoothing (which is on by default).
  // The value must be one of the following strings, or the default value will be used:
  // low
  // medium
  // high
  ctx.imageSmoothingQuality = 'high'

  // refer https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/drawImage
  // The image will be scaled to fit the dimensions of the destination rectangle,
  // if the source and destination rectangles aren't the same size.
  // If the source and destination rectangles are the same size, the image will not be scaled.
  // The source rectangle is the rectangle representing the portion of the image you want to draw.
  // The destination rectangle is the rectangle representing the location and size you want to draw the image in the canvas.
  // The arguments are as follows:
  // image
  // An element to draw into the context. The specification permits any canvas image source (CanvasImageSource),
  // such as an HTMLImageElement, an HTMLVideoElement, an HTMLCanvasElement or an ImageBitmap.
  // sx
  // The X coordinate of the top left corner of the sub-rectangle of the source image to draw into the destination context.
  // sy
  // The Y coordinate of the top left corner of the sub-rectangle of the source image to draw into the destination context.
  // sWidth
  // The width of the sub-rectangle of the source image to draw into the destination context.
  // sHeight
  // The height of the sub-rectangle of the source image to draw into the destination context.
  // dx
  // The X coordinate in the destination canvas at which to place the top-left corner of the source image.
  // dy
  // The Y coordinate in the destination canvas at which to place the top-left corner of the source image.
  // dWidth
  // The width to draw the image in the destination canvas. This allows scaling of the drawn image.
  // dHeight
  // The height to draw the image in the destination canvas. This allows scaling of the drawn image.
  // ctx.drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
  ctx.drawImage(
    image,
    crop.x * scaleX,
    crop.y * scaleY,
    crop.width * scaleX,
    crop.height * scaleY,
    0,
    0,
    crop.width * scaleX,
    crop.height * scaleY,
  )
}

// Modal to edit user profile picture
const EditProfilePictureModal = ({ userId, onClose }) => {
  // The selected file
  const [upImg, setUpImg] = useState(),
    // imgRef is the reference to the image to be cropped
    // useRef is used to access the DOM element
    imgRef = useRef(null),
    // previewCanvasRef is the reference to the canvas to preview the cropped image
    previewCanvasRef = useRef(null),
    // crop is the crop object, it contains the crop details and is used to crop the image
    [crop, setCrop] = useState({
      unit: 'px',
      width: '290',
      height: '290',
      aspect: 1,
    }),
    // completedCrop is the completed crop object, it contains the completed crop details
    [completedCrop, setCompletedCrop] = useState(null),
    // EnqueueSnackbar is used to show a snackbar notification
    { enqueueSnackbar } = useSnackbar(),
    // Function that will be called when an image or file is dropped
    // on the dropzone. It will read the file and set the upImg state.
    // https://react-dropzone.js.org/
    // useCallback is used to prevent the function from being recreated on every render
    // https://reactjs.org/docs/hooks-reference.html#usecallback
    onDrop = useCallback((acceptedFiles) => {
      acceptedFiles.forEach((file) => {
        // File reader to read the file
        const reader = new FileReader()

        reader.readAsDataURL(file)
        // Read the file as a binary string
        // https://developer.mozilla.org/en-US/docs/Web/API/FileReader/readAsBinaryString
        // https://developer.mozilla.org/en-US/docs/Web/API/FileReader
        // https://developer.mozilla.org/en-US/docs/Web/API/FileReader/onload
        // https://developer.mozilla.org/en-US/docs/Web/API/FileReader/onerror
        // https://developer.mozilla.org/en-US/docs/Web/API/FileReader/onabort
        // https://developer.mozilla.org/en-US/docs/Web/API/FileReader/readAsArrayBuffer
        // https://developer.mozilla.org/en-US/docs/Web/API/FileReader/readAsDataURL
        // https://developer.mozilla.org/en-US/docs/Web/API/FileReader/readAsText
        // .onabort: A handler for the abort event. This event is triggered each time the reading operation is aborted.
        reader.onabort = () => console.log('file reading was aborted')
        // .onerror: A handler for the error event. This event is triggered each time the reading operation encounter an error.
        reader.onerror = () => console.log('file reading has failed')
        // .onload: A handler for the load event. This event is triggered each time the reading operation is successfully completed.
        reader.onload = () => {
          // Binary string of the file contents
          const base64String = reader.result

          console.log('base64String: ', base64String)

          console.log('blob: ', file)
        }
        reader.readAsArrayBuffer(file)
      }, [])
    }, []),
    // Handle file select
    onSelectFile = (event) => {
      // Check if the event has a file
      if (event.target.files && event.target.files.length > 0) {
        // Create a file reader
        const reader = new FileReader()
        // Set the file reader onload event listener to set the upImg state to the file in the callback function
        reader.addEventListener('load', () => setUpImg(reader.result))
        // Start the reading task of the file the function above is listening to the load event
        // Because the file is read asynchronously, the event listener is set before the file is read
        // https://developer.mozilla.org/en-US/docs/Web/API/FileReader/readAsDataURL
        // The format of the result will be "data:[<mediatype>][;base64],<data>"
        reader.readAsDataURL(event.target.files[0])
      }
    },
    // onLoad is the function to be called when the image is loaded
    onLoad = useCallback((img) => {
      // Set the imgRef to the img element
      imgRef.current = img
    }, []),
    generateImageFile = (canvas, imageCrop) => {
      if (!imageCrop || !canvas) {
        return
      }

      // https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toBlob
      // https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toDataURL
      // .toBlob() method creates a Blob object representing the image contained in the canvas
      canvas.toBlob(
        // Callback function to be invoked after the Blob object is created
        (blob) => {
          // Create a URL for the Blob object
          const previewUrl = window.URL.createObjectURL(blob)
          // Create an anchor element
          // const anchor = document.createElement('a')
          // Set the anchor element attributes
          // anchor.download = 'cropPreview.png'
          // Set the anchor element href attribute
          // anchor.href = URL.createObjectURL(blob)
          // Set the anchor element target attribute
          // anchor.click()
          // Revoke the URL for the Blob object
          window.URL.revokeObjectURL(previewUrl)

          // Create a FormData object to send the image file to the backend
          const formData = new FormData()

          // Append the image file to the FormData object
          formData.append('image', blob)

          axios
            .post(`${BACKEND_URL}/upload/image`, formData, {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            })
            .then((response) => {
              if (response.data.imageId) {
                // Save the image id of the profile picture to the user's document in the database
                axios
                  .put(`${BACKEND_URL}/users/profile-picture`, {
                    imageId: response.data.imageId,
                    userId,
                  })
                  // eslint-disable-next-line no-shadow
                  .then((response) => {
                    // Get the user's updated document from the database and update the user state
                    axios
                      .get(`${BACKEND_URL}/users/user/${userId}`)
                      // eslint-disable-next-line no-shadow
                      .then((response) => {
                        const userData = response.data
                        store.dispatch({
                          type: 'USER',
                          payload: userData,
                        })

                        // Show a snackbar notification
                        enqueueSnackbar('Profile picture updated', {
                          variant: 'success',
                          preventDuplicate: true,
                        })
                      })
                      .catch((error) => {
                        console.log(
                          'ERROR in EditProfilePictureModal from /users/user/:id: ',
                          error,
                          response,
                        )

                        // Show a snackbar notification
                        enqueueSnackbar('Something went wrong', {
                          variant: 'error',
                          preventDuplicate: true,
                        })
                      })
                  })
                  .catch((error) => {
                    console.log('ERROR from /users/profile-picture: ', error)

                    // Show a snackbar notification
                    enqueueSnackbar('Something went wrong', {
                      variant: 'error',
                      preventDuplicate: true,
                    })
                  })
              }
            })
            .catch((error) => {
              console.log('ERROR from /upload/image route: ', error)

              // Show a snackbar notification
              enqueueSnackbar('Something went wrong', {
                variant: 'error',
                preventDuplicate: true,
              })
            })
        },
        // The image format to get the output in
        'image/png',
        1,
      )
    },
    // Generate cropped image file download
    generateDownload = (canvas, downloadCrop) => {
      if (!downloadCrop || !canvas) {
        return
      }
      // https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toBlob
      // https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toDataURL
      // .toBlob() method creates a Blob object representing the image contained in the canvas
      canvas.toBlob(
        // Callback function to be invoked after the Blob object is created
        (blob) => {
          // Create a URL for the Blob object
          const previewUrl = window.URL.createObjectURL(blob)

          // Create an anchor element
          const anchor = document.createElement('a')
          // Set the anchor element attributes
          anchor.download = 'cropPreview.png'
          // Set the anchor element href attribute
          anchor.href = URL.createObjectURL(blob)
          // Set the anchor element target attribute
          anchor.click()
          // Revoke the URL for the Blob object
          window.URL.revokeObjectURL(previewUrl)
        },
        // The image format to get the output in
        'image/png',
        1,
      )
    },
    // Get the dropzone props from the useDropzone hook.
    // Dropzone is the area where the user can drop the image or file
    // **Sources:**
    // https://react-dropzone.js.org/
    // https://react-dropzone.js.org/#use-dropzone
    // https://react-dropzone.js.org/#props
    // https://react-dropzone.js.org/#props-getinputprops
    // https://react-dropzone.js.org/#props-getrootprops
    // https://react-dropzone.js.org/#props-isdragactive
    // https://react-dropzone.js.org/#props-isdragaccept
    // https://react-dropzone.js.org/#props-isdragreject
    // https://react-dropzone.js.org/#props-getfilessize
    // https://react-dropzone.js.org/#props-getinputprops
    // https://react-dropzone.js.org/#props-getrootprops
    // https://react-dropzone.js.org/#props-inputprops
    // https://react-dropzone.js.org/#props-rootprops
    // https://react-dropzone.js.org/#props-disabled
    // https://react-dropzone.js.org/#props-accept
    // https://react-dropzone.js.org/#props-multiple
    // https://react-dropzone.js.org/#props-onclick
    // https://react-dropzone.js.org/#props-onchange
    { getInputProps, getRootProps, isDragActive } = useDropzone({ onDrop })

  // Set the preview canvas image
  useEffect(() => {
    // Set the preview canvas image to the cropped image when the completedCrop state changes
    setCanvasImage(imgRef.current, previewCanvasRef.current, completedCrop)
  }, [completedCrop])

  return (
    <div
      className='fixed bg-black/60 top-0 right-0 left-0 bottom-0 z-50 flex justify-center items-center'
      data-testid='company-modal'
      onClick={onClose}
      onKeyDown={(event) => {
        if (event.key === 'Escape') {
          onClose()
        }
      }}
      role='button'
      tabIndex={0}
    >
      {/* eslint-disable-next-line */}
      <div
        className='w-[600px] max-w-full h-[700px] border-2 border-purple-900 bg-violet-950/40 rounded-lg px-4 py-4 m-4 flex flex-col relative'
        data-testid='company-modal'
        onClick={(event) => event.stopPropagation()}
      >
        <AiOutlineClose
          className='absolute right-6 top-6 text-3xl text-green-300 hover:text-red-500 cursor-pointer'
          data-testid='close-button'
          onClick={onClose}
        />
        <h1>Upload Profile Picture</h1>
        <div className='flex flex-col items-center'>
          {upImg ? (
            <>
              <ReactCrop
                className='w-[300px] max-h-[900px]'
                crop={crop}
                onChange={(changedCrop) => setCrop(changedCrop)}
                onComplete={(completeCrop) => setCompletedCrop(completeCrop)}
                onImageLoaded={onLoad}
                src={upImg}
              />
              <div className='flex float-left'>
                {/* Here is the canvas to preview the cropped image */}
                <canvas
                  className='absolute top-[100px] right-[-250px] w-[300px] max-h-[900px] rounded-full'
                  ref={previewCanvasRef}
                />
              </div>
              <div className='flex space-between'>
                <button
                  className='bg-purple-500 text-white py-2 px-4 rounded-lg mt-4 mx-4'
                  onClick={() => {
                    generateImageFile(previewCanvasRef.current, completedCrop)
                    onClose()
                  }}
                  type='button'
                  value='Upload'
                >
                  Upload
                </button>
              </div>
              <button
                className='bg-purple-500 text-white py-2 px-4 rounded-lg mt-4 mx-4'
                onClick={() =>
                  generateDownload(previewCanvasRef.current, completedCrop)
                }
                type='button'
                value='Upload'
              >
                Download
              </button>
            </>
          ) : (
            <div className='flex mt-[120px]'>
              <div
                // eslint-disable-next-line react/jsx-props-no-spreading
                {...getRootProps({
                  className:
                    'dropzone h-[300px] w-[300px] bg-purple-500 text-white p-4 rounded-lg mt-4 mx-4 flex items-center justify-center',
                })}
              >
                <input
                  //  eslint-disable-next-line react/jsx-props-no-spreading
                  {...getInputProps({
                    onChange: onSelectFile,
                  })}
                />
                {isDragActive ? (
                  <p className='text-2xl'>Drop the files here ...</p>
                ) : (
                  <p className='text-2xl'>
                    Drag &apos;n&apos; drop some files here, or click here to
                    select files!
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

EditProfilePictureModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  userId: PropTypes.string.isRequired,
}

export default EditProfilePictureModal
