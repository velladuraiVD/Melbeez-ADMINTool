import React, { useState, useRef } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "../../../_metronic/_partials/controls";
import SVG from "react-inlinesvg";
import Cookie from "js-cookie";
import { Button, Modal, Form, Row, Col } from "react-bootstrap";
import "react-toastify/dist/ReactToastify.css";
import TablePagination from "../../Components/TablePagination";

const dummyData = [
  {
    id: 1,
    userId: "U123",
    userName: "John Doe",
    paymentDate: "2023-07-24",
    amount: "$100",
    status: "Pending",
    email: "john.doe@example.com",
    phone: "123-456-7890",
    address: "123 Main St, Springfield, USA",
  },
  {
    id: 2,
    userId: "U124",
    userName: "Jane Smith",
    paymentDate: "2023-07-23",
    amount: "$150",
    status: "Approved",
    email: "jane.smith@example.com",
    phone: "987-654-3210",
    address: "456 Elm St, Springfield, USA",
  },
  // Add more dummy data as needed
];

export default function PaymentTable() {
  Cookie.remove("filterValue");
  const [show, setShow] = useState(false);
  const [rowData, setRowData] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef();

  const handleClose = () => setShow(false);
  const handleShow = (row) => {
    setRowData(row);
    setShow(true);
  };

  const handleSearch = () => {
    setSearchQuery(searchInputRef.current.value);
  };

  const filteredData = dummyData.filter((row) =>
    Object.values(row).some((value) =>
      value.toString().toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const renderActions = (_, row) => {
    return (
      <>
        <a
          href="#"
          title="View"
          className="btn btn-icon btn-light btn-hover-warning btn-sm mr-2"
          onClick={(e) => {
            e.stopPropagation();
            handleShow(row);
          }}
        >
          <span className="svg-icon svg-icon-md svg-icon-warning">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="#5BC0DE"
              className="bi bi-eye-fill"
              viewBox="0 0 16 16"
            >
              <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z" />
              <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8zm8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z" />
            </svg>
          </span>
        </a>
      </>
    );
  };

  const columns = [
    { dataField: "userId", text: "User ID" },
    { dataField: "userName", text: "User Name" },
    { dataField: "email", text: "Email" },
    { dataField: "phone", text: "Phone" },
    { dataField: "address", text: "Address" },
    { dataField: "status", text: "Status" },
    { dataField: "paymentDate", text: "Payment Date" },
    { dataField: "amount", text: "Amount" },
    { dataField: "action", text: "Actions", formatter: renderActions },
  ];

  return (
    <>
      <Card>
        <CardHeader title="User Payment Log">
          <CardHeaderToolbar>
            <div className="d-flex">
              <input
                type="search"
                className="form-control"
                placeholder="Search..."
                ref={searchInputRef}
              />
              <Button variant="primary" className="ml-2" onClick={handleSearch}>
                <i className="fas fa-search"></i>
              </Button>
            </div>
          </CardHeaderToolbar>
        </CardHeader>
        <CardBody>
          <TablePagination
            keyField="id"
            columns={columns}
            data={filteredData} // Use filtered data here
            isShowExportCsv={false}
          />
        </CardBody>
      </Card>
      <Modal show={show} onHide={handleClose} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Payment Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row className="mb-3">
              <Col>
                <Form.Label>User ID</Form.Label>
                <Form.Control type="text" value={rowData.userId} disabled />
              </Col>
              <Col>
                <Form.Label>User Name</Form.Label>
                <Form.Control type="text" value={rowData.userName} disabled />
              </Col>
            </Row>
            <Row className="mb-3">
              <Col>
                <Form.Label>Email</Form.Label>
                <Form.Control type="text" value={rowData.email} disabled />
              </Col>
              <Col>
                <Form.Label>Phone</Form.Label>
                <Form.Control type="text" value={rowData.phone} disabled />
              </Col>
            </Row>
            <Form.Label>Address</Form.Label>
            <Form.Control type="text" value={rowData.address} disabled />
            <Row className="mb-3">
              <Col>
                <Form.Label>Payment Date</Form.Label>
                <Form.Control
                  type="text"
                  value={rowData.paymentDate}
                  disabled
                />
              </Col>
              <Col>
                <Form.Label>Amount</Form.Label>
                <Form.Control type="text" value={rowData.amount} disabled />
              </Col>
            </Row>
            <Form.Label>Status</Form.Label>
            <Form.Control type="text" value={rowData.status} disabled />
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
