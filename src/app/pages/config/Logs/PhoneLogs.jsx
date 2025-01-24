import React, { useEffect } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "../../../../_metronic/_partials/controls";
import { headerSortingClasses } from "../../../../_metronic/_helpers";
import { GetPhoneLog } from "../../../services/configService";
import TablePagination from "../../../Components/TablePagination";
import { useState } from "react";
import { Modal } from "react-bootstrap";
import moment from "moment";
import { charValidate } from "../../../../Utility/commonFunctions";
import { Button, Form } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { addAdminData } from "../../../../redux/Admin/action";
import Cookie from "js-cookie";
import { useRef } from "react";
import { addBlockUserData } from "../../../../redux/Block_user/action";

export default function PhoneLogs() {
  const searchInputRef = useRef();
  const ExcelCustomName = Cookie.set("exclname", "Phone Logs.csv");
  const [search, setSearch] = useState("");
  const dispatch = useDispatch(); 
  const [value, setValue] = useState("");
  const [value1, setValue1] = useState("");
  const dateAndTimeFormatter = (cell, row) => {
    let obj = row.createdOn;
    return moment(obj).format("LL HH:ss");
  };
  const errorMessageFormatter = (cell, row) => {
    let obj = row.errorMessage;
    if (obj == null) {
      return "N/A";
    } else {
      return obj;
    }
  };
  const statusFormat = (cell, row) => {
    let obj = row.status;
    return obj;
  };

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [textShow, setTextShow] = useState(false);

  const textSortingForError = (text) => {
    if (text && text !== undefined) {
      return (
        <p
          onClick={() => {
            setTextShow(text);
            handleShow();
          }}
        >
          {charValidate(text, 20)}
        </p>
      );
    }
  };

  const listenchange = (e) => {
    let temp = e.target.value;
    if (temp !== "") {
      let changeAfterReplace = temp.replace(/^\s+|\s+$/g, '');
      setSearch(changeAfterReplace);
    } else {
      searchInputRef.current.value = "";
      let searchValues = Math.random();
      Cookie.remove("searchText");
      dispatch(addBlockUserData(searchValues));
      setSearch("");
      Cookie.remove("dateforsearch");
      Cookie.remove("date2forsearch");
      dispatch(addAdminData(searchValues));
      setValue1("");
      setValue("");
    }
  };

  const handleSearch = () => {
    const ans = search.replace("+", "%2B");
    Cookie.set("searchText", ans);
    dispatch(addBlockUserData(search));
  };

  const columns = [
    {
      dataField: "to",
      text: "Phone No.",
      headerSortingClasses,
    },
    {
      dataField: "status",
      text: "Status",
      headerSortingClasses,
      formatter: statusFormat,
    },
    {
      dataField: "errorMessage",
      text: "Errors",
      headerSortingClasses,
      formatter: textSortingForError,
      csvFormatter: errorMessageFormatter,
    },
    {
      dataField: "createdOn",
      text: "Date & Time",
      headerSortingClasses,
      formatter: dateAndTimeFormatter,
      csvFormatter: dateAndTimeFormatter,
    },
  ];

  const handleChange = (e) => {
    setValue(e.target.value);
  };

  const handleChange1 = (e) => {
    setValue1(e.target.value);
  };

  const handleClick = () => {
    Cookie.set("dateforsearch", value);
    Cookie.set("date2forsearch", value1);
    dispatch(addAdminData(value));
  };
  // const handleReset = () => {
  //   Cookie.remove("dateforsearch");
  //   Cookie.remove("date2forsearch");
  //   dispatch(addAdminData());
  //   setValue1("");
  //   setValue("");
  //   searchInputRef.current.value = "";
  // };
  // const handleReset2 = () => {
  //   Cookie.remove("searchText");
  //   dispatch(addAdminData("reset"));
  //   setSearch("");
  // };
  const ref = useRef();
  const ref1 = useRef();

  return (
    <>
      <Card className='mt-lg-n12 mt-6'>
        <CardHeader className='mt-5' title="Phone Logs">
          <CardHeaderToolbar>
            <div style={{ display: "flex", alignItems: "center" }}>
                <div>
                  <input
                    id="search-focus"
                    type="search"
                    className="form-control"
                    placeholder="Search..."
                    ref={searchInputRef}
                    onChange={listenchange}
                  />
                </div>
                <div>
                  <Form.Group controlId="duedate" className="mb-0 mr-2 ml-2">
                    <Form.Control
                      className="form-control"
                      onChange={handleChange}
                      value={value}
                      placeholder="Start date"
                      type="text"
                      ref={ref1}
                      onFocus={() => (ref1.current.type = "date")}
                      onBlur={() => (ref1.current.type = "text")}
                    />
                  </Form.Group>
                </div>
                <div>
                  <Form.Group controlId="duedate" className="mb-0 mr-2">
                    <Form.Control
                      className="form-control"
                      onChange={handleChange1}
                      value={value1}
                      placeholder="End date"
                      type="text"
                      ref={ref}
                      onFocus={() => (ref.current.type = "date")}
                      onBlur={() => (ref.current.type = "text")}
                    />
                  </Form.Group>
                </div>
                <div>
                  <Button
                    onClick={() => {
                      handleClick();
                      handleSearch();
                    }}
                    title="Search"
                  >
                    <i className="fa fa-search" aria-hidden="true"></i>
                  </Button>
                </div>
                {/* <div className="col-1 ml-5 ml-md-0">
                  <Button
                    onClick={() => {
                      handleReset();
                      handleReset2();
                    }}
                    title="Reset"
                  >
                    <i className="fas fa-undo"></i>
                  </Button>
                </div> */}
              </div>
          </CardHeaderToolbar>
        </CardHeader>
        <CardBody style={{ justifyContent: "center" }}>
          <TablePagination
            keyField="Id"
            columns={columns}
            getRecordList={GetPhoneLog}
          />
        </CardBody>
      </Card>
      <div className="d-flex">
        <Modal show={show} onHide={handleClose} centered>
          <Modal.Header>Error</Modal.Header>
          <h4 className="p-5" style={{ fontSize: 13 }}>
            {textShow}
          </h4>
          <i
            className="fa fa-times"
            aria-hidden="true"
            onClick={handleClose}
            style={{
              position: "absolute",
              right: "-17px",
              top: "-12px",
              color: "black",
              cursor: "pointer",
            }}
          ></i>
        </Modal>
      </div>
    </>
  );
}
