import React from "react";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "../../../_metronic/_partials/controls";
import {
  headerSortingClasses,
  toAbsoluteUrl,
} from "../../../_metronic/_helpers";
import * as Yup from "yup";
import {
  reqProdCategory,
  getProductModelPendingInfo,
  addProductInfo,
  // getProductInputsById,
  deleteProductInfo,
  updateProduct,
  approveRejectProduct,
} from "../../services/configService";
import "./index.css";
import Cookie from "js-cookie";
import SVG from "react-inlinesvg";
import { Button, Modal, Form } from "react-bootstrap";
import { useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { addCategoriesData } from "../../../redux/Category/action";
import "react-toastify/dist/ReactToastify.css";
import { showErrorToast, showSuccessToast } from "../../../Utility/toastMsg";
import TablePagination from "../../Components/TablePagination";
import { useEffect } from "react";
import { useFormik } from "formik";
import { charValidate } from "../../../Utility/commonFunctions";
import { useHistory } from "react-router-dom";

export default function ProductQueueTable({
  status = 0,
  title = "Product Queue",
  screen = "",
  isApproved = false,
}) {
  const searchInputRef = useRef();

  const [show, setShow] = useState(false);
  const editFormRef = useRef();

  const handleClose = () => {
    setShow(false);
    setIsViewData(false);
    setIsEditFlag(false);
    setCategoryInputs([]);
    setCategoryNameOnSelection("");
    errors["others"] = undefined;
    touched["others"] = false;
    // if (!isDraftFlag) {
    //   setFieldValue("categoryName", "");
    // }
  };

  const handleShow = () => setShow(true);
  // const [formParams, setFormParams] = useState({
  //   modelNumber: "",
  //   manufacturerName: "",
  //   productName: "",
  //   categoryName: "",
  //   others: "",
  // });

  const [deleteShow, setDeleteShow] = useState(false);
  const handleDeleteShow = () => setDeleteShow(true);
  const handleDeleteClose = () => setDeleteShow(false);
  const [categoryName, setCategoryName] = useState([]);
  const [categoryInputs, setCategoryInputs] = useState([]);
  const [rowData, setRowData] = useState("");
  const [categoryNameOnSelection, setCategoryNameOnSelection] = useState("");
  const [search, setSearch] = useState("");
  const [statusPopUp, setStatusPopUp] = useState(false);
  const [submitShow, setSubmitShow] = useState(false);
  const [isViewData, setIsViewData] = useState(false);
  const [isDraftFlag, setIsDraftFlag] = useState(false);
  const [categoryNameOnChange, setCategoryNameOnChange] = useState("");
  const [categoryIdonClick, setCategoryIdonClick] = useState("");
  const [inputValue, setInputValue] = useState(""); // Initialize as empty string

  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => {
    reqProdCategory(0, 100)
      .then((res) => res.json())
      .then((res) => {
        setCategoryName(res?.result);
      });
  }, []);
  const [IsEditFlag, setIsEditFlag] = useState(false);

  const renderActions = (_, row) => {
    return (
      <>
        {row?.status === 1 || row?.status === 3 ? (
          <a
            href="#"
            title="Edit"
            className="btn btn-icon btn-light btn-hover-primary btn-sm mx-1"
            onClick={(e) => {
              e.preventDefault();
              handleShow();
              setRowData(row);
              // setCategoryInputs(JSON.parse(row?.formBuilderData));
              setCategoryNameOnSelection(row?.categoryName);
              setIsEditFlag(true);
              setIsViewData(false);
            }}
          >
            <span className="svg-icon svg-icon-md svg-icon-primary">
              <SVG
                src={toAbsoluteUrl("/media/svg/icons/Communication/Write.svg")}
              />
            </span>
          </a>
        ) : null}
        <a
          href="#"
          title="View"
          className="btn btn-icon btn-light btn-hover-danger btn-sm mr-2"
          onClick={(e) => {
            e.stopPropagation();
            handleShow();
            setRowData(row);
            // setCategoryInputs(JSON.parse(row?.formBuilderData));
            setIsViewData(true);
            setIsEditFlag(false);
          }}
        >
          <span className="svg-icon svg-icon-md svg-icon-warning">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="#5bc0de"
              className="bi bi-eye-fill"
              viewBox="0 0 16 16"
            >
              <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z" />
              <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8zm8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z" />
            </svg>
          </span>
        </a>
        <a
          href="#"
          title="Delete"
          className="btn btn-icon btn-light btn-hover-danger btn-sm mr-2"
          onClick={(e) => {
            e.stopPropagation();
            // setRowData(row);
            // console.log("delete", row?.categoryId)
            let categoryIdonSelect = row.categoryId;
            showDeleteModal(e, categoryIdonSelect);
            setCategoryIdonClick(row?.id);
            // console.log(row)
          }}
        >
          <span className="svg-icon svg-icon-md svg-icon-danger">
            <SVG src={toAbsoluteUrl("/media/svg/icons/General/Trash.svg")} />
          </span>
        </a>
      </>
    );
  };

  const renderActions1 = (_, row) => {
    return (
      <>
        <a
          href="#"
          title="Submit"
          className="btn btn-icon btn-light btn-hover-primary btn-sm mx-1"
          onClick={(e) => {
            e.preventDefault();
            if (row?.isDraft) {
              setRowData(row);
              setSubmitShow(true);
              setCategoryNameOnSelection(row?.categoryName);
            } else {
              showErrorToast("Please update product details");
            }
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill={row?.isDraft ? "green" : "currentColor"}
            className="bi bi-send-check-fill"
            viewBox="0 0 16 16"
          >
            <path d="M15.964.686a.5.5 0 0 0-.65-.65L.767 5.855H.766l-.452.18a.5.5 0 0 0-.082.887l.41.26.001.002 4.995 3.178 1.59 2.498C8 14 8 13 8 12.5a4.5 4.5 0 0 1 5.026-4.47L15.964.686Zm-1.833 1.89L6.637 10.07l-.215-.338a.5.5 0 0 0-.154-.154l-.338-.215 7.494-7.494 1.178-.471-.47 1.178Z" />
            <path d="M16 12.5a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Zm-1.993-1.679a.5.5 0 0 0-.686.172l-1.17 1.95-.547-.547a.5.5 0 0 0-.708.708l.774.773a.75.75 0 0 0 1.174-.144l1.335-2.226a.5.5 0 0 0-.172-.686Z" />
          </svg>
        </a>
        <a
          href="#"
          title="Edit"
          className="btn btn-icon btn-light btn-hover-primary btn-sm mx-1"
          onClick={(e) => {
            e.preventDefault();
            setRowData(row);
            handleShow();
            // setCategoryInputs(JSON.parse(row?.formBuilderData));
            setCategoryNameOnSelection(row?.categoryName);
            // setIsEditFlag(true)
            setIsDraftFlag(row.isDraft);
            setIsViewData(false);
            // console.log(row)
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
          title="View"
          className="btn btn-icon btn-light btn-hover-danger btn-sm mr-2"
          onClick={(e) => {
            e.stopPropagation();
            handleShow();
            setRowData(row);
            // setCategoryInputs(JSON.parse(row?.formBuilderData));
            setIsViewData(true);
            setIsEditFlag(true);
          }}
        >
          <span className="svg-icon svg-icon-md svg-icon-warning">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="#5bc0de"
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

  const handleSubmitData = () => {
    let obj = {
      id: [rowData?.id],
      status: 2,
    };
    approveRejectProduct(obj)
      .then((res) => res.json())
      .then((res) => {
        dispatch(addCategoriesData(obj));
        showSuccessToast(res.message ?? "Product updated successfully");
        setSubmitShow(false);
      })
      .catch((err) => console.log(err));
  };

  const statusFormatter = (col, row) => {
    if (row?.status == 0) {
      return "Pending";
    } else if (row?.status == 1) {
      return <span style={{ color: "green" }}>Approved</span>;
    } else if (row?.status == 2) {
      return <span style={{ color: "#FF9A00" }}>Submmited</span>;
    } else if (row?.status == 3) {
      return <span style={{ color: "red" }}>Rejected</span>;
    }
  };
  const addProductSchema = Yup.object({
    others: Yup.string()
      .trim("Can't be empty")
      .nullable()
      .test(
        "keyValuePairs",
        "Input must be in the format of key-value pairs e.g - Name: John;",
        (value) => {
           if (!value) return true;  
          if (!value.trim().endsWith(";")) {
            return false; 
          }
          const pairs = value
            .split(";")
            .map((pair) => pair.trim())
            .filter((pair) => pair.length > 0);
        if (pairs.length > 1000) {
            return false; 
          }
        for (const pair of pairs) {
            const [key, val] = pair.split(":").map((item) => item.trim());
            if (!key || !val) {
              return false; 
            }
          }
          return true; 
        }
      ),
  });
  
  // const addProductSchema = Yup.object({
  //   others: Yup.string()
  //     .trim("can't be empty")
  //     .nullable()
  //     .test(
  //       "keyValuePairs",
  //       "Input must be in the format of key-value pairs e.g - Name: John;",
  //       (value) => {
  //         if (!value) return true;
  //         // const keyValuePattern = /^(?:[a-zA-Z0-9\s&(),"":;@.=\-+*$%#!_^`~/\\|{}[\]?<>\(\)βαγδ]+:\s*[a-zA-Z0-9\s&(),"":;@.=\-+*$%#!_^`~/\\|{}[\]?<>\(\)βαγδ]+;\s*)+$/gm;
  //         const keyValuePattern = /^(?:[a-zA-Z0-9\s&(),"":;@.=\-+*$%#!_^`'~/\\|{}[\]?<>\(\)βαγδ]+:\s*[a-zA-Z0-9\s&(),"":;@.=\-+*$%#!_^`'~/\\|{}[\]?<>\(\)βαγδ]+;\s*)+$/gm;
  //         return keyValuePattern.test(value);
  //       }
  //     ),
  // });

  const initialValues = {
    modelNumber: "",
    manufacturerName: "",
    productName: "",
    categoryName: "",
    categoryId: "",
    others: "@",
  };

  const {
    values,
    handleBlur,
    handleChange,
    handleSubmit,
    setFieldValue,
    setFieldError,
    errors,
    touched,
    resetForm,
  } = useFormik({
    initialValues: initialValues,
    // innerRef: editFormRef,
    validationSchema: addProductSchema,
    onSubmit: (values, action) => {
      let bodyParams = {
        modelNumber: values?.modelNumber,
        manufacturerName: values?.manufacturerName,
        categoryName: categoryNameOnChange
          ? categoryNameOnChange
          : rowData?.categoryName,
        categoryId: values?.categoryName,
        productName: values?.productName,
        otherInfo: values.others,
      };
      if (rowData?.id) {
        updateProduct(bodyParams, rowData?.id)
          .then((res) => {
            return res.json();
          })
          .then((res) => {
            if (res?.status !== 400) {
              dispatch(addCategoriesData(values));
              showSuccessToast(res.message);
              handleClose();
              resetForm();
              if (editFormRef && editFormRef.current) {
                editFormRef.current.resetForm();
              }
            }
          })
          .catch((error) => {
            showErrorToast("Unauthorized");
          });
      } else {
        addProductInfo(bodyParams)
          .then((res) => {
            return res.json();
          })
          .then((res) => {
            if (res.result === false) {
            } else if (res.result === true) {
              dispatch(addCategoriesData(values));
              showSuccessToast(res.message);
              handleClose();
              resetForm();
            }
          })
          .catch((error) => {
            showErrorToast("Unauthorized");
          });
      }
    },
  });

  useEffect(() => {
    Cookie.remove("filterValue");
    if (rowData) {
      setFieldValue("modelNumber", rowData?.modelNumber);
      setFieldValue("manufacturerName", rowData?.manufacturerName);
      setFieldValue("productName", rowData?.productName);
      setFieldValue("categoryName", rowData?.categoryId);
      setFieldValue("others", rowData?.otherInfo ?? "");
    }
  }, [rowData]);

  const deleteSubmit = (e) => {
    e.preventDefault();
    deleteProductInfo(categoryIdonClick)
      .then((res) => res.json())
      .then((res) => {
        handleDeleteClose();
        let x = Math.random();
        dispatch(addCategoriesData(x));
        if (res.result) {
          showSuccessToast(res.message);
        } else {
          showErrorToast(res.message);
        }
      })
      .catch((error) => console.log(error));
  };

  const showDeleteModal = (e, id) => {
    e.preventDefault();
    handleDeleteShow();
  };
  const manufacturerFormatter = (col, row) => {
    return row?.manufacturerName ? row?.manufacturerName : "N/A";
  };
  const modelNumberFormatter = (col, row) => {
    return row?.modelNumber ? row?.modelNumber : "N/A";
  };
  const CreatedByFormatter = (col, row) => {
    return row?.createdBy ? row?.createdBy : "N/A";
  };
  const UpdatedByFormatter = (col, row) => {
    return row?.updatedBy ? row?.updatedBy : "N/A";
  };
  const CategoryNameFormatter = (col, row) => {
    return row?.categoryName ? row?.categoryName : "N/A";
  };
  const productNameFormatter = (col, row) => {
    const productName = row?.productName
      ? charValidate(row?.productName, 20)
      : "N/A";
    return <span title={row?.productName}>{productName}</span>;
  };
  // const getCurrentDate = () => {
  //   const currentDate = new Date();
  //   const year = currentDate.getFullYear();
  //   return `${year}`;
  // };

  const handleCategoryChange = (e) => {
    handleChange(e);
    let categoryName = e.target.options[e.target.selectedIndex].textContent;
    setCategoryNameOnChange(categoryName);
    setFieldError("others", "");
  };
  const columns = [
    {
      dataField: "manufacturerName",
      text: "Manufacturer Name",
      headerSortingClasses,
      formatter: manufacturerFormatter,
    },
    {
      dataField: "modelNumber",
      text: "Model No.",
      headerSortingClasses,
      formatter: modelNumberFormatter,
    },
    {
      dataField: "categoryName",
      text: "Category Name",
      headerSortingClasses,
      formatter: CategoryNameFormatter,
    },
    {
      dataField: "productName",
      text: "Product Name",
      headerSortingClasses,
      formatter: productNameFormatter,
    },
    {
      dataField: "CreatedBy",
      text: "Created By",
      headerSortingClasses,
      formatter: CreatedByFormatter,
    },
    {
      dataField: "UpdatedBy",
      text: "Updated By",
      headerSortingClasses,
      formatter: UpdatedByFormatter,
    },
    {
      dataField: "status",
      text: "Status",
      headerSortingClasses,
      formatter: statusFormatter,
    },
    {
      dataField: "action",
      text: "Actions",
      formatter: screen === "ALL_DATA" ? renderActions : renderActions1,
      classes: "text-center pr-0",
      headerClasses: "text-center pr-3",
      style: {
        minWidth: "100px",
      },
    },
  ];

  const listenchange = (e) => {
    let temp = e.target.value;
    if (temp !== "") {
      let changeAfterReplace = temp.replace(/^\s+|\s+$/g, "");
      setSearch(changeAfterReplace);
    } else {
      searchInputRef.current.value = "";
      let searchValues = Math.random();
      Cookie.remove("searchText");
      dispatch(addCategoriesData(searchValues));
    }
  };

  const handleSearch = () => {
    getProductModelPendingInfo(0, 10, search)
      .then((res) => res.json())
      .then(() => {
        Cookie.set("searchText", search);
        dispatch(addCategoriesData(values));
      });
  };

  const handleFilter = (e) => {
    let x = Math.random();
    let filterValue = e.target.value;
    Cookie.set("filterValue", filterValue);
    dispatch(addCategoriesData(x));
  };

  const handleNavigate = () => {
    history.push("/bulk-upload");
  };

  const showModal = () => {
    setShow(true);
    setCategoryInputs();
    setIsViewData(false);
    setIsEditFlag(false);
    setFieldValue("modelNumber", "");
    setFieldValue("manufacturerName", "");
    setFieldValue("productName", "");
    setFieldValue("categoryName", "");
    setFieldValue("others", "");
  };

  return (
    <>
      <Card style={{ marginTop: "-40px" }}>
        {screen === "ALL_DATA" ? (
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
                  <option value="0">Pending</option>
                  <option value="1">Approved</option>
                  <option value="2">Submitted</option>
                  <option value="3">Rejected</option>
                </select>
              </div>
              <div className="d-flex mt-3 flex-wrap">
                <div>
                  <input
                    type="search"
                    className="form-control"
                    placeholder="Search..."
                    onChange={listenchange}
                    ref={searchInputRef}
                  />
                </div>
                <div>
                  <button
                    type="button"
                    className="btn btn-primary ml-2 mr-1"
                    onClick={(e) => {
                      handleSearch(undefined, undefined, listenchange);
                    }}
                    title="Search"
                  >
                    <i className="fas fa-search"></i>
                  </button>
                </div>
                <div style={{ marginRight: "5px" }} onClick={handleNavigate}>
                  <label
                    htmlFor="file"
                    style={{
                      padding: "9.3px 20px",
                      background: "#99c793",
                      color: "#fff",
                      borderRadius: "5px",
                    }}
                  >
                    <span style={{ cursor: "pointer" }} title="Bulk Upload">
                      Bulk upload &nbsp;
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        class="bi bi-cloud-arrow-up"
                        viewBox="0 0 16 16"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M7.646 5.146a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1-.708.708L8.5 6.707V10.5a.5.5 0 0 1-1 0V6.707L6.354 7.854a.5.5 0 1 1-.708-.708l2-2z"
                        />
                        <path d="M4.406 3.342A5.53 5.53 0 0 1 8 2c2.69 0 4.923 2 5.166 4.579C14.758 6.804 16 8.137 16 9.773 16 11.569 14.502 13 12.687 13H3.781C1.708 13 0 11.366 0 9.318c0-1.763 1.266-3.223 2.942-3.593.143-.863.698-1.723 1.464-2.383zm.653.757c-.757.653-1.153 1.44-1.153 2.056v.448l-.445.049C2.064 6.805 1 7.952 1 9.318 1 10.785 2.23 12 3.781 12h8.906C13.98 12 15 10.988 15 9.773c0-1.216-1.02-2.228-2.313-2.228h-.5v-.5C12.188 4.825 10.328 3 8 3a4.53 4.53 0 0 0-2.941 1.1z" />
                      </svg>
                    </span>
                  </label>
                </div>
                {/* <div className="mr-1">
               <Button onClick={handleReset} title="Reset">
                 <i className="fas fa-undo"></i>
               </Button>
             </div> */}
                <div>
                  <Button onClick={showModal}>Add New</Button>
                </div>
              </div>
            </CardHeaderToolbar>
          </CardHeader>
        ) : (
          <CardHeader title={title}>
            <CardHeaderToolbar>
              <div className="d-flex">
                <div>
                  <input
                    type="search"
                    className="form-control"
                    placeholder="Search..."
                    onChange={listenchange}
                    ref={searchInputRef}
                  />
                </div>
                <div>
                  <button
                    type="button"
                    className="btn btn-primary ml-2 mr-1"
                    onClick={(e) => {
                      handleSearch(undefined, undefined, listenchange);
                    }}
                    title="Search"
                  >
                    <i className="fas fa-search"></i>
                  </button>
                </div>
              </div>
            </CardHeaderToolbar>
          </CardHeader>
        )}
        <CardBody style={{ justifyContent: "center" }}>
          <TablePagination
            keyField="id"
            columns={columns}
            getRecordList={getProductModelPendingInfo}
            isShowExportCsv={false}
            status={status}
          />
        </CardBody>
      </Card>

      {/* -----  Edit Modal ---- */}
      <Modal
        show={show}
        onHide={() => {
          setShow(false);
          if (IsEditFlag && !isViewData) {
            let x = Math.random();
            dispatch(addCategoriesData(x));
          }
        }}
        aria-labelledby="contained-modal-title-vcenter"
        centered
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Product Details</Modal.Title>
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
              <Form.Label>Manufacturer Name</Form.Label>
              <Form.Control
                type="text"
                autoComplete="off"
                disabled={IsEditFlag || isViewData}
                placeholder="Manufacture Name"
                name="manufacturerName"
                onChange={handleChange}
                value={values?.manufacturerName || ""}
                onBlur={handleBlur}
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
              <Form.Label>Model Number</Form.Label>
              <Form.Control
                type="text"
                autoComplete="off"
                placeholder="Model Number"
                name="modelNumber"
                onChange={handleChange}
                disabled={IsEditFlag || isViewData}
                value={values?.modelNumber || ""}
                onBlur={handleBlur}
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
              <Form.Label>Product Name</Form.Label>
              <Form.Control
                type="text"
                autoComplete="off"
                placeholder="Product Name"
                name="productName"
                onChange={handleChange}
                disabled={isViewData}
                value={values?.productName || ""}
                onBlur={handleBlur}
                className="mb-3"
                required
              />
            </div>
            <br />
            <Form.Label>Category Name</Form.Label>
            <br />
            <select
              className="mb-3 mr-2"
              onChange={handleCategoryChange}
              name="categoryName"
              disabled={isViewData}
              value={values?.categoryName || ""} // Use an empty string instead of null
              style={{ width: "100%", height: "33px" }}
              required
            >
              <option value="">Select Category</option>{" "}
              {/* Ensure this option has an empty value */}
              {categoryName?.map((category) => (
                <option key={category?.categoryId} value={category?.categoryId}>
                  {category?.categoryName}
                </option>
              ))}
            </select>

            <Form.Label>Others</Form.Label>
            <br />
            <Form.Control
              as="textarea"
              placeholder="Other Info {Input must be Key: Value; pair (ex. Name:John;)}"
              rows={3}
              className="mb-3"
              onChange={handleChange}
              name="others"
              value={values?.others ?? ""}
              onBlur={handleBlur}
              disabled={isViewData}
            />
            {errors.others ? (
              <p style={{ color: "red" }}> {errors.others} </p>
            ) : null}
            <hr />
            <div style={{ display: "flex", justifyContent: "end" }}>
              <Button
                variant="secondary"
                onClick={() => {
                  setShow(false);
                }}
              >
                Close
              </Button>
              {!isViewData && (
                <Button
                  style={{
                    backgroundColor: "#FACD21",
                    border: "none",
                    color: "black",
                    marginLeft: 2,
                  }}
                  type="submit"
                >
                  Save
                </Button>
              )}
            </div>
          </Modal.Body>
        </Form>
      </Modal>

      {/* ----------Delete Modal---------- */}
      <Modal show={deleteShow} onHide={handleDeleteClose} centered>
        <Modal.Header>
          <Modal.Title>Confirmation</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure want to Delete?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleDeleteClose}>
            Cancel
          </Button>
          <Button
            variant="primary btn btn-danger"
            onClick={(e) => {
              deleteSubmit(e);
            }}
          >
            Delete
          </Button>
        </Modal.Footer>
      </Modal>

      {/* ----------Submit Modal---------- */}
      <Modal show={submitShow} onHide={() => setSubmitShow(false)} centered>
        <Modal.Header>
          <Modal.Title>Confirmation</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure want to Submit ?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setSubmitShow(false)}>
            Cancel
          </Button>
          <Button variant="primary btn btn-dark" onClick={handleSubmitData}>
            Submit
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
