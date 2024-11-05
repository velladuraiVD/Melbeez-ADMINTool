import React, { useEffect } from "react";
import { useState } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "../../../_metronic/_partials/controls";
import SVG from "react-inlinesvg";
import { Button, Modal, Form } from "react-bootstrap";
import {
  headerSortingClasses,
  toAbsoluteUrl,
} from "../../../_metronic/_helpers";
import {
  reqAdminUserList,
  addAdmin,
  deleteAdmin,
} from "../../services/configService";
import TablePagination from "../../Components/TablePagination";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { addAdminData } from "../../../redux/Admin/action";
import { showErrorToast, showSuccessToast } from "../../../Utility/toastMsg";
import Cookie from "js-cookie";
import { requestCountryList } from "../../services/configService";

const SignUpSchema = Yup.object({
  userName: Yup.string()
    .trim("can't be empty")
    .min(2, "User Name Must Be Min. 2 Character")
    .max(20)
    .required("User Name can't be empty"),
  firstName: Yup.string()
    .trim()
    .min(2, "First Name Must Be Min. 2 Character")
    .max(20)
    .required("First Name can't be empty"),
  lastName: Yup.string()
    .trim()
    .min(2, "Last Name Must Be Min. 2 Character")
    .max(20)
    .required("Last Name can't be empty"),
  email: Yup.string()
    .email()
    .required("Email field can't be empty"),
  CountryCode: Yup.string()
    .required("Country code can't be empty")
    .trim(),
  phoneNumber: Yup.string()
    .required("Phone No. can't be empty")
    .trim()
    .matches(/^[0-9]{10}$/, "Enter valid phone number")
    .min(10),
});

const initialValues = {
  userName: "",
  firstName: "",
  lastName: "",
  email: "",
  CountryCode: "",
  phoneNumber: "",
};

export default function AdminUser() {
  const [userId, setUserId] = useState(0);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [search, setSearch] = useState();

  const [deleteShow, setDeleteShow] = useState(false);
  const handleDeleteShow = () => setDeleteShow(true);
  const handleDeleteClose = () => setDeleteShow(false);
  const [countryCode, setCountryCode] = useState([])

  const dispatch = useDispatch();

  const {
    values,
    handleBlur,
    handleChange,
    handleSubmit,
    touched,
    errors,
    resetForm,
  } = useFormik({
    initialValues: initialValues,
    validationSchema: SignUpSchema,
    onSubmit: (values, action) => {
      addAdmin(values)
        .then((res) => {
          return res.json();
        })
        .then((res) => {
          dispatch(addAdminData(values));
          showSuccessToast(res.message);
        })
        .catch((error) => {
          showErrorToast("Unauthorized");
        });
      handleClose();
      action.resetForm();
    },
  });

  useEffect(() => {
    requestCountryList()
      .then((res) => res.json())
      .then((res) => {
        console.log(res.result)
        setCountryCode(res.result)
      })
      .catch((err) => console.log(err))
  }, [])

  const renderActions = (_, row) => {
    return (
      <>
        <a
          href="#"
          title="Delete Admin"
          className="btn btn-icon btn-light btn-hover-danger btn-sm mr-2"
          onClick={(e) => {
            e.stopPropagation();
            showDeleteModal(e, row.id);
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
      dataField: "id",
      text: "ID",
      hidden: true,
    },
    {
      dataField: "firstName",
      text: "First Name",
      headerSortingClasses,
    },
    {
      dataField: "lastName",
      text: "Last Name",
      headerSortingClasses,
    },
    {
      dataField: "email",
      text: "Email",
      headerSortingClasses,
    },
    {
      dataField: "phoneNumber",
      text: "Contact",
      headerSortingClasses,
    },
    {
      dataField: "action",
      text: "Actions",
      formatter: renderActions,
      classes: "text-right pr-0",
      headerClasses: "text-right pr-3",
      style: {
        minWidth: "114px",
      },
    },
  ];

  const showDeleteModal = (e, id) => {
    e.preventDefault();
    setUserId(id);
    handleDeleteShow();
  };

  const deleteSubmit = (e) => {
    e.preventDefault();
    deleteAdmin(userId)
      .then((res) => res.json())
      .then((res) => {
        handleDeleteClose();
        dispatch(addAdminData(userId));
        showSuccessToast(res.message);
      })
      .catch((error) => console.log(error));
  };

  const listenchange = (e) => {
    let temp = e.target.value;
    if (temp !== "") {
      let changeAfterReplace = temp.replace(/^\s+|\s+$/g, '');
      setSearch(changeAfterReplace);
    } else {
      let searchValues = Math.random();
      Cookie.remove("searchText");
      dispatch(addAdminData(searchValues));
    }
  };

  const handleSearch = () => {
    reqAdminUserList(0, 10, search)
      .then((res) => res.json())
      .then(() => {
        const ans = search.replace("+", "%2B");
        Cookie.set("searchText", ans);
        dispatch(addAdminData(search));
      });
  };

  return (
    <>
      <Modal
        show={show}
        onHide={handleClose}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Admin User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Label>User Name</Form.Label>
            <Form.Control
              type="text"
              name="userName"
              autoComplete="off"
              onChange={handleChange}
              value={values.userName}
              onBlur={handleBlur}
              placeholder="Enter user name"
              className="mb-3"
            />
            {errors.userName && touched.userName ? (
              <p style={{ color: "red" }}> {errors.userName} </p>
            ) : null}
            <Form.Label>First Name</Form.Label>
            <Form.Control
              type="text"
              name="firstName"
              autoComplete="off"
              onChange={handleChange}
              value={values.firstName}
              onBlur={handleBlur}
              placeholder="Enter first name"
              className="mb-3"
            />
            {errors.firstName && touched.firstName ? (
              <p style={{ color: "red" }}> {errors.firstName} </p>
            ) : null}
            <Form.Label>Last Name</Form.Label>
            <Form.Control
              type="text"
              name="lastName"
              autoComplete="off"
              onChange={handleChange}
              value={values.lastName}
              onBlur={handleBlur}
              placeholder="Enter last name"
              className="mb-3"
            />
            {errors.lastName && touched.lastName ? (
              <p style={{ color: "red" }}> {errors.lastName} </p>
            ) : null}
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="text"
              name="email"
              autoComplete="off"
              onChange={handleChange}
              value={values.email}
              onBlur={handleBlur}
              placeholder="Enter Email"
              className="mb-3"
            />
            {errors.email && touched.email ? (
              <p style={{ color: "red" }}> {errors.email} </p>
            ) : null}
            <Form.Label>Country Code</Form.Label>
            <select
              aria-label="Default select example"
              className="form-control mb-3"
              name="CountryCode"
              autoComplete="off"
              onChange={handleChange}
              value={values.CountryCode}
              onBlur={handleBlur}
            >
              <option>Select Country</option>
              {countryCode.map(obj => (
                <option value={obj.countryCode} key={obj.id}>{obj.name} ({(obj.countryCode)})</option>
              ))}
            </select>
            {errors.email && touched.CountryCode ? (
              <p style={{ color: "red" }}> {errors.CountryCode} </p>
            ) : null}
            <Form.Label>Contact No</Form.Label>
            <Form.Control
              type="text"
              name="phoneNumber"
              autoComplete="off"
              onChange={handleChange}
              value={values.phoneNumber}
              onBlur={handleBlur}
              placeholder="Enter Phone Number"
            />
            {errors.phoneNumber && touched.phoneNumber ? (
              <p style={{ color: "red" }}> {errors.phoneNumber} </p>
            ) : null}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => {
              handleClose();
              resetForm();
            }}
          >
            Close
          </Button>
          <Button
            style={{
              backgroundColor: "#FACD21",
              border: "none",
              color: "black",
            }}
            type="submit"
            onClick={() => {
              handleSubmit();
            }}
          >
            Save
          </Button>
        </Modal.Footer>
      </Modal>
      <Card style={{ marginTop: "-40px" }}>
        <CardHeader title="Admin Users">
          <CardHeaderToolbar>
            <div className="d-flex">
              <div>
                <input
                  type="search"
                  className="form-control"
                  placeholder="Search..."
                  onChange={listenchange}
                />
              </div>
              <div>
                <button 
                  type="button"
                  className="btn btn-primary mr-1 ml-2"
                  onClick={(e) => {
                    handleSearch(undefined, undefined, listenchange);
                  }}
                  title="Search"
                >
                  <i className="fas fa-search"></i>
                </button>
              </div>
              <div>
                <Button className="bg-primary" onClick={handleShow}>
                  Add New
                </Button>
              </div>
            </div>
          </CardHeaderToolbar>
        </CardHeader>
        <CardBody style={{ justifyContent: "center" }}>
          <TablePagination
            keyField="Id"
            columns={columns}
            getRecordList={reqAdminUserList}
            isShowExportCsv={false}
          />
        </CardBody>
      </Card>
      <Modal show={deleteShow} onHide={handleDeleteClose} centered>
        <Modal.Header>
          <Modal.Title>Delete Admin User</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure to delete this admin user?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleDeleteClose}>
            Close
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
    </>
  );
}
