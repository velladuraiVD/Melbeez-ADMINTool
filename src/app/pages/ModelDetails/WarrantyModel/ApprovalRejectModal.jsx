import React from "react";
import { Modal, Button } from "react-bootstrap";

const ApproveRejectModal = ({ show, onHide, isApprove, onSubmit }) => {
  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header>
        <Modal.Title>Confirmation</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Are you sure you want to  {isApprove ? "Approve" : "Reject"}warranty?
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancel
        </Button>
        <Button
          variant={isApprove ? "primary btn btn-primary" : "primary btn btn-danger"}
          onClick={onSubmit}
        >
          {isApprove ? "Approve" : "Reject"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ApproveRejectModal;
