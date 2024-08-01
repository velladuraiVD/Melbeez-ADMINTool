import React, { useState, useRef, useEffect } from "react";
import { Button, Container } from "react-bootstrap";
import { showErrorToast, showSuccessToast } from "../../../Utility/toastMsg";
import { useAuth } from "./AuthContext";
import "../ModelDetails/Warranty.css";
import StatusDot from "./StatusDot";
import WarrantyTable from "./WarrantyTable";
import AddEditModal from "./AddEditModel";
import DeleteConfirmationModal from "./DeleteModel";

import { headerSortingClasses } from "../../../_metronic/_helpers";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "../../../_metronic/_partials/controls";
import * as XLSX from "xlsx";
import AddUpload from "./Uploadmodel";
import ViewUpload from "./Viewwarranty";

import AddEditModalApproval from "./ApprovalEdit";
import WarrantypendingapprovalTable from "./WarrantypendingapprovalTable";

const WarrantypendingqueTable = ({
  status = 0,
  title = "Warranty Queue",
  screen = "",
  isApproved = false,
}) => {
  const [warrantyData, setWarrantyData] = useState([]);
  const [columns] = useState([
    { dataField: "warrantyId", text: "Warranty ID", headerSortingClasses },
    { dataField: "vendor", text: "Vendor", headerSortingClasses },
    { dataField: "name", text: "Name", headerSortingClasses },
    {
      dataField: "monthlyPrice",
      text: "Monthly Price",
      headerSortingClasses,
      formatter: (cell) => `$${parseFloat(cell).toFixed(2)}`,
    },
    {
      dataField: "annualPrice",
      text: "Annual Price",
      headerSortingClasses,
      formatter: (cell) => `$${parseFloat(cell).toFixed(2)}`,
    },
    {
      dataField: "discount",
      text: "Discount",
      headerSortingClasses,
      formatter: (cell) => `${parseFloat(cell)}%` || "N/A",
    },
    {
      dataField: "status",
      text: "Status",
      headerSortingClasses,
      formatter: (cell) => <StatusDot status={cell} />,
    },
    // { dataField: "terms_conditions", text: "T & C" },
    {
      dataField: "created_by",
      text: "Created By",
      headerSortingClasses,
      formatter: (cell) => cell || "N/A",
    },
    {
      dataField: "updated_by",
      text: "Updated By",
      formatter: (cell) => cell || "N/A",
      headerSortingClasses,
    },
    // {
    //   dataField: "updated_by",
    //   text: "Warrantyimage",
    //   formatter: (cell) => cell || "N/A",
    //   headerSortingClasses,
    // },
    {
      dataField: "updatedAt",
      text: "Last Updated",
      headerSortingClasses,
      formatter: (cell) => {
        const date = new Date(cell);
        const formattedDate = date.toLocaleDateString();
        return `${formattedDate}`;
      },
    },
    { dataField: "actions", text: "Actions" },
  ]);

  const searchInputRefs = useRef(columns.map(() => React.createRef()));
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [rowData, setRowData] = useState(null);
  const [data, setData] = useState([]);
  const [showAddEditModal, setShowAddEditModal] = useState(false);
  const [showAddModel, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false); // Modal visibility state
  const [formData, setFormData] = useState({
    id: "",
    warrantyId: "",
    vendor: "",
    name: "",
    monthlyPrice: "",
    annualPrice: "",
    discount: "",
    status: "",
    planDescription: "", // Clear planDescription field
    planName: "",
    pictureLink: "", // Clear planName field
    // terms_conditions: "",
    // created_by: "",
    updated_by: "",
    file: null, // Clear the image file field
  });
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerms, setSearchTerms] = useState({});
  const [commonSearchTerm, setCommonSearchTerm] = useState("");
  const {
    userDetails,
    loading,
    handleUploadwarrenty,
    handleUpdateWarranty,
  } = useAuth();

  useEffect(() => {
    fetchData();
  }, []);

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
      const response = await fetch(
        `${process.env.REACT_APP_JAVA_API_URL}/warranty/pending`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setWarrantyData(data);
      setFilteredData(data);
      setData(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleDeleteConfirmation = (row) => {
    setRowData(row);
    setShowDeleteModal(true);
  };

  const handleRowClick = (row) => {
    setRowData(row);
    setFormData({
      warrantyId: row.warrantyId,
      status: row.status,
      id: row.id,
      vendor: row.vendor,
      name: row.name,
      monthlyPrice: row.monthlyPrice,
      annualPrice: row.annualPrice,
      discount: row.discount,
      planDescription: row.planDescription,
      planName: row.planName,
      pictureLink: row.pictureLink,
      // terms_conditions: row.terms_conditions,
      created_by: row.created_by,
      updated_by: row.updated_by,
    });
    setShowViewModal(true);
  };

  const handleCloseModal = () => {
    setShowViewModal(false);
    setRowData(null);
  };
  const handleEdit = (row) => {
    setFormData({
      warrantyId: row.warrantyId,
      status: row.status,
      id: row.id,
      vendor: row.vendor,
      name: row.name,
      monthlyPrice: row.monthlyPrice,
      annualPrice: row.annualPrice,
      discount: row.discount,
      planDescription: row.planDescription,
      planName: row.planName,
      pictureLink: row.pictureLink,
      updated_by:
        userDetails.result.firstName + "" + userDetails.result.lastName,
    });
    setShowAddEditModal(true);
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_JAVA_API_URL}/warranty/${rowData.id}`,
        { method: "DELETE" }
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
      setShowDeleteModal(false);
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
        await handleUpdateWarranty(formData);
        showSuccessToast("Item updated successfully.");
      } else {
        await handleUploadwarrenty(formData);
        showSuccessToast("Item added successfully.");
      }
      setFormData({});
      fetchData();
      setShowAddModal(false);
      setShowAddEditModal(false);
    } catch (error) {
      console.error("Error handling warranty:", error);
      showErrorToast("Error handling warranty.");
    }
  };

  const handleFilter = (e) => {
    const filterValue = e.target.value;
    if (filterValue === "") {
      setFilteredData(warrantyData);
    } else {
      const filtered = warrantyData.filter(
        (item) => item.status === filterValue
      );
      setFilteredData(filtered);
    }
  };

  const exportToExcel = () => {
    try {
      // Ensure data is not empty
      if (!data || data.length === 0) {
        showErrorToast("No data to export.");
        return;
      }

      // Filter out the 'id' field from each object in data
      const filteredData = data.map(({ id, picture,...rest }) => rest);

      const worksheet = XLSX.utils.json_to_sheet(filteredData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
      XLSX.writeFile(workbook, "warranty_data.xlsx");
      showSuccessToast("Data exported to Excel successfully.");
    } catch (error) {
      showErrorToast("Error exporting data to Excel.");
      console.error("Export to Excel error:", error);
    }
  };

  const handleSearchChange = (e, column) => {
    const searchValue = e.target.value.toLowerCase();
    setSearchTerms((prevSearchTerms) => ({
      ...prevSearchTerms,
      [column.dataField]: searchValue,
    }));

    const filtered = warrantyData.filter((item) =>
      Object.entries(searchTerms).every(([key, value]) =>
        String(item[key])
          .toLowerCase()
          .includes(value)
      )
    );

    setFilteredData(filtered);
  };

  const handleCommonSearchChange = (e) => {
    const searchValue = e.target.value.toLowerCase();
    setCommonSearchTerm(searchValue);

    const filtered = warrantyData.filter((item) =>
      columns.some((column) =>
        String(item[column.dataField])
          .toLowerCase()
          .includes(searchValue)
      )
    );

    setFilteredData(filtered);
  };

  return (
    <Container>
      <Card>
        <CardHeader title={title}>
          <CardHeaderToolbar>
            {/* <div>
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
            </div> */}
            <div className="d-flex">
              <div>
                <input
                  type="search"
                  className="form-control"
                  placeholder="Search..."
                  onChange={handleCommonSearchChange}
                  value={commonSearchTerm}
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
            </div>
            <div className="d-flex">
              {/* <div>
                <Button onClick={() => setShowAddModal(true)}>
                  Add Warranty
                </Button>
              </div> */}
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
          <WarrantypendingapprovalTable
            columns={columns}
            data={filteredData}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            handleEdit={handleEdit}
            handleDelete={handleDeleteConfirmation}
            paginate={setCurrentPage}
            searchInputRefs={searchInputRefs}
            handleSearchChange={handleSearchChange}
            handleRowClick={handleRowClick} // Pass handleRowClick to the table
          />
          {/* <AddUpload
            setFormData={setFormData}
            show={showAddModel}
            onHide={() => setShowAddModal(false)}
            formData={formData}
            handleSubmit={handleSubmit}
            handleInputChange={handleInputChange}
          /> */}
          <AddEditModalApproval
            setFormData={setFormData}
            show={showAddEditModal}
            onHide={() => setShowAddEditModal(false)}
            formData={formData}
            handleInputChange={handleInputChange}
            handleSubmit={handleSubmit}
          />
          <DeleteConfirmationModal
            show={showDeleteModal}
            onHide={() => setShowDeleteModal(false)}
            onDelete={handleDelete}
            rowData={rowData}
          />

          <ViewUpload
            show={showViewModal}
            onHide={handleCloseModal}
            formData={formData}
          />
        </CardBody>
      </Card>
    </Container>
  );
};

export default WarrantypendingqueTable;
