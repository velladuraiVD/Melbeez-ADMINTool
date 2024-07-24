import React from "react";
import { Modal, Button, Form } from "react-bootstrap";

const ViewUpload = ({ show, onHide, formData, handleBlur, setFormData }) => {
  return (
    <Modal
      show={show}
      onHide={onHide}
      aria-labelledby="contained-modal-title-vcenter"
      centered
      size="lg"
      backdrop="static"
      keyboard={false}
    >
      <Modal.Header closeButton>
        <Modal.Title>View Warranty Product</Modal.Title>
      </Modal.Header>
      <Form>
        <Modal.Body>
          <div
            style={{
              display: "inline-block",
              width: "48%",
              marginRight: "8px",
            }}
          >
            <Form.Group>
              <Form.Label>Vendor Name</Form.Label>
              <Form.Control type="text" readOnly value={formData.vendor} />
            </Form.Group>
          </div>
          <div
            style={{
              display: "inline-block",
              width: "48%",
              marginRight: "8px",
            }}
          >
            <Form.Group>
              <Form.Label>Name</Form.Label>
              <Form.Control type="text" value={formData.name} readOnly />
            </Form.Group>
          </div>
          <div
            style={{
              display: "inline-block",
              width: "48%",
              marginRight: "8px",
            }}
          >
            <Form.Group>
              <Form.Label>Monthly Price</Form.Label>
              <Form.Control
                type="text"
                readOnly
                value={formData.monthlyPrice}
              />
            </Form.Group>
          </div>
          <div
            style={{
              display: "inline-block",
              width: "48%",
              marginRight: "8px",
            }}
          >
            <Form.Group>
              <Form.Label>Annual Price</Form.Label>
              <Form.Control type="text" readOnly value={formData.annualPrice} />
            </Form.Group>
          </div>
          <div
            style={{
              display: "inline-block",
              width: "48%",
              marginRight: "8px",
            }}
          >
            <Form.Group>
              <Form.Label>Discount</Form.Label>
              <Form.Control type="text" readOnly value={formData.discount} />
            </Form.Group>
          </div>
          <div
            style={{
              display: "inline-block",
              width: "48%",
              marginRight: "8px",
            }}
          >
            <Form.Group>
              <Form.Label>Status</Form.Label>
              <Form.Control type="text" readOnly value={formData.status} />
            </Form.Group>
          </div>
          <Form.Group>
            <Form.Label>Plan Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              readOnly
              value={formData.planDescription}
            />
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
            />
          </div>
          <div
            style={{
              display: "inline-block",
              width: "48%",
              marginRight: "8px",
            }}
          >
            <Form.Group>
              <Form.Label>Warranty Image</Form.Label>
              <div>
                <img
                  src={formData.pictureLink}
                  alt="Uploaded"
                  style={{ maxWidth: "100%", maxHeight: "400px" }}
                />
              </div>
            </Form.Group>
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
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default ViewUpload;
