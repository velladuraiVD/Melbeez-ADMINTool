import React, { useState, useRef, useEffect } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "../../../_metronic/_partials/controls";
import { Button, Modal, Form, Table } from "react-bootstrap";
import * as XLSX from "xlsx";
// import TablePagination from "../../Components/TablePagination";
import { showErrorToast, showSuccessToast } from "../../../Utility/toastMsg";

import renderActions from "./RenderAction"; // Adjust the import path as per your project structure
import { useAuth } from "./AuthContext";
import axios from "axios";
import { headerSortingClasses } from "../../../_metronic/_helpers";
import { TablePagination } from "@material-ui/core";
// const [show, setShow] = useState(false);
// const [deleteShow, setDeleteShow] = useState(false);
// const [rowData, setRowData] = useState(null);
const columns = [
  {
    dataField: "userId",
    text: "User ID",
    headerSortingClasses,
  },
  {
    dataField: "warrantyId",
    text: "Warranty ID",
    headerSortingClasses,
  },
  {
    dataField: "product",
    text: "Product Name",
    headerSortingClasses,
  },
  {
    dataField: "monthlyPrice",
    text: "Monthly Price",
    headerSortingClasses,
  },
  {
    dataField: "annualPrice",
    text: "Annual Price",
    headerSortingClasses,
  },
  {
    dataField: "melbeezDiscount",
    text: "Melbeez Discount",
    headerSortingClasses,
  },
  // Add other columns as per your requirement
  {
    dataField: "created",
    text: "Created",
    headerSortingClasses,
  },
  {
    dataField: "updated",
    text: "Updated",
    headerSortingClasses,
  },
  {
    dataField: "lastUpdated",
    text: "Last Updated",
    headerSortingClasses,
  },
  {
    dataField: "status",
    text: "Status",
    headerSortingClasses,
  },
  {
    dataField: "actions",
    text: "Actions",
    formatter: (cell, row) => renderActions,
    classes: "text-center pr-0",
    headerClasses: "text-center pr-3",
    style: {
      minWidth: "100px",
    },
  },
];

export default function WarrantyProductQueueTable({
  status = 0,
  title = "Warranty Queue",
  screen = "",
  isApproved = false,
}) {
  const searchInputRef = useRef();
  const [isChecked, setIsChecked] = useState(false);
  const [show, setShow] = useState(false);
  const [deleteShow, setDeleteShow] = useState(false);
  const [rowData, setRowData] = useState(null);
  const [search, setSearch] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [data, setData] = useState([]); // Initial state with empty array
  const [formData, setFormData] = useState({
    id: null,
    vendor: "",
    productName: "",
    monthlyPrice: "",
    annualPrice: "",
    discount: "",
    terms_conditions: "",
    created_by: "",
    updated_by: "",
  });
  const [message, setMessage] = useState("");

  const { handleUploadwarrenty, handleUpdateWarranty, getWarranty } = useAuth();

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(15); // Number of items per page

  // Fetch warranty data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://jsonplaceholder.typicode.com/todos');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log(data);
        setData(data);
        setFilteredData(data); // Initially set filtered data to all data
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleCheckboxChange = (e) => {
    setIsChecked(e.target.checked);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData({ ...formData, [name]: files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.id) {
        // Update existing warranty
        await handleUpdateWarranty(formData, setMessage, setFormData, setShow);
        showSuccessToast("Item updated successfully.");
      } else {
        // Add new warranty
        await handleUploadwarrenty(formData, setMessage, setFormData, setShow);
        showSuccessToast("Item added successfully.");
      }
      // Refresh the data after adding/updating
      const response = await axios.get("https://api.example.com/warranty");
      setData(response.data);
      setFilteredData(response.data);
    } catch (error) {
      console.error("Error handling warranty:", error);
      showErrorToast("Error handling warranty.");
    }
  };

  const handleFilter = (e) => {
    const filterValue = e.target.value;
    if (filterValue === "") {
      setFilteredData(data);
    } else {
      const filtered = data.filter((item) => item.status === filterValue);
      setFilteredData(filtered);
    }
  };

  const exportToExcel = () => {
    try {
      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
      XLSX.writeFile(workbook, "warranty_data.xlsx");
      showSuccessToast("Data exported to Excel successfully.");
    } catch (error) {
      showErrorToast("Error exporting data to Excel.");
      console.error("Export to Excel error:", error);
    }
  };

  const handleSearchChange = (e) => {
    const searchValue = e.target.value.toLowerCase();
    setSearch(searchValue);
    const filtered = data.filter((item) => {
      return (
        item.vendor.toLowerCase().includes(searchValue) ||
        item.productName.toLowerCase().includes(searchValue) ||
        item.status.toLowerCase().includes(searchValue)
      );
    });
    setFilteredData(filtered);
  };

  const handleDelete = () => {
    setDeleteShow(false);
    showSuccessToast("Item deleted successfully.");
    const idToDelete = rowData.id;
    const updatedData = data.filter((item) => item.id !== idToDelete);
    setData(updatedData);
  };

  const handleEdit = (row) => {
    setFormData({
      id: row.id,
      vendor: row.vendor,
      productName: row.productName,
      monthlyPrice: row.monthlyPrice,
      annualPrice: row.annualPrice,
      discount: row.discount,
      terms_conditions: row.terms_conditions,
      created_by: row.created_by,
      updated_by: row.updated_by,
    });
    setShow(true); // Open the modal for editing
  };

  const handleDeleteConfirmation = (row) => {
    setRowData(row);
    setDeleteShow(true); // Open the delete confirmation modal
  };

  const columnsWithActions = columns.map((column) => {
    if (column.dataField === "actions") {
      return {
        ...column,
        formatter: (cell, row) => renderActions(setShow, setRowData, setDeleteShow)(cell, row),
      };
    } else {
      return column;
    }
  });

  return (
    <>
      <Card>
        <CardHeader title={title}>
          <CardHeaderToolbar>
            <div>
              <select
                name="statusSelect"
                id="statusSelect"
                onChange={handleFilter}
                style={{
                  height: "38px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  fontSize: "1.1em",
                  padding: "3px 0px",
                  marginRight: "10px",
                  marginTop: "2px",
                  backgroundColor: "#fff",
                }}
              >
                <option value="" defaultValue>
                  Filter by status
                </option>
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Submitted">Submitted</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
            <div className="d-flex">
              <div>
                <input
                  type="search"
                  className="form-control"
                  placeholder="Search..."
                  onChange={handleSearchChange}
                  ref={searchInputRef}
                  value={search}
                />
              </div>
              <div>
                <button
                  type="button"
                  className="btn btn-primary ml-2 mr-1"
                  title="Search"
                >
                  <i className="fas fa-search"></i>
                </button>
              </div>
              <div>
                <Button onClick={() => setShow(true)}>Add Warranty</Button>
              </div>
              <div>
                <button
                  onClick={exportToExcel}
                  type="button"
                  className="btn btn-primary ml-2 mr-1"
                  title="Export Excel"
                >
                  Export Excel
                </button>
              </div>
            </div>
          </CardHeaderToolbar>
        </CardHeader>
        <CardBody style={{ justifyContent: "center" }}>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                {columnsWithActions.map((column, index) => (
                  <th key={index}>{column.text}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {currentItems.map((item, index) => (
                <tr key={index}>
                  {columnsWithActions.map((column, columnIndex) => (
                    <td key={columnIndex}>
                      {column.formatter ? column.formatter(item[column.dataField], item) : item[column.dataField]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </Table>
          <TablePagination
            itemsPerPage={itemsPerPage}
            totalItems={filteredData.length}
            paginate={paginate}
          />
        </CardBody>
      </Card>

      {/* Add/Edit Modal */}
      <Modal
        show={show}
        onHide={() => setShow(false)}
        aria-labelledby="contained-modal-title-vcenter"
        centered
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {formData.id ? "Edit Warranty Product" : "Add Warranty Product"}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <div
              style={{
                display: "inline-block",
                width: "48%",
                marginRight: "8px",
              }}
            >
              <Form.Label>Vendor Name</Form.Label>
              <Form.Control
                type="text"
                autoComplete="off"
                placeholder="Vendor Name"
                name="vendor"
                className="mb-3"
                required
                value={formData.vendor}
                onChange={handleInputChange}
              />
            </div>
            <div
              style={{
                display: "inline-block",
                width: "48%",
                marginRight: "8px",
              }}
            >
              <Form.Label>Product Name</Form.Label>
              <Form.Control
                type="text"
                autoComplete="off"
                placeholder="Product Name"
                name="productName"
                className="mb-3"
                required
                value={formData.productName}
                onChange={handleInputChange}
              />
            </div>
            <div
              style={{
                display: "inline-block",
                width: "48%",
                marginRight: "8px",
              }}
            >
              <Form.Label>Monthly Price</Form.Label>
              <Form.Control
                type="text"
                autoComplete="off"
                placeholder="Monthly Price"
                name="monthlyPrice"
                className="mb-3"
                required
                value={formData.monthlyPrice}
                onChange={handleInputChange}
              />
            </div>
            <div
              style={{
                display: "inline-block",
                width: "48%",
                marginRight: "8px",
              }}
            >
              <Form.Label>Annual Price</Form.Label>
              <Form.Control
                type="text"
                autoComplete="off"
                placeholder="Annual Price"
                name="annualPrice"
                className="mb-3"
                required
                value={formData.annualPrice}
                onChange={handleInputChange}
              />
            </div>
            <div
              style={{
                display: "inline-block",
                width: "48%",
                marginRight: "8px",
              }}
            >
              <Form.Label>Discount</Form.Label>
              <Form.Control
                type="text"
                autoComplete="off"
                placeholder="Discount"
                name="discount"
                className="mb-3"
                required
                value={formData.discount}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Form.Label>Terms and Conditions</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="terms_conditions"
                className="mb-3"
                value={formData.terms_conditions}
                onChange={handleInputChange}
              />
            </div>
            <div
              style={{
                display: "inline-block",
                width: "48%",
                marginRight: "8px",
              }}
            >
              <Form.Label>Created By</Form.Label>
              <Form.Control
                type="text"
                autoComplete="off"
                placeholder="Created By"
                name="created_by"
                className="mb-3"
                value={formData.created_by}
                onChange={handleInputChange}
              />
            </div>
            <div
              style={{
                display: "inline-block",
                width: "48%",
                marginRight: "8px",
              }}
            >
              <Form.Label>Updated By</Form.Label>
              <Form.Control
                type="text"
                autoComplete="off"
                placeholder="Updated By"
                name="updated_by"
                className="mb-3"
                value={formData.updated_by}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Form.Check
                type="checkbox"
                className="my-3"
                name="acceptTermsAndConditions"
                label="Accept terms and conditions"
                onChange={handleCheckboxChange}
                checked={isChecked}
              />
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button type="submit" variant="primary">
              Save
            </Button>
            <Button onClick={() => setShow(false)} variant="secondary">
              Close
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Delete Modal */}
      <Modal
        show={deleteShow}
        onHide={() => setDeleteShow(false)}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirmation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to delete this item?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleDelete} variant="danger">
            Delete
          </Button>
          <Button onClick={() => setDeleteShow(false)} variant="secondary">
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}