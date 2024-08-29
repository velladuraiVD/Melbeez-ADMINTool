import React, { useState, useEffect } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "../../../_metronic/_partials/controls";
import { Button, Modal, Form } from "react-bootstrap";
import FeedCard from "./FeedCard";
import { useAuth } from "./AuthContext";

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
  const [fileError, setFileError] = useState("");
  const { userDetails, loading, handleUpload } = useAuth();

  useEffect(() => {
    if (!loading && userDetails && !formData.author) {
      const fullName = `${userDetails.result.firstName} ${userDetails.result.lastName}`;
      setFormData((prevFormData) => ({
        ...prevFormData,
        author: fullName,
      }));
    }
  }, [userDetails, loading, formData.author]);

  const handleClose = () => {
    setFormData({
      author: formData.author,
      description: "",
      file: null,
    });
    setFileError("");
    setShow(false);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const fileTypes = ["image/jpeg", "image/png", "image/gif"];

    if (file) {
      if (file.size > 1 * 1024 * 1024) { // Allow only up to 1 MB
        setFileError("File size should not exceed 1 MB.");
        setFormData({
          ...formData,
          file: null,
        });
      } else if (!fileTypes.includes(file.type)) {
        setFileError("Only image files are allowed.");
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
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
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

    try {
      await handleUpload(formData, setMessage, setFormData);
      handleClose();
    } catch (error) {}
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
        <CardBody style={{ justifyContent: "center" }}>
          <FeedCard />
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
              <Form.Label>Author</Form.Label>
              <Form.Control
                type="text"
                name="author"
                value={formData.author}
                onChange={handleChange}
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
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                name="description"
                value={formData.description}
                onChange={handleChange}
              
              />
              
            </div>
            <div
              style={{
                display: "inline-block",
                width: "48%",
                marginRight: "8px",
              }}
            >
              <Form.Label>Image</Form.Label>
              <div className="border border-gray-100 border-2 p-2 w-60">
                <input type="file" id="file" onChange={handleFileChange} />
                {fileError && <div className="text-danger mt-2">{fileError}</div>}
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
              >
                Upload
              </Button>
            </div>
          </Modal.Body>
        </Form>
      </Modal>
    </>
  );
}
