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

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;

    if (form.checkValidity() === false) {
      e.stopPropagation();
    } else {
      try {
        await handleSubmit(e); // Call handleSubmit function passed from parent

        onHide(); // Close modal
        setFormData(""); // Clear form data
        // showSuccessToast("Warranty product added successfully.");
      } catch (error) {
        console.error("Error handling warranty:", error);
        showErrorToast("Error handling warranty.");
      }
    }

    setValidated(true);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const fileTypes = ["image/jpeg", "image/png", "image/gif"];
    
    if (file) {
      if (file.size > 4 * 1024 * 1024) {
        setFileError("File size should not exceed 4 MB.");
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
    }
  };

  const handlePlanDescriptionChange = (e) => {
    const value = e.target.value;
    const lines = value.split('\n');
    const isValid = lines.every(line => line.includes(','));
    e.target.setCustomValidity(isValid ? "" : "Each line must be separated by a comma.");
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
              value={formData.vendor}
              onChange={handleInputChange}
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
              value={formData.name}
              onChange={handleInputChange}
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
              value={formData.monthlyPrice}
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
              value={formData.annualPrice}
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
           
              value={formData.discount}
              onChange={handleInputChange}
            />
            {/* <Form.Control.Feedback type="invalid">
              Please provide a discount.
            </Form.Control.Feedback> */}
          </div>
          <Form.Group>
            <Form.Label>* Plan Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="planDescription"
              placeholder="input must be separate by comma {Ex:Protect any phone, Accidental damage,}"
              className="mb-3"
              required
              value={formData.planDescription}
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
              value={formData.planName}
              onChange={handleInputChange}
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
              <input type="file" id="file" onChange={handleFileChange} />
              {fileError && (
                <div className="text-danger mt-2">{fileError}</div>
              )}
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
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
