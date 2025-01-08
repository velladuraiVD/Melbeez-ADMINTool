import React from "react";
import { headerSortingClasses } from "../../../../_metronic/_helpers";
import { Container, Table, Pagination, Spinner } from "react-bootstrap";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "../../../../_metronic/_partials/controls";
import { useAuth } from "../AuthContext";
import { useEffect, useState } from "react";
import { showErrorToast, showSuccessToast } from "../../../../Utility/toastMsg";
import * as XLSX from "xlsx";
import { selectFilter } from "react-bootstrap-table2-filter";

function Transaction() {
  const [columns] = useState([
    { dataField: "userId", text: "user ID", headerSortingClasses },
    { dataField: "email", text: "Email", headerSortingClasses },
    { dataField: "productName", text: "Product Name", headerSortingClasses },
    {
      dataField: "price",
      text: "Price",
      headerSortingClasses,
      formatter: (cell) => `$${parseFloat(cell).toFixed(2)}`,
    },
    {
      dataField: "interval",
      text: "subscription",
      headerSortingClasses,
      formatter: (cell) => `$${parseFloat(cell).toFixed(2)}`,
    },
    {
      dataField: "phoneNumber",
      text: "Mobile",
      headerSortingClasses,
      formatter: (cell) => `${parseFloat(cell)}%` || "N/A",
    },
    {
      dataField: "invoice_status",
      text: "Status",
      headerSortingClasses,
      formatter: (cell) => cell,
    },
    {
      dataField: "createdAt",
      text: "subscription Date",
      headerSortingClasses,
      formatter: (cell) => {
        const date = new Date(cell); // Parse the date string
        const options = { day: "numeric", month: "short", year: "numeric" }; // Format options
        return date.toLocaleDateString("en-US", options).replace(",", ""); // Apply format
      },
    },
  ]);

  const { fetchTransactionDetails,setTransactiondata,transactiondata, loading,setfilterdata, filterdata} = useAuth();

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5); // Default 5 items per page

  useEffect(() => {
    fetchTransactionDetails();
  }, []);

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = transactiondata.slice(indexOfFirstItem, indexOfLastItem);

  // Change page handler
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Rows per page change handler
  const handleRowsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset to first page when items per page changes
  };

  const exportToExcel = () => {
    try {
      // Ensure data is not empty
      if (!transactiondata || transactiondata.length === 0) {
        showErrorToast("No data to export.");
        return;
      }

      // Filter out the 'id' field from each object in data
      const filteredData = transactiondata.map(({ id, ...rest }) => rest);

      const worksheet = XLSX.utils.json_to_sheet(filteredData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
      XLSX.writeFile(workbook, "userTransctionlog.xlsx");
      showSuccessToast("Data exported to Excel successfully.");
    } catch (error) {
      showErrorToast("Error exporting data to Excel.");
      // console.error("Export to Excel error:", error);
    }
  };

  
  const handleFilter = (e) => {
    const filterValue = e.target.value;

    if (filterValue === "") {
      // If no filter is selected, show all data
     
      setTransactiondata(transactiondata);
    } else {
      // Filter the data based on the selected status
      const filtered = transactiondata.filter(
        (item) => item.invoice_status.toLowerCase() === filterValue.toLowerCase()
      );
      setTransactiondata(filtered);
    }
  };

  const renderhead = () => {
    return (
      <tr>
        {columns.map((col) => (
          <th key={col.dataField}>{col.text}</th>
        ))}
      </tr>
    );
  };

  const renderdata = () => {
    return (
      <>
        {currentItems.map((item, index) => (
          <tr key={index}>
            {columns.map((col) => (
              <td key={col.dataField}>
                {col.dataField === "interval" ? (
                  item[col.dataField] === "month" ? "Monthly" : 
                  item[col.dataField] === "year" ? "Yearly" : item[col.dataField]
                ) : col.dataField === "invoice_status" ? (
                  item[col.dataField] === "paid" ? "Payment Successful" : 
                  item[col.dataField] === "open" ? "Pending" : 
                  item[col.dataField] === "faied" ? "payment Failed" : item[col.dataField]
                ) : (
                  item[col.dataField]
                )}
              </td>
            ))}
          </tr>
        ))}
      </>
    );
  };
  
  // Pagination controls
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(transactiondata.length / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <Container>
      <Card>
        <CardHeader title="Transaction logs">
          <CardHeaderToolbar>
            <div>
              <select
                name="invoice_statusSelect"
                id="invoice_status"
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
                <option value="paid">paid</option>
                <option value="open">open</option>
                <option value="Failed">Failed</option>
              </select>
            </div>
            <div className="d-flex">
              <div>
                <input
                  type="search"
                  className="form-control"
                  placeholder="Search Transaction..."
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
        <CardBody>
          {loading ? (
            <div className="text-center">
              <Spinner animation="border" role="status">
                <span className="sr-only">Loading...</span>
              </Spinner>
            </div>
          ) : (
            <>
              <div className="table-responsive">
                <Table
                  className="table table-head-custom table-vertical-center overflow-hidden"
                  hover
                  condensed="true"
                >
                  <thead>{renderhead()}</thead>
                  <tbody>{renderdata()}</tbody>
                </Table>
              </div>
              {/* Pagination and Rows Per Page at the bottom */}
              <div className="d-flex justify-content-between align-items-center">
                {/* Rows Per Page Dropdown */}
                <div>
                  <select
                    id="rowsPerPage"
                    value={itemsPerPage}
                    onChange={handleRowsPerPageChange}
                    style={{
                      height: "38px",
                      border: "1px solid #ccc",
                      borderRadius: "4px",
                      fontSize: "1.1em",
                      padding: "3px 0px",
                      backgroundColor: "#fff",
                    }}
                  >
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="25">25</option>
                    <option value="50">50</option>
                  </select>
                </div>
                {/* Pagination centered */}
                <div className="d-flex justify-content-center w-100">
                  <Pagination>
                    {pageNumbers.map((number) => (
                      <Pagination.Item
                        key={number}
                        active={number === currentPage}
                        onClick={() => paginate(number)}
                      >
                        {number}
                      </Pagination.Item>
                    ))}
                  </Pagination>
                </div>
              </div>
            </>
          )}
        </CardBody>
      </Card>
    </Container>
  );
}

export default Transaction;
