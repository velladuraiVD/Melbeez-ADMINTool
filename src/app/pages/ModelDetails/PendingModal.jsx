import React from "react";
import { Modal, Button } from "react-bootstrap";

const PendingSubmissionModal = ({ show, onHide, onSubmit }) => {
  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Pending Submission</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Are you sure you want to submit this warranty for approval?</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancel
        </Button>
        <Button variant="primary" onClick={onSubmit}>
          Submit
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default PendingSubmissionModal