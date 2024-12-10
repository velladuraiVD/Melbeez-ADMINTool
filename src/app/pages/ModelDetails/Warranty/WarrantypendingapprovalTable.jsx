import React, { useState, useEffect, useRef } from "react";
import { Table, Form } from "react-bootstrap"; 
import { TablePagination } from "@material-ui/core";
import ActionButtons from "../WarrantyButtonComponent/ActionButttons";

const WarrantypendingapprovalTable = ({
  columns,
  data,
  currentPage,
  itemsPerPage: initialItemsPerPage,
  handleApproval,
  handleEdit,
  handleDelete,
  paginate,
  handleRowClick,
  handleReject,
  onSelectionChange, 
}) => {
  const [itemsPerPage, setItemsPerPage] = useState(initialItemsPerPage);
  const [searchQueries, setSearchQueries] = useState({});
  const [selectedIds, setSelectedIds] = useState([]);
  const searchInputRefs = useRef(columns.map(() => React.createRef()));

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
              onView={() => handleRowClick(row)} // Use function to prevent immediate invocation
              handleApproval={handleApproval}
              handleReject={handleReject}
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

        if (typeof cellValue === "string") {
          return cellValue.toLowerCase().includes(query.toLowerCase());
        } else if (typeof cellValue === "number") {
          return cellValue.toString().includes(query);
        }

        return false;
      }
      return true; // Include items that haven't been searched or are in 'actions'
    })
  );

  const handleSelectAll = (e) => {
    const newSelectedIds = e.target.checked
      ? filteredData.map((item) => item.id)
      : [];
    
    setSelectedIds(newSelectedIds);
    onSelectionChange(newSelectedIds); // Notify parent of selection change
  };

  return (
    <>
      {filteredData.length === 0 ? (
        <div className="text-center text-danger mt-4">
          No pending data found!
        </div>
      ) : (
        <div className="table-responsive">
          <Table
            className="table table-head-custom table-vertical-center overflow-hidden"
            hover
            condensed="true"
          >
            <thead>
              <tr>
                <th>
                  <Form.Check
                    type="checkbox"
                    onChange={handleSelectAll}
                    checked={
                      filteredData.length > 0 &&
                      selectedIds.length === filteredData.length
                    }
                  />
                </th>
                {columnsWithActions.map((column, index) => (
                  <th key={index}>{column.text}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item, index) => (
                <tr key={item.id}>
                  <td>
                    <Form.Check
                      type="checkbox"
                      checked={selectedIds.includes(item.id)}
                      onChange={() => {
                        const newSelectedIds = selectedIds.includes(item.id)
                          ? selectedIds.filter((id) => id !== item.id)
                          : [...selectedIds, item.id];

                        setSelectedIds(newSelectedIds);
                        onSelectionChange(newSelectedIds); // Notify parent of selection change
                      }}
                    />
                  </td>
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
        rowsPerPageOptions={[5, 10, 25, 50]} 
        component="div"
        count={sortedData.length}
        rowsPerPage={itemsPerPage}
        page={currentPage - 1}
        onChangePage={(e, newPage) => paginate(newPage + 1)}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />
    </>
  );
};

export default WarrantypendingapprovalTable;
