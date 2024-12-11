import React, { useState } from 'react';
import { Modal, Button, Spinner } from 'react-bootstrap';

const DeleteConfirmationModal = ({ show, onHide, onDelete, product }) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      await onDelete();
      onHide(); // Close modal after successful deletion
    } catch (error) {
      // console.error('Error deleting item:', error);
      // Handle error scenario (e.g., show error message)
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} aria-labelledby="contained-modal-title-vcenter" centered>
      <Modal.Header closeButton>
        <Modal.Title>Delete Warranty Product</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Are you sure you want to delete the following warranty product?</p>
        {product && (
          <div>
            <p><strong>Product Name:</strong> {product.productName}</p>
            <p><strong>Vendor:</strong> {product.vendor}</p>
            {/* Add more details as needed */}
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide} disabled={loading}>
          Close
        </Button>
        <Button variant="danger" onClick={handleDelete} disabled={loading}>
          {loading ? (
            <Spinner animation="border" size="sm" role="status" aria-hidden="true" />
          ) : (
            'Delete'
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DeleteConfirmationModal;
