import { useDropzone } from "react-dropzone";
import { Card } from "react-bootstrap";
import { FaCloudUploadAlt } from "react-icons/fa";

const ImageUploader = ({ preview, setPreview, setImage }) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "image/*": [],
    },
    multiple: false,
    onDrop: (acceptedFiles) => {
      if (!acceptedFiles.length) return;

      const file = acceptedFiles[0];
      setImage(file);
      setPreview(URL.createObjectURL(file));
    },
  });

  return (
    <>
      <Card
        {...getRootProps()}
        className={`text-center p-4 border-2 ${
          isDragActive ? "border-primary" : ""
        }`}
        style={{
          borderStyle: "dashed",
          cursor: "pointer",
        }}
      >
        <input {...getInputProps()} />

        <FaCloudUploadAlt size={50} className="text-primary" />

        <h5 className="mt-3">
          {isDragActive ? "Drop Image Here" : "Drag & Drop Image"}
        </h5>

        <p className="text-muted">or Click to Browse</p>
      </Card>

      {preview && (
        <div className="text-center mt-4">
          <img
            src={preview}
            alt="Preview"
            className="img-fluid rounded shadow"
            style={{
              maxHeight: 220,
              objectFit: "cover",
            }}
          />
        </div>
      )}
    </>
  );
};

export default ImageUploader;
