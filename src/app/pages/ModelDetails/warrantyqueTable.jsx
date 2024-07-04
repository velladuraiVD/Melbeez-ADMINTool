import React, { useState, useRef, useEffect } from "react";
import SVG from "react-inlinesvg";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "../../../_metronic/_partials/controls";
import { Button, Modal, Form, Table } from "react-bootstrap";
import * as XLSX from "xlsx";
import { TablePagination } from "@material-ui/core";
import { showErrorToast, showSuccessToast } from "../../../Utility/toastMsg";
import { useAuth } from "./AuthContext";
import axios from "axios";
import {
  headerSortingClasses,
  toAbsoluteUrl,
} from "../../../_metronic/_helpers";

const renderActions = (row, handleEdit, handleDelete) => (
  <>
    <a
      href="#"
      title="Edit"
      className="btn btn-icon btn-light btn-hover-primary btn-sm mx-1"
      onClick={(e) => {
        e.preventDefault();
        handleEdit(row.warrantyId);
      }}
    >
      <span className="svg-icon svg-icon-md svg-icon-primary">
        <SVG src={toAbsoluteUrl("/media/svg/icons/Communication/Write.svg")} />
      </span>
    </a>
    <a
      href="#"
      title="Delete"
      className="btn btn-icon btn-light btn-hover-danger btn-sm mr-2"
      onClick={(e) => {
        e.preventDefault();
        handleDelete(row.id);
      }}
    >
      <span className="svg-icon svg-icon-md svg-icon-danger">
        <SVG src={toAbsoluteUrl("/media/svg/icons/General/Trash.svg")} />
      </span>
    </a>
  </>
);

const columns = [
  {
    dataField: "vendor",
    text: "Vendor",
    headerSortingClasses,
  },
  {
    dataField: "warrantyId",
    text: "Warranty ID",
    headerSortingClasses,
  },
  {
    dataField: "productName",
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
    dataField: "discount",
    text: "Melbeez Discount",
    headerSortingClasses,
  },
  {
    dataField: "terms_conditions",
    text: "Terms",
    headerSortingClasses,
  },
  {
    dataField: "created_by",
    text: "Created By",
    headerSortingClasses,
  },
  {
    dataField: "updated_by",
    text: "Updated By",
    headerSortingClasses,
  },
  {
    dataField: "updatedAt",
    text: "Last Updated",
    headerSortingClasses,
    formatter: (cell, row) => {
      // Assuming updatedAt is a string in the format "YYYY-MM-DDTHH:mm:ss.sssZ"
      const datePart = cell.slice(0, 10); // Extract date part only
      return datePart;
    },
  },
  {
    dataField: "status",
    text: "Status",
    headerSortingClasses,
  },
  {
    dataField: "actions",
    text: "Actions",
    formatter: (cell, row) => renderActions(row),
    classes: "text-center pr-0",
    headerClasses: "text-center pr-3",
    style: {
      minWidth: "100px",
    },
  },
];

const WarrantyProductQueueTable = ({
  status = 0,
  title = "Warranty Queue",
  screen = "",
  isApproved = false,
}) => {
  const searchInputRef = useRef();
  const { handleUploadwarrenty, handleUpdateWarranty, getWarranty } = useAuth();
  const [show, setShow] = useState(false);
  const [deleteShow, setDeleteShow] = useState(false);
  const [rowData, setRowData] = useState(null);
  const [search, setSearch] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [data, setData] = useState([]);
  const [formData, setFormData] = useState({
    status: "pending",
    warrantyId: "",
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
  const [isChecked, setIsChecked] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);

  useEffect(() => {
    fetchData();
  }, []);

  const { userDetails, loading, handleUpload } = useAuth();

  useEffect(() => {
    if (!loading && userDetails && !formData.author) {
      const fullName = `${userDetails.result.firstName} ${userDetails.result.lastName}`;
      setFormData((prevFormData) => ({
        ...prevFormData,
        created_by: fullName,
        updated_by: fullName,
      }));
    }
  }, [userDetails, loading, formData.author]);

  const fetchData = async () => {
    try {
      const response = await fetch("http://localhost:8080/warranty/all");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setData(data);
      setFilteredData(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleEdit = (row) => {
    setFormData({
      warrantyId: row.warrantyId,
      status: row.status,
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
    setShow(true);
  };

  const handleDeleteConfirmation = (row) => {
    setRowData(row);
    setDeleteShow(true);
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/warranty/${rowData.id}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        throw new Error("Failed to delete item.");
      }
      showSuccessToast("Item deleted successfully.");
      const updatedData = data.filter((item) => item.id !== rowData.id);
      setData(updatedData);
      setFilteredData(updatedData);
    } catch (error) {
      console.error("Error deleting item:", error);
      showErrorToast("Error deleting item.");
    } finally {
      setDeleteShow(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.id) {
        await handleUpdateWarranty(formData, setMessage, setFormData, setShow);
        showSuccessToast("Item updated successfully.");
        setShow(false);
        setFormData({}); // Reset formData
      } else {
        await handleUploadwarrenty(formData, setMessage, setFormData, setShow);
        showSuccessToast("Item added successfully.");
      }
      fetchData(); // Refresh data after add/update
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
    const filtered = data.filter(
      (item) =>
        item.vendor.toLowerCase().includes(searchValue) ||
        item.productName.toLowerCase().includes(searchValue) ||
        item.status.toLowerCase().includes(searchValue)
    );
    setFilteredData(filtered);
  };

  const renderActions = (row) => (
    <>
      <a
        href="#"
        title="Edit"
        className="btn btn-icon btn-light btn-hover-primary btn-sm mx-1"
        onClick={(e) => {
          e.preventDefault();
          handleEdit(row);
        }}
      >
        <span className="svg-icon svg-icon-md svg-icon-primary">
          <SVG
            src={toAbsoluteUrl("/media/svg/icons/Communication/Write.svg")}
          />
        </span>
      </a>
      <a
        href="#"
        title="Delete"
        className="btn btn-icon btn-light btn-hover-danger btn-sm mr-2"
        onClick={(e) => {
          e.preventDefault();
          handleDeleteConfirmation(row);
        }}
      >
        <span className="svg-icon svg-icon-md svg-icon-danger">
          <SVG src={toAbsoluteUrl("/media/svg/icons/General/Trash.svg")} />
        </span>
      </a>
    </>
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const columnsWithActions = columns.map((column) =>
    column.dataField === "actions"
      ? { ...column, formatter: (cell, row) => renderActions(row) }
      : column
  );

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

                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
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
                      {column.formatter
                        ? column.formatter(item[column.dataField], item)
                        : item[column.dataField]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </Table>
          <TablePagination
            itemsPerPage={itemsPerPage}
            totalItems={data.length}
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
              <Form.Group controlId="warrantyId">
                <Form.Label>Warranty ID</Form.Label>
                <Form.Control
                  type="text"
                  name="warrantyId"
                  value={formData.warrantyId}
                  onChange={handleInputChange}
                  //   required
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
            <div
              style={{
                display: "inline-block",
                width: "48%",
                marginRight: "8px",
              }}
            >
              <Form.Group controlId="status">
                <Form.Label>Status</Form.Label>
                <Form.Control
                  as="select"
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  required
                >
                  {/* <option value="Pending">Pending</option> */}
                  <option value="select">select</option>
                  <option value="Pending">Pending</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </Form.Control>
              </Form.Group>
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

            {formData.id ? (
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
            ) : (
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
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button type="submit" variant="primary">
              Save
            </Button>
            <Button
              onClick={() => {
                setShow(false);
                setFormData({});
              }}
              variant="secondary"
            >
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
};
export default WarrantyProductQueueTable;
