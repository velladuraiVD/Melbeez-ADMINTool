import React from "react";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "../../../../_metronic/_partials/controls";
import { headerSortingClasses } from "../../../../_metronic/_helpers";
import { GetContactUS } from "../../../services/configService";
import TablePagination from "../../../Components/TablePagination";
import { useState, useRef } from "react";
import { Modal } from "react-bootstrap";
import moment from "moment";
import { addBlockUserData } from "../../../../redux/Block_user/action";
import { useDispatch } from "react-redux";
import Cookie from "js-cookie";

export default function ContactUs() {
  const searchInputRef = useRef();  
  
  const dateAndTimeFormatter = (cell, row) => {
    let obj = row.createdOn;
    return moment(obj).format("LL HH:ss");
  };
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  // const handleShow = () => setShow(true);

  const [imageShow, setImageShow] = useState(false);
  const dispatch = useDispatch();
  const [search, setSearch] = useState();

  const listenchange = (e) => {
    let temp = e.target.value;
    if(temp !== ""){
      let changeAfterReplace = temp.replace(/^\s+|\s+$/g, '');
      setSearch(changeAfterReplace);
    }else{
        searchInputRef.current.value = "";
        let searchValues = Math.random();
        Cookie.remove("searchText");
        dispatch(addBlockUserData(searchValues));
    }
  };

  const handleSearch = () => {
    GetContactUS(0,10,search)
      .then((res) => res.json())
      .then(() => {
        Cookie.set("searchText",search)
        dispatch(addBlockUserData(search));
      });
  };

  const ImageUrl = (cell, row) => {
    if(row.image){
      return "Yes"
    }else{
      return "No"
    }
  };

  const columns = [
    {
      dataField: "email",
      text: "Email",
      headerSortingClasses,
    },
    {
      dataField: "subject",
      text: "Subject",
      headerSortingClasses,
    },
    {
      dataField: "message",
      text: "Message",
      headerSortingClasses,
    },
    {
      dataField: "image",
      text: "Attachment",
      headerSortingClasses,
      formatter: ImageUrl,
    },
    {
      dataField: "createdOn",
      text: "Date & Time",
      headerSortingClasses,
      formatter: dateAndTimeFormatter,
    },
  ];

  return (
    <>
      <Card className='mt-lg-n12 mt-6'>
        <CardHeader title="Contact Us Logs">
          <CardHeaderToolbar>
            <div className="d-flex">
              <input
                id="search-focus"
                type="search"
                className="form-control"
                placeholder="Search..."
                onChange={listenchange}
                ref={searchInputRef}
              />
               <button
                type="button"
                className="btn btn-primary ml-2"
                onClick={(e) => {
                  handleSearch(undefined, undefined, listenchange);
                }}
                title="Search"
              >
                <i className="fas fa-search"></i>
              </button>
            </div>
          </CardHeaderToolbar>
        </CardHeader>
        <CardBody style={{ justifyContent: "center" }}>
          <TablePagination
            keyField="Id"
            columns={columns}
            getRecordList={GetContactUS}
            isShowExportCsv={false}
          />
        </CardBody>
      </Card>
      <div>
        <Modal show={show} onHide={handleClose} centered>
          <img src={imageShow} style={{ maxHeight: "calc(125vh - 150px)" }} />
          <i
            className="fa fa-times"
            aria-hidden="true"
            onClick={handleClose}
            style={{
              position: "absolute",
              right: "-17px",
              top: "-12px",
              color: "black",
              cursor: "pointer"
            }}
          ></i>
        </Modal>
      </div>
    </>
  );
}
