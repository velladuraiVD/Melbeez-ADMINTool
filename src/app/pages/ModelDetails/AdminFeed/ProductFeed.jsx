import React, { useState, useEffect } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "../../../../_metronic/_partials/controls";
import { Button, Modal, Form } from "react-bootstrap";
import FeedCard from "./FeedCard";
import { useAuth } from "../AuthContext";

export default function ProductFeed({
  status = 0,
  title = "Product feed",
  screen = "",
  isApproved = false,
}) {
 
  const [message, setMessage] = useState("");
  const [show, setShow] = useState(false);
  const [formData, setFormData] = useState({
    author: "",
    description: "",
    file: null,
  });
  const [descriptionError, setDescriptionError] = useState("");
  const [fileError, setFileError] = useState("");
  const [loading, setLoading] = useState(false);
  const { userDetails,handleUpload } = useAuth();
 
  useEffect(() => {
    if ( userDetails && !formData.author) {
      const fullName = `${userDetails.result.firstName} ${userDetails.result.lastName}`;
      setFormData((prevFormData) => ({
        ...prevFormData,
        author: fullName,
      }));
    }
  }, [userDetails, formData.author]);

  const handleClose = () => {
    setFormData({
      author: formData.author,
      description: "",
      file: null,
    });
    setFileError("");
    setDescriptionError("");
    setShow(false);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const fileTypes = ["image/jpeg", "image/png", "image/gif", "video/mp4"];

    if (file) {
      if (file.size > 50 * 1024 * 1024) {
        // Allow only up to 50 MB
        setFileError("File size should not exceed 50 MB.");
        setFormData({
          ...formData,
          file: null,
        });
      } else if (!fileTypes.includes(file.type)) {
        setFileError("Only image and video files are allowed.");
        setFormData({
          ...formData,
          file: null,
        });
      } else {
        setFileError("");
        setFormData({
          ...formData,
          file,
        });
      }
    } else {
      setFileError("File is required.");
      setFormData({
        ...formData,
        file: null,
      });
    }
  };

  const handleChange = (e) => {
    const value = e.target.value;
    if (value.length > 200) {
      setDescriptionError("Description cannot exceed 200 characters.");
      
    } else {
      // console.log("is work");
      setDescriptionError("");
      setFormData({
        ...formData,
        description: value,
      });
    }
  };

  const showModal = () => {
    setShow(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.file) {
      setFileError("File is required.");
      return;
    }

    if (!descriptionError && !fileError) {
      setLoading(true); 
      try {
        await handleUpload(formData, setMessage, setFormData);
        handleClose();
        
      } catch (error) {
        // console.error("Error during upload:", error);
      }
      setLoading(false);
    }
  };

  return (
    <>
      <Card style={{ marginTop: "0px" }}>
        {screen === "ALL_DATA" ? (
          <CardHeader title={title}>
            <CardHeaderToolbar>
              <div className="d-flex mt-3 flex-wrap">
                <div>
                  <Button onClick={showModal}>Create Post</Button>
                </div>
              </div>
            </CardHeaderToolbar>
          </CardHeader>
        ) : (
          <CardHeader title={title}>
            <CardHeaderToolbar>
              <div className="d-flex"></div>
            </CardHeaderToolbar>
          </CardHeader>
        )}
        <CardBody style={{ justifyContent: "center"}}>
          <FeedCard/>
        </CardBody>
      </Card>
      {/* -----  Upload  Modal ---- */}
      <Modal
        show={show}
        onHide={handleClose}
        aria-labelledby="contained-modal-title-vcenter"
        centered
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Feed Upload</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <div
              style={{
                display: "inline-block",
                width: "48%",
                marginRight: "8px",
              }}
            >
              <Form.Label htmlFor="author">Author</Form.Label>
              <Form.Control
                type="text"
                id="author" 
                name="author"
                value={formData.author}
                onChange={(e) => {
                  handleChange(e); 
                }}
                required
              />
            </div>
            <div
              style={{
                display: "inline-block",
                width: "48%",
                marginRight: "8px",
              }}
            >
              <Form.Label htmlFor="description">Description</Form.Label>
              <Form.Control
                type="text"
                id="description"
                name="description"
                value={formData.description}
                onChange={(e) => {
                  handleChange(e); // Only update the state if input is valid
                }}
                placeholder="Enter a description (max 200 characters)"
                isInvalid={!!descriptionError} // Show invalid styling when there's an error
              />
              <Form.Control.Feedback type="invalid">
                {descriptionError}
              </Form.Control.Feedback>
            </div>

            <div
              style={{
                display: "inline-block",
                width: "48%",
                marginRight: "8px",
              }}
            >
              <Form.Label htmlFor="file">Image or Video</Form.Label>
              <div className="border border-gray-100 border-2 p-2 w-60">
                <input type="file" name="file" id="file" onChange={handleFileChange} />
                {fileError && (
                  <div className="text-danger mt-2">{fileError}</div>
                )}
              </div>
              <Form.Label htmlFor="file">Selected File</Form.Label>
              <div
                className="border border-gray-100 border-2 p-2 w-60"
                style={{
                  height: "100%",
                  overflow: "auto",
                  textAlign: "center",
                }}
              >
                {formData.file ? (
                  formData.file.type.startsWith("image/") ? (
                    <img
                      src={URL.createObjectURL(formData.file)}
                      alt="Selected"
                      style={{
                        width: "100%",
                        maxHeight: "100%",
                        marginTop: "3px",
                      }}
                    />
                  ) : formData.file.type.startsWith("video/") ? (
                    <video
                      controls
                      style={{ width: "100%", maxHeight: "100%" }}
                    >
                      <source
                        src={URL.createObjectURL(formData.file)}
                        type={formData.file.type}
                      />
                      Your browser does not support the video tag.
                    </video>
                  ) : null
                ) : (
                  <p>No file selected</p>
                )}
              </div>
            </div>

            <br />
            <hr />
            <div style={{ display: "flex", justifyContent: "end" }}>
              <Button variant="secondary" onClick={handleClose}>
                Close
              </Button>
              <Button
                style={{
                  backgroundColor: "#FACD21",
                  border: "none",
                  color: "black",
                  marginLeft: 2,
                }}
                type="submit"
                disabled={loading}
              >
               {loading ? "Uploading..." : "Upload"} 
              </Button>
            </div>
          </Modal.Body>
        </Form>
      </Modal>
    </>
  );
}
