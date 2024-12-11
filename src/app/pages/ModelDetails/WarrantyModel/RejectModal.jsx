import React from "react";
import { Modal, Button } from "react-bootstrap";

const RejectionModal = ({ show, onHide, onSubmit ,    }) => {
  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header>
        <Modal.Title>Rejection Confirmation</Modal.Title>
      </Modal.Header>
      <Modal.Body>
      Are you sure you want to reject this warranty for the product?
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancel
        </Button>
        <Button variant="danger" onClick={onSubmit}>
          Reject
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default RejectionModal;
