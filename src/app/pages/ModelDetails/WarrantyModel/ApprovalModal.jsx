import React from "react";
import { Modal, Button } from "react-bootstrap";

const ApprovalModal = ({ show, onHide, onSubmit }) => {
  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header>
        <Modal.Title>Approval Confirmation</Modal.Title>
      </Modal.Header>
      <Modal.Body>
      Are you sure you want to Approve this warranty for the product?
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancel
        </Button>
        <Button variant="primary" onClick={onSubmit}>
          Approve
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ApprovalModal;
