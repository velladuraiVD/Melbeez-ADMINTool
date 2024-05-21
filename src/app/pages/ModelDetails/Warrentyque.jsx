import React, { useState, useRef } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "../../../_metronic/_partials/controls";
import { Button, Modal, Form } from "react-bootstrap";
import * as XLSX from "xlsx";
import TablePagination from "../../Components/TablePagination";
import { showErrorToast, showSuccessToast } from "../../../Utility/toastMsg";
import { columns, warrantyData } from "./WarrentyData";
import renderActions from "./RenderAction";
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
  const [data, setData] = useState(warrantyData);
  const handleCheckboxChange = (e) => {
    setIsChecked(e.target.checked);
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
      // Filter data based on search input value
      return (
        item.manufacturerName1.toLowerCase().includes(searchValue) ||
        item.warrantyId.toLowerCase().includes(searchValue) ||
        item.product.toLowerCase().includes(searchValue) ||
        // Include other fields as needed for searching
        // Add additional fields as needed
        item.status.toLowerCase().includes(searchValue)
      );
    });
    // Update the state with the filtered data
    setFilteredData(filtered);
  };
  const handleDelete = () => {
    // Close the delete modal
    setDeleteShow(false);

    // Show success toast
    showSuccessToast("Item deleted successfully.");

    // Get the ID of the item to be deleted
    const idToDelete = rowData.id;

    // Filter out the item with the matching ID from the data array
    const updatedData = data.filter((item) => item.id !== idToDelete);

    // Update the state with the new data array
    setData(updatedData);
  };

  const columnsWithActions = columns.map((column) => {
    if (column.dataField === "actions") {
      return {
        ...column,
        formatter: renderActions(setShow, setRowData, setDeleteShow),
      };
    }
    return column;
  });
  return (
    <>
      <Card>
        <CardHeader title="Warrennty">
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
                  title="Search"
                >
                  Export Exel
                </button>
              </div>
            </div>
          </CardHeaderToolbar>
        </CardHeader>
        <CardBody style={{ justifyContent: "center" }}>
          <TablePagination
            keyField="id"
            data={filteredData.length > 0 ? filteredData : data}
            columns={columnsWithActions}
            isShowExportCsv={false}
            status={status}
          />
        </CardBody>
      </Card>

      {/* Edit Modal */}
      <Modal
        show={show}
        onHide={() => setShow(false)}
        aria-labelledby="contained-modal-title-vcenter"
        centered
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title> Add Warranty Product</Modal.Title>
        </Modal.Header>
        <Form
          onSubmit={(e) => {
            e.preventDefault();
            setShow(false);
            showSuccessToast("Item added/edited successfully.");
            // Add form submission logic here
          }}
        >
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
                name="manufacturerName"
                className="mb-3"
                required
              />
            </div>
            <div
              style={{
                display: "inline-block",
                width: "48%",
                marginRight: "8px",
              }}
            >
              <Form.Label>Warranty ID</Form.Label>
              <Form.Control
                type="text"
                autoComplete="off"
                placeholder="Warranty ID"
                name="modelNumber"
                className="mb-3"
                required
              />
            </div>
            <div
              style={{
                display: "inline-block",
                width: "48%",
                marginRight: "8px",
              }}
            >
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                autoComplete="off"
                placeholder="Name"
                name="productName"
                className="mb-3"
                required
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
              />
            </div>
            <div
              style={{
                display: "inline-block",
                width: "48%",
                marginRight: "8px",
              }}
            >
              <Form.Label>Melbeez Discount</Form.Label>
              <Form.Control
                type="text"
                autoComplete="off"
                placeholder="Melbeez Discount"
                name="melbeezDiscount"
                className="mb-3"
                required
              />
            </div>
            <div
              style={{
                display: "inline-block",
                width: "48%",
                marginRight: "8px",
              }}
            >
              <Form.Label>Upload Picture</Form.Label>
              <div className="border border-gray-100 border-2 p-2 w-60">
                <input type="file" />
              </div>
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
      <Modal show={deleteShow} onHide={() => setDeleteShow(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this item?</Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
          <Button variant="secondary" onClick={() => setDeleteShow(false)}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
