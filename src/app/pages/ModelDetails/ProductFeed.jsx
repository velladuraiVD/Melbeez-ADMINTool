import React, { useState, useEffect } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "../../../_metronic/_partials/controls";
import { Button, Modal, Form } from "react-bootstrap";
import FeedCard from "./FeedCard";
import { AuthProvider, useAuth } from "./AuthContext";

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
    setShow(false);
    setFormData({
      author: formData.author,
      description: "",
      file: null,
    });
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      file: e.target.files[0],
    });
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
    try {
      await handleUpload(formData, setMessage, setFormData);
      // If upload is successful, close the modal
      handleClose();
    } catch (error) {
      // If upload fails, do nothing (show stays true)
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
        <CardBody style={{ justifyContent: "center" }}>
          <AuthProvider>
            <FeedCard />
          </AuthProvider>
        </CardBody>
      </Card>

      {/* -----  Edit Modal ---- */}
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
