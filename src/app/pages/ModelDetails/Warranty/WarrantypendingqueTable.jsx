import React, { useState, useRef, useEffect } from "react";
import { Button, Container, Spinner } from "react-bootstrap";
import { showErrorToast, showSuccessToast } from "../../../../Utility/toastMsg";
import { useAuth } from "../AuthContext";
import "./Warranty.css";
import StatusDot from "../StatusDot";
import WarrantyTable from "./WarrantyTable";
import AddEditModal from "../WarrantyModel/AddEditModel";
import DeleteConfirmationModal from "../DeleteModel";

import { headerSortingClasses } from "../../../../_metronic/_helpers";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "../../../../_metronic/_partials/controls";
import * as XLSX from "xlsx";
import AddUpload from "../WarrantyModel/UploadWarrantymodel";
import ViewUpload from "../WarrantyModel/Viewwarrantymodel";

import AddEditModalApproval from "../WarrantyModel/ApprovalEdit";
import WarrantypendingapprovalTable from "./WarrantypendingapprovalTable";
import ApproveRejectModal from "../WarrantyModel/ApprovalRejectModal";
import ApprovalModal from "../WarrantyModel/ApprovalModal";
import RejectionModal from "../WarrantyModel/RejectModal";

const WarrantypendingqueTable = ({
  status = 0,
  title = "Warranty Queue",
  screen = "",
  isApproved = false,
}) => {
  const [warrantyData, setWarrantyData] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);

  // const [selectedIds, setSelectedIds] = useState([]);

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(warrantyData.map((item) => item.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectRow = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((itemId) => itemId !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const [columns] = useState([
    // {
    //   dataField: "select",
    //   text: (
    //     <input
    //       type="checkbox"
    //       checked={
    //         warrantyData.length > 0 &&
    //         selectedIds.length === warrantyData.length
    //       }
    //       onChange={handleSelectAll}
    //     />
    //   ),
    //   formatter: (cell, row) => (
    //     <input
    //       type="checkbox"
    //       checked={selectedIds.includes(row.id)}
    //       onChange={() => handleSelectRow(row.id)}
    //     />
    //   ),
    // },
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
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const [needsRefresh, setNeedsRefresh] = useState(false);
const [loading,setLoading]=useState(false)
  useEffect(() => {
    if (needsRefresh) {
      fetchData();
      setNeedsRefresh(false);
    }
  }, [needsRefresh]);

  const handleSubmit = async (e, actionType) => {
    e.preventDefault();
    try {
      // If selectedIds has items, perform bulk submission
      if (selectedIds.length > 0) {
        await handleBulkSubmit(actionType);
      } else {
        // Otherwise, perform individual submission logic
        const updatedData = {
          ...formData,
          status: actionType === "approve" ? "active" : "inactive",
        };
        await handleUpdateWarranty(updatedData);
        const message =
          actionType === "approve"
            ? "Warranty approved and status updated to active successfully."
            : "Warranty rejected and status updated to inactive successfully.";
        showSuccessToast(message);
        setFormData({});
        setShowApprovalModal(false);
        setShowRejectionModal(false);
        setNeedsRefresh(true);
      }
    } catch (error) {
      // console.error(
      //   `Error ${
      //     actionType === "approve" ? "approving" : "rejecting"
      //   } warranty:`,
      //   error
      // );
      showErrorToast(
        `Error ${
          actionType === "approve" ? "approving" : "rejecting"
        } warranty: ` + error.message
      );
    }
  };

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
    other_Details: "",
    product_price_ids: "",
  });
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerms, setSearchTerms] = useState({});
  const [commonSearchTerm, setCommonSearchTerm] = useState("");
  const {
    userDetails,
  
    // handleUploadwarrenty,
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

    setLoading(true)
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
      // console.error("Error fetching data:", error);
    }
    finally{

    
      setLoading(false); // Set loading to false when data fetch is complete

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
      other_Details: row.other_Details,
      product_price_ids: row.product_price_ids,
    });
    setShowViewModal(true);
  };

  const handleCloseModal = () => {
    setShowViewModal(false);
    setRowData(null);
  };
  // const handleEdit = (row) => {
  //   setFormData({
  //     warrantyId: row.warrantyId,
  //     status: row.status,
  //     id: row.id,
  //     vendor: row.vendor,
  //     name: row.name,
  //     monthlyPrice: row.monthlyPrice,
  //     annualPrice: row.annualPrice,
  //     discount: row.discount,
  //     planDescription: row.planDescription,
  //     planName: row.planName,
  //     pictureLink: row.pictureLink,
  //     updated_by:
  //       userDetails.result.firstName + "" + userDetails.result.lastName,
  //   });
  //   setShowAddEditModal(true);
  // };

  const handleApproval = (row) => {
    setFormData({
      // warrantyId: row.warrantyId,
      status: row.status,
      id: row.id,
      // vendor: row.vendor,
      // name: row.name,
      // monthlyPrice: row.monthlyPrice,
      // annualPrice: row.annualPrice,
      // discount: row.discount,
      // planDescription: row.planDescription,
      // planName: row.planName,
      // pictureLink: row.pictureLink,
      // updated_by:
      //   userDetails.result.firstName + "" + userDetails.result.lastName,
      // other_Details: row.other_Details,
      // product_price_ids: row.product_price_ids,
    });
    setShowApprovalModal(true);
  };

  const handleReject = (row) => {
    setFormData({
      // warrantyId: row.warrantyId,
      status: row.status,
      id: row.id,
      // vendor: row.vendor,
      // name: row.name,
      // monthlyPrice: row.monthlyPrice,
      // annualPrice: row.annualPrice,
      // discount: row.discount,
      // planDescription: row.planDescription,
      // planName: row.planName,
      // pictureLink: row.pictureLink,
      // updated_by:
      //   userDetails.result.firstName + "" + userDetails.result.lastName,
      // other_Details: row.other_Details,
      // product_price_ids: row.product_price_ids,
    });
    setShowRejectionModal(true);
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
      // console.error("Error deleting item:", error);
      showErrorToast("Error deleting item.");
    } finally {
      setShowDeleteModal(false);
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
      const filteredData = data.map(({ id, picture, ...rest }) => rest);

      const worksheet = XLSX.utils.json_to_sheet(filteredData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
      XLSX.writeFile(workbook, "warranty_data.xlsx");
      showSuccessToast("Data exported to Excel successfully.");
    } catch (error) {
      showErrorToast("Error exporting data to Excel.");
      // console.error("Export to Excel error:", error);
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

  const handleBulkSubmit = async (actionType) => {
    try {
      const updatedData = warrantyData.map((item) => {
        if (selectedIds.includes(item.id)) {
          return {
            ...item,
            status: actionType === "approve" ? "active" : "inactive",
          };
        }
        return item;
      });

      await Promise.all(updatedData.map((data) => handleUpdateWarranty(data)));

      const message =
        actionType === "approve"
          ? "Selected warranties approved successfully."
          : "Selected warranties rejected successfully.";
      showSuccessToast(message);
      setNeedsRefresh(true);
      setSelectedIds([]);
      setShowApprovalModal(false);
      setShowRejectionModal(false);
    } catch (error) {
      // console.error(`Error during bulk ${actionType} action:`, error);
      showErrorToast(
        `Error during bulk ${actionType} action: ` + error.message
      );
    }
  };
  const handleSelectionChange = (newSelectedIds) => {
    setSelectedIds(newSelectedIds);
  };

  return (
    <Container>
      <Card>
        <CardHeader title={title}>
          <CardHeaderToolbar>
            <div className="d-flex">
              {selectedIds.length > 0 && (
                <>
                  <Button
                    className="btn btn-primary ml-2 mr-1"
                    onClick={() => setShowApprovalModal(true)}
                  >
                    Approve All
                  </Button>
                  <Button
                    variant="danger"
                    className="ml-2"
                    onClick={() => setShowRejectionModal(true)}
                  >
                    Reject All
                  </Button>
                </>
              )}
              <div>
                <input
                  type="search"
                  className="form-control ml-2"
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
         
        {loading ? ( // Display a loading spinner while data is being fetched
            <div className="text-center">
              <Spinner animation="border" role="status">
                <span className="sr-only">Loading...</span>
              </Spinner>
            </div>
          ) : (
          <WarrantypendingapprovalTable
            onSelectionChange={handleSelectionChange}
            columns={columns}
            data={filteredData}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            handleApproval={handleApproval}
            handleDelete={handleDeleteConfirmation}
            handleReject={handleReject}
            paginate={setCurrentPage}
            searchInputRefs={searchInputRefs}
            handleSearchChange={handleSearchChange}
            handleRowClick={handleRowClick} // Pass handleRowClick to the table
          />

          )}
          <ApprovalModal
            show={showApprovalModal}
            onHide={() => setShowApprovalModal(false)}
            onClick={() => handleBulkSubmit("approve")}
            onSubmit={(e) => handleSubmit(e, "approve")}
          />
          <RejectionModal
            show={showRejectionModal}
            onHide={() => setShowRejectionModal(false)}
            onClick={() => handleBulkSubmit("reject")}
            onSubmit={(e) => handleSubmit(e, "reject")}
          />

          <DeleteConfirmationModal
            show={showDeleteModal}
            onHide={() => setShowDeleteModal(false)}
            onDelete={handleDelete}
            rowData={rowData}
          />

          <ViewUpload
            setFormData={setFormData}
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
