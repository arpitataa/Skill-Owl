import { useEffect, useState } from "react"
import { useDropzone } from "react-dropzone"
import { FiUploadCloud } from "react-icons/fi"
import ReactPlayer from "react-player"

export default function Upload({
  name,
  label,
  register,
  setValue,
  errors,
  video = false,
  viewData = null,   // existing URL when viewing
  editData = null,   // existing URL when editing
}) {
  const [selectedFile, setSelectedFile] = useState(null)
  const [previewSource, setPreviewSource] = useState("")
  const [blobURL, setBlobURL] = useState(null)

  useEffect(() => {
    if (viewData) {
      setPreviewSource(viewData)
    } else if (editData) {
      setPreviewSource(editData)
    } else {
      setPreviewSource("")
    }
  }, [viewData, editData])

  useEffect(() => {
    register(name, { required: true })
    return () => {
      if (blobURL) URL.revokeObjectURL(blobURL)
    }
  }, [])

  useEffect(() => {
    setValue(name, selectedFile || null, { shouldValidate: true })
  }, [name, selectedFile, setValue])

  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles?.[0]
    if (!file) return

    setSelectedFile(file)

    if (blobURL) {
      URL.revokeObjectURL(blobURL)
      setBlobURL(null)
    }

    if (video) {
      const url = URL.createObjectURL(file)
      setPreviewSource(url)
      setBlobURL(url)
    } else {
      const reader = new FileReader()
      reader.onloadend = () => setPreviewSource(reader.result)
      reader.readAsDataURL(file)
    }
  }

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    accept: video
      ? { "video/*": [".mp4", ".mov", ".webm", ".m4v"] }
      : { "image/*": [".jpeg", ".jpg", ".png", ".gif", ".webp", ".svg"] },
    multiple: false,
    onDrop,
    noClick: true,
  })

  const isBlob =
    typeof previewSource === "string" && previewSource.startsWith("blob:")

  const clearSelection = () => {
    setSelectedFile(null)
    setValue(name, null, { shouldValidate: true })
    setPreviewSource("")
    if (blobURL) {
      URL.revokeObjectURL(blobURL)
      setBlobURL(null)
    }
  }

  return (
    <div className="flex flex-col space-y-2">
      <label className="text-sm text-richblack-5" htmlFor={name}>
        {label} {!viewData && <sup className="text-pink-200">*</sup>}
      </label>

      <div
        {...getRootProps()}
        className={`${
          isDragActive ? "bg-richblack-600" : "bg-richblack-700"
        } flex min-h-[250px] w-full items-center justify-center rounded-md border-2 border-dotted border-richblack-500`}
      >
        <input {...getInputProps()} />

        {previewSource ? (
          <div className="flex w-full flex-col p-4">
            {!video ? (
              <img
                src={previewSource}
                alt="Preview"
                className="w-full max-h-80 rounded-md object-contain"
              />
            ) : isBlob ? (
              <video
                src={previewSource}
                controls
                className="w-full h-[300px] rounded-md"
              />
            ) : (
              <ReactPlayer
                url={previewSource}
                controls
                width="100%"
                height="300px"
              />
            )}

            {/* 🔑 Only show replace/remove if in Edit mode */}
            {!viewData && (
              <div className="mt-3 flex items-center gap-4">
                <button
                  type="button"
                  onClick={clearSelection}
                  className="text-sm text-richblack-400 underline"
                >
                  Remove
                </button>
                <button
                  type="button"
                  onClick={open}
                  className="text-sm text-yellow-50 underline"
                >
                  {editData ? "Replace file" : "Choose another file"}
                </button>
              </div>
            )}
          </div>
        ) : (
          // Empty state only in Add/Edit (not View)
          !viewData && (
            <button
              type="button"
              onClick={open}
              className="flex w-full flex-col items-center p-6 focus:outline-none"
            >
              <div className="grid aspect-square w-14 place-items-center rounded-full bg-pure-greys-800">
                <FiUploadCloud className="text-2xl text-yellow-50" />
              </div>
              <p className="mt-2 max-w-[260px] text-center text-sm text-richblack-200">
                Drag & drop a {video ? "video" : "image"} here, or{" "}
                <span className="font-semibold text-yellow-50">browse</span> to
                choose a file
              </p>
              <ul className="mt-6 flex list-disc justify-between space-x-8 text-center text-xs text-richblack-200">
                <li>Aspect ratio 16:9</li>
                <li>Recommended size 1024×576</li>
              </ul>
            </button>
          )
        )}
      </div>

      {errors?.[name] && (
        <span className="ml-2 text-xs tracking-wide text-pink-200">
          {label} is required
        </span>
      )}
    </div>
  )
}
