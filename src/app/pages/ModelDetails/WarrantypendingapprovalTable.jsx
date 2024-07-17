import React, { useState, useEffect, useRef } from "react";
import { Table, Popover, Form, Alert } from "react-bootstrap"; // Import Alert from react-bootstrap
import { TablePagination } from "@material-ui/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import ActionButtons from "./ActionButttons";

const WarrantypendingapprovalTable = ({
  columns,
  data,
  currentPage,
  itemsPerPage: initialItemsPerPage,
  handleEdit,
  handleDelete,
  paginate,
  handleRowClick,
}) => {
  const [itemsPerPage, setItemsPerPage] = useState(initialItemsPerPage);
  const [searchQueries, setSearchQueries] = useState({});
  const [openPopoverId, setOpenPopoverId] = useState(null); // Track open popover id
  const searchInputRefs = useRef(columns.map(() => React.createRef()));
  const [showViewModal, setShowViewModal] = useState(false); // Modal visibility state

  // Sort the data by the 'createdAt' field in descending order (newest first)
  const sortedData = data.sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedData.slice(indexOfFirstItem, indexOfLastItem);

  const columnsWithActions = columns.map((column) =>
    column.dataField === "actions"
      ? {
          ...column,
          formatter: (cell, row) => (
            <ActionButtons
              row={row}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onView={handleRowClick}
            />
          ),
        }
      : column
  );

  const handleChangeRowsPerPage = (event) => {
    setItemsPerPage(parseInt(event.target.value, 10));
    paginate(1); // Reset to the first page when changing items per page
  };

  const filteredData = currentItems.filter((item) =>
    columns.every((column) => {
      const query = searchQueries[column.dataField];
      if (query && column.dataField !== "actions") {
        const cellValue = item[column.dataField];

        // Check if the cell value includes the query (case insensitive)
        if (typeof cellValue === "string") {
          return cellValue.toLowerCase().includes(query.toLowerCase());
        } else if (typeof cellValue === "number") {
          // If cell value is a number, convert to string and check includes
          return cellValue.toString().includes(query);
        }

        return false;
      }
      return true; // Include items that haven't been searched or are in 'actions'
    })
  );

  return (
    <>
      {filteredData.length === 0 ? (
      <div className="text-center text-danger mt-4">
      No  pending data  found !
    </div>
      ) : (
        <div className="table-responsive">
          <Table
            className="table table-head-custom table-vertical-center overflow-hidden"
            hover
            condensed
          >
            <thead>
              <tr>
                {columnsWithActions.map((column, index) => (
                  <th key={index}>{column.text}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item, index) => (
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
        </div>
      )}
      <TablePagination
        rowsPerPageOptions={[5, 10, 25, 50]} // Options for rows per page
        component="div"
        count={sortedData.length}
        rowsPerPage={itemsPerPage}
        page={currentPage - 1}
        onChangePage={(e, newPage) => paginate(newPage + 1)}
        onChangeRowsPerPage={handleChangeRowsPerPage} // Handle change in rows per page
        // rowEvents={{
        //   onClick: (e, row) => handleRowClick(row),
        // }}
      />
    </>
  );
};

export default WarrantypendingapprovalTable;
