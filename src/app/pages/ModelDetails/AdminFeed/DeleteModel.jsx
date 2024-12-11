
import React, { useState } from 'react';
import { Modal, Button, Spinner } from 'react-bootstrap';

const DeleteModel = ({ show, onHide, onDelete }) => {
    const [loading, setLoading] = useState(false);
  
    const handleDelete = async () => {
      setLoading(true);
      try {
        await onDelete();
        onHide();
      } catch (error) {
        // console.error("Error deleting item:", error);
      } finally {
        setLoading(false);
      }
    };
  
    return (
      <Modal show={show} onHide={onHide} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to delete this item? This action cannot be undone.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide} disabled={loading}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete} disabled={loading}>
            {loading ? <Spinner animation="border" size="sm" /> : "Delete"}
          </Button>
        </Modal.Footer>
      </Modal>
    );
  };
  export default DeleteModel;