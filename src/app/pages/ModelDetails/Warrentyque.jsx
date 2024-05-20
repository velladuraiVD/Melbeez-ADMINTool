import React, { useState, useRef } from "react";
import {
    Card,
    CardBody,
    CardHeader,
    CardHeaderToolbar,
} from "../../../_metronic/_partials/controls";
import { headerSortingClasses, toAbsoluteUrl } from "../../../_metronic/_helpers";
import SVG from "react-inlinesvg";
import { Button, Modal, Form } from "react-bootstrap";
import { useDispatch } from "react-redux";
import * as XLSX from 'xlsx';
import { useHistory } from "react-router-dom";
import TablePagination from "../../Components/TablePagination";
import { showErrorToast, showSuccessToast } from "../../../Utility/toastMsg";

export default function WarrantyProductQueueTable({ status = 0, title = "Warranty Queue", screen = "", isApproved = false }) {
    const searchInputRef = useRef();
    const [isChecked, setIsChecked] = useState(false);
    const [show, setShow] = useState(false);
    const [deleteShow, setDeleteShow] = useState(false);
    const [submitShow, setSubmitShow] = useState(false);
    const [rowData, setRowData] = useState(null);
    const [search, setSearch] = useState("");
    const [filteredData, setFilteredData] = useState([]);
    const dispatch = useDispatch();
    const history = useHistory();

    const [data, setData] = useState([ 
    {
        
            id: 1,
            manufacturerName1: "ako",
            warrantyId: "12345",
            monthlyPrice: "$100",
            annualPrice: "$1000",
            melbeezDiscount: "10%",
            uploadPicture: "Upload Picture 1",
            created: "2024-05-20",
            updated: "2024-05-21",
            lastUpdated: "2024-05-21",
            status: "Pending",
            product: "Product 1",
        },
        {
            id: 2,
            manufacturerName1: "ako",
            warrantyId: "12398",
            monthlyPrice: "$150",
            annualPrice: "$1500",
            melbeezDiscount: "15%",
            uploadPicture: "Upload Picture 2",
            created: "2024-05-20",
            updated: "2024-05-21",
            lastUpdated: "2024-05-21",
            status: "Approved",
            product: "Product 2",
        },
        {
            id: 3,
            manufacturerName1: "bko",
            warrantyId: "12346",
            monthlyPrice: "$110",
            annualPrice: "$1100",
            melbeezDiscount: "11%",
            uploadPicture: "Upload Picture 3",
            created: "2024-05-21",
            updated: "2024-05-22",
            lastUpdated: "2024-05-22",
            status: "Submitted",
            product: "Product 3",
        },
        {
            id: 4,
            manufacturerName1: "cko",
            warrantyId: "12347",
            monthlyPrice: "$120",
            annualPrice: "$1200",
            melbeezDiscount: "12%",
            uploadPicture: "Upload Picture 4",
            created: "2024-05-22",
            updated: "2024-05-23",
            lastUpdated: "2024-05-23",
            status: "Rejected",
            product: "Product 4",
        },
        {
            id: 5,
            manufacturerName1: "dko",
            warrantyId: "12348",
            monthlyPrice: "$130",
            annualPrice: "$1300",
            melbeezDiscount: "13%",
            uploadPicture: "Upload Picture 5",
            created: "2024-05-23",
            updated: "2024-05-24",
            lastUpdated: "2024-05-24",
            status: "Pending",
            product: "Product 5",
        },
        {
            id: 6,
            manufacturerName1: "eko",
            warrantyId: "12349",
            monthlyPrice: "$140",
            annualPrice: "$1400",
            melbeezDiscount: "14%",
            uploadPicture: "Upload Picture 6",
            created: "2024-05-24",
            updated: "2024-05-25",
            lastUpdated: "2024-05-25",
            status: "Approved",
            product: "Product 6",
        },
        {
            id: 7,
            manufacturerName1: "fko",
            warrantyId: "12350",
            monthlyPrice: "$160",
            annualPrice: "$1600",
            melbeezDiscount: "16%",
            uploadPicture: "Upload Picture 7",
            created: "2024-05-25",
            updated: "2024-05-26",
            lastUpdated: "2024-05-26",
            status: "Submitted",
            product: "Product 7",
        },
        {
            id: 8,
            manufacturerName1: "gko",
            warrantyId: "12351",
            monthlyPrice: "$170",
            annualPrice: "$1700",
            melbeezDiscount: "17%",
            uploadPicture: "Upload Picture 8",
            created: "2024-05-26",
            updated: "2024-05-27",
            lastUpdated: "2024-05-27",
            status: "Rejected",
            product: "Product 8",
        },
        {
            id: 9,
            manufacturerName1: "hko",
            warrantyId: "12352",
            monthlyPrice: "$180",
            annualPrice: "$1800",
            melbeezDiscount: "18%",
            uploadPicture: "Upload Picture 9",
            created: "2024-05-27",
            updated: "2024-05-28",
            lastUpdated: "2024-05-28",
            status: "Pending",
            product: "Product 9",
        },
        {
            id: 10,
            manufacturerName1: "iko",
            warrantyId: "12353",
            monthlyPrice: "$190",
            annualPrice: "$1900",
            melbeezDiscount: "19%",
            uploadPicture: "Upload Picture 10",
            created: "2024-05-28",
            updated: "2024-05-29",
            lastUpdated: "2024-05-29",
            status: "Approved",
            product: "Product 10",
        },
    ]);
    
    const handleCheckboxChange = (e) => {
        setIsChecked(e.target.checked);
    };

    const handleFilter = (e) => {
        const filterValue = e.target.value;
        if (filterValue === "") {
            setFilteredData(data);
        } else {
            const filtered = data.filter(item => item.status === filterValue);
            setFilteredData(filtered);
        }
    };


    const exportToExcel = () => {
        try {
            // Prepare data for export
            const worksheet = XLSX.utils.json_to_sheet(data);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    
            // Save the workbook
            XLSX.writeFile(workbook, 'warranty_data.xlsx');
    
            // Show success toast
            showSuccessToast("Data exported to Excel successfully.");
        } catch (error) {
            // Show error toast if export fails
            showErrorToast("Error exporting data to Excel.");
            console.error('Export to Excel error:', error);
        }
    }
    const renderActions = (_, row) => {
        return (
            <>
                <a
                    href="#"
                    title="Edit"
                    className="btn btn-icon btn-light btn-hover-primary btn-sm mx-1"
                    onClick={(e) => {
                        e.preventDefault();
                        setShow(true);
                        setRowData(row);
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
                        setRowData(row);
                        setDeleteShow(true);
                    }}
                >
                    <span className="svg-icon svg-icon-md svg-icon-danger">
                        <SVG src={toAbsoluteUrl("/media/svg/icons/General/Trash.svg")} />
                    </span>
                </a>
            </>
        );
    };

    const columns = [
        {
            dataField: "manufacturerName1",
            text: "Ven",
            headerSortingClasses,
        },
        {
            dataField: "warrantyId",
            text: "Warra",
            headerSortingClasses,
        },
        {
            dataField: "product",
            text: "Name",
            headerSortingClasses,
        },
        {
            dataField: "monthlyPrice",
            text: "Monthly",
            headerSortingClasses,
        },
        {
            dataField: "annualPrice",
            text: "Annual",
            headerSortingClasses,
        },
        {
            dataField: "melbeezDiscount",
            text: "Melbeez",
            headerSortingClasses,
        },
        {
            dataField: "product",
            text: "Product",
            headerSortingClasses,
        },
        {
            dataField: "product",
            text: "Terms & C",
            headerSortingClasses,
        },
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
            text: "LastUpdated",
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
            formatter: renderActions,
            classes: "text-center pr-0",
            headerClasses: "text-center pr-3",
            style: {
                minWidth: "100px",
            },
        },
    ];

    const handleSearchChange = (e) => {
        const searchValue = e.target.value.toLowerCase();
        setSearch(searchValue);
        const filtered = data.filter(item => {
            return (
                item.manufacturerName1.toLowerCase().includes(searchValue) ||
                item.warrantyId.toLowerCase().includes(searchValue) ||
                item.product.toLowerCase().includes(searchValue) ||
                item.monthlyPrice.toLowerCase().includes(searchValue) ||
                item.annualPrice.toLowerCase().includes(searchValue) ||
                item.melbeezDiscount.toLowerCase().includes(searchValue) ||
                item.created.toLowerCase().includes(searchValue) ||
                item.updated.toLowerCase().includes(searchValue) ||
                item.lastUpdated.toLowerCase().includes(searchValue) ||
                item.status.toLowerCase().includes(searchValue)
            );
        });
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
        const updatedData = data.filter(item => item.id !== idToDelete);

        // Update the state with the new data array
        setData(updatedData);
    };
    

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
                                <button type="button" className="btn btn-primary ml-2 mr-1" title="Search">
                                    <i className="fas fa-search"></i>
                                </button>
                            </div>
                            <div>
                                <Button onClick={() => setShow(true)}>Add Warranty</Button>
                            </div>
                            <div>
                                <button  onClick={exportToExcel} type="button" className="btn btn-primary ml-2 mr-1" title="Search">
                                   Export Exel
                                </button>
                            </div>
                        </div>
                    </CardHeaderToolbar>
                </CardHeader>
                <CardBody style={{ justifyContent: "center" }}>
                <TablePagination   keyField="id" data={data} columns={columns} isShowExportCsv={false} status={status} />
                </CardBody>
            </Card>

            {/* Edit Modal */}
            <Modal show={show} onHide={() => setShow(false)} aria-labelledby="contained-modal-title-vcenter" centered size="lg">
                <Modal.Header closeButton>
                    <Modal.Title> Add Warranty Product</Modal.Title>
                </Modal.Header>
                <Form onSubmit={(e) => {
                    e.preventDefault();
                    setShow(false);
                    showSuccessToast("Item added/edited successfully.");
                    // Add form submission logic here
                }}>
                    <Modal.Body>
                        <div style={{ display: "inline-block", width: "48%", marginRight: "8px" }}>
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
                        <div style={{ display: "inline-block", width: "48%", marginRight: "8px" }}>
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
                        <div style={{ display: "inline-block", width: "48%", marginRight: "8px" }}>
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
                        <div style={{ display: "inline-block", width: "48%", marginRight: "8px" }}>
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
                        <div style={{ display: "inline-block", width: "48%", marginRight: "8px" }}>
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
                        <div style={{ display: "inline-block", width: "48%", marginRight: "8px" }}>
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
                        <div style={{ display: "inline-block", width: "48%", marginRight: "8px" }}>
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
