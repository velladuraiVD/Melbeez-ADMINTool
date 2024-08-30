import React, { useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { showErrorToast, showSuccessToast } from "../../../Utility/toastMsg";

const AddUpload = ({
  show,
  onHide,
  handleSubmit,
  setFormData,
  formData,
  handleInputChange,
}) => {
  const [validated, setValidated] = useState(false);
  const [fileError, setFileError] = useState("");

  useEffect(() => {
    // Reset validation state and file error when modal shows
    if (show) {
      setValidated(false);
      setFileError("");
    }
  }, [show]);

  // Initialize formData with default values to avoid undefined inputs
  const initialFormData = {
    vendor: "",
    name: "",
    monthlyPrice: "",
    annualPrice: "",
    discount: "",
    planDescription: "",
    planName: "",
    file: null,
    other_Details: "",
    product_price_ids: "",
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;

    if (form.checkValidity() === false || !formData.file) {
      e.stopPropagation();
      if (!formData.file) setFileError("image is required.");
    } else {
      try {
        await handleSubmit(e);
        onHide();
        setFormData(initialFormData); // Clear form data with default values
        // showSuccessToast("Upload successful.");
      } catch (error) {
        console.error("Error handling upload:", error);
        showErrorToast("Error handling upload.");
      }
    }

    setValidated(true);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const fileTypes = ["image/jpeg", "image/png", "image/gif", "image/svg+xml"];

    if (file) {
      if (file.size > 1 * 1024 * 1024) {
        // Allow only up to 1 MB
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

  const handlePlanDescriptionChange = (e) => {
    const value = e.target.value;
    const lines = value.split("\n");
    const isValid = lines.every((line) => line.includes(","));
    e.target.setCustomValidity(
      isValid ? "" : "Each line must be separated by a comma."
    );
    handleInputChange(e);
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      aria-labelledby="contained-modal-title-vcenter"
      centered
      size="lg"
    >
      <Modal.Header closeButton>
        <Modal.Title>Add Warranty Product</Modal.Title>
      </Modal.Header>
      <Form noValidate validated={validated} onSubmit={handleSubmitForm}>
        <Modal.Body>
          <div
            style={{
              display: "inline-block",
              width: "48%",
              marginRight: "8px",
            }}
          >
            <Form.Label>* Vendor Name</Form.Label>
            <Form.Control
              type="text"
              autoComplete="off"
              placeholder="Vendor Name"
              name="vendor"
              className="mb-3"
              required
              value={formData.vendor || ""}
              onChange={handleInputChange}
              pattern="[a-zA-Z\s]*"
            />
            <Form.Control.Feedback type="invalid">
              Please provide a vendor name.
            </Form.Control.Feedback>
          </div>
          <div
            style={{
              display: "inline-block",
              width: "48%",
              marginRight: "8px",
            }}
          >
            <Form.Label>* Name</Form.Label>
            <Form.Control
              type="text"
              autoComplete="off"
              placeholder="Name"
              name="name"
              className="mb-3"
              required
              value={formData.name || ""}
              onChange={handleInputChange}
              pattern="[a-zA-Z\s]*"
            />
            <Form.Control.Feedback type="invalid">
              Please provide a product name.
            </Form.Control.Feedback>
          </div>
          <div
            style={{
              display: "inline-block",
              width: "48%",
              marginRight: "8px",
            }}
          >
            <Form.Label>* Monthly Price</Form.Label>
            <Form.Control
              type="text"
              autoComplete="off"
              placeholder="Monthly Price"
              name="monthlyPrice"
              className="mb-3"
              required
              pattern="^\d*(\.\d{0,2})?$"
              value={formData.monthlyPrice || ""}
              onChange={handleInputChange}
            />
            <Form.Control.Feedback type="invalid">
              Please provide a valid monthly price.
            </Form.Control.Feedback>
          </div>
          <div
            style={{
              display: "inline-block",
              width: "48%",
              marginRight: "8px",
            }}
          >
            <Form.Label>* Annual Price</Form.Label>
            <Form.Control
              type="text"
              autoComplete="off"
              placeholder="Annual Price"
              name="annualPrice"
              className="mb-3"
              required
              pattern="^\d*(\.\d{0,2})?$"
              value={formData.annualPrice || ""}
              onChange={handleInputChange}
            />
            <Form.Control.Feedback type="invalid">
              Please provide a valid annual price.
            </Form.Control.Feedback>
          </div>
          <div
            style={{
              display: "inline-block",
              width: "48%",
              marginRight: "8px",
            }}
          >
            <Form.Label>Discount</Form.Label>
            <Form.Control
              type="text"
              autoComplete="off"
              placeholder="Discount"
              name="discount"
              className="mb-3"
              pattern="^\d*(\.\d{0,2})?$"
              value={formData.discount || ""}
              onChange={handleInputChange}
            />
          </div>

          <div
            style={{
              display: "inline-block",
              width: "48%",
              marginRight: "8px",
            }}
          >
            <Form.Label>* Price Id</Form.Label>
            <Form.Control
              type="text"
              autoComplete="off"
              placeholder="Price Id"
              name="product_price_ids"
              className="mb-3"
              // pattern="^\d*(\.\d{0,2})?$"
              value={formData.product_price_ids || ""}
              onChange={handleInputChange}
              required
            />
          </div>

          <div
            style={{
              display: "inline-block",
              width: "100%",
              marginRight: "8px",
            }}
          >
            <Form.Label>* Plan description</Form.Label>
            <Form.Control
              type="text"
              autoComplete="off"
              placeholder="Plan description"
              name="planDescription"
              className="mb-3"
              // pattern="^\d*(\.\d{0,2})?$"
              value={formData.planDescription || ""}
              onChange={handleInputChange}
              // pattern="[a-zA-Z\s]*"
              required
            />
            <Form.Control.Feedback type="invalid">
              Please provide a valid Plan description.
            </Form.Control.Feedback>
          </div>
          <Form.Group>
            <Form.Label>* Ohers</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="other_Details"
              placeholder="input must be separated by a comma {Ex: Protect any phone, Accidental damage,}"
              className="mb-3"
              required
              value={formData.other_Details || ""}
              onChange={handlePlanDescriptionChange}
            />
            <Form.Control.Feedback type="invalid">
              Each line must be separated by a comma.
            </Form.Control.Feedback>
          </Form.Group>
          <div
            style={{
              display: "inline-block",
              width: "48%",
              marginRight: "8px",
            }}
          >
            <Form.Label>* Plan Name</Form.Label>
            <Form.Control
              type="text"
              autoComplete="off"
              placeholder="Plan Name"
              name="planName"
              className="mb-3"
              required
              value={formData.planName || ""}
              onChange={handleInputChange}
              pattern="[a-zA-Z\s]*"
            />
            <Form.Control.Feedback type="invalid">
              Please provide additional details.
            </Form.Control.Feedback>
          </div>
          <div
            style={{
              display: "inline-block",
              width: "48%",
              marginRight: "8px",
            }}
          >
            <div className="border border-gray-100 border-2 p-2 w-60">
              <input
                type="file"
                id="file"
                onChange={handleFileChange}
                required
              />
              {fileError && <div className="text-danger mt-2">{fileError}</div>}
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => {
              onHide();
              setFormData(initialFormData); // Reset form data with default values
            }}
          >
            Close
          </Button>
          <Button variant="primary" type="submit">
            Save
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default AddUpload;
