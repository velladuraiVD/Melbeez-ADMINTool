import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { showErrorToast, showSuccessToast } from "../../../Utility/toastMsg";

const AddEditModalApproval = ({
  show,
  onHide,
  formData,
  handleInputChange,
  handleSubmit,
  setFormData,
}) => {

  const [validated, setValidated] = useState(false);
  const [fileError, setFileError] = useState("");
  const handleSubmitForm = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;

    if (form.checkValidity() === false) {
      e.stopPropagation();
    } else {
      try {
        await handleSubmit(e); // Call handleSubmit function passed from parent

        onHide(); // Close modal
      } catch (error) {
        // console.error("Error handling warranty:", error);
        showErrorToast("Error handling warranty.");
      }
    }

    setValidated(true);
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
        <Modal.Title>Edit Warranty Product</Modal.Title>
      </Modal.Header>
      <Form noValidate validated={validated} onSubmit={handleSubmitForm}>
        <Modal.Body>
          {/* <div style={{ display: 'inline-block', width: '48%', marginRight: '8px' }}>
            <Form.Group controlId="warrantyId">
              <Form.Label>* Warranty ID</Form.Label>
              <Form.Control
                type="text"
                name="warrantyId"
                value={formData.warrantyId}
                onChange={handleInputChange}
                required
              />
              <Form.Control.Feedback type="invalid">
                Please provide a warranty ID.
              </Form.Control.Feedback>
            </Form.Group>
          </div> */}
          <div
            style={{
              display: "inline-block",
              width: "48%",
              marginRight: "8px",
            }}
          >
            <Form.Label>* Vendor Name</Form.Label>
            <Form.Control readOnly
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
            <Form.Label>* Product Name</Form.Label>
            <Form.Control
            readOnly
              type="text"
              autoComplete="off"
              placeholder="name"
              name="productName"
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
            readOnly
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
              Please provide a monthly price.
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
            readOnly
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
              Please provide an annual price.
            </Form.Control.Feedback>
          </div>
          <div
            style={{
              display: "inline-block",
              width: "48%",
              marginRight: "8px",
            }}
          >
            <Form.Label>* Discount</Form.Label>
            <Form.Control
            readOnly
              type="text"
              autoComplete="off"
              placeholder="Discount"
              name="discount"
              className="mb-3"
              pattern="^\d*(\.\d{0,2})?$"
              required
              value={formData.discount}
              onChange={handleInputChange}
            />
            <Form.Control.Feedback type="invalid">
              Please provide a discount.
            </Form.Control.Feedback>
          </div>
          <div
            style={{
              display: "inline-block",
              width: "48%",
              marginRight: "8px",
            }}
          >
             <Form.Group controlId="status">
              <Form.Label> * Status</Form.Label>
              <Form.Control
                as="select"
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                required
              >
                <option value="">pending</option>
                {/* <option value="Pending">Pending</option> */}
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </Form.Control>
              <Form.Control.Feedback type="invalid">
                Please select a status.
              </Form.Control.Feedback>
            </Form.Group>
          </div>
          <Form.Group>
            <Form.Label>* Plan Description</Form.Label>
            <Form.Control
            readOnly
              as="textarea"
              rows={3}
              name="planDescription"
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
            <Form.Label>Plan Name</Form.Label>
            <Form.Control
            readOnly
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
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => {
              onHide();
              setFormData({});
            }}
          >
            Close
          </Button>
          <Button variant="primary" type="submit">
            Save Changes
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default AddEditModalApproval;
