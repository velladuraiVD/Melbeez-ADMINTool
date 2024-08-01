import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const SearchModal = ({ show, handleClose, handleSearch, column }) => {
  const [searchValue, setSearchValue] = useState('');
  const [searching, setSearching] = useState(false); // State to manage search button disabling

  useEffect(() => {
    if (!show) {
      setSearchValue('');
    }
  }, [show]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSearching(true); // Disable search button during search
    try {
      await handleSearch(searchValue, column);
    } finally {
      setSearching(false); // Re-enable search button after search is done, whether successful or not
      handleClose(); // Close modal after search
    }
  };

  const handleInputChange = (e) => {
    setSearchValue(e.target.value);
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Search {column.text}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formBasicEmail">
            <Form.Control
              type="text"
              placeholder={`Search ${column.text}`}
              value={searchValue}
              onChange={handleInputChange}
            />
          </Form.Group>
          <div className="d-flex justify-content-end">
            <Button variant="secondary" onClick={handleClose} style={{ marginRight: '10px' }}>
              Close
            </Button>
            <Button variant="primary" type="submit" disabled={searching}>
              {searching ? 'Searching...' : 'Search'}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default SearchModal;
