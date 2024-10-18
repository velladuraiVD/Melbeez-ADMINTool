import { CardHeader } from "@material-ui/core";
import React, { useEffect } from "react";
import { Button, Card, Modal } from "react-bootstrap";
import { CardBody } from "../../_metronic/_partials/controls";
import BootstrapSwitchButton from "bootstrap-switch-button-react";
import { useState } from "react";
import TablePagination from "../Components/TablePagination";
import {
  GetShutdownLog,
  systemMaintenance,
  systemMaintenance1,
} from "../services/configService";
import moment from "moment";

const Maintenance = () => {
  const [show, setShow] = useState(false);
  const [getchecked, setChecked] = useState(false);
  const [count, setCount] = useState(1);
  const dateAndTimeFormatter = (_, row) => {
    let obj = row.createdOn;
    return moment(obj).format("LL HH:ss");
  };

  useEffect(() => {
    systemMaintenance1(count)
      .then((res) => res.json())
      .then((res) => {
        let arr = res.result;
        setCount(res.pageDetail.count);
        let newarr = arr[arr.length - 1];
        setChecked(newarr.isAPIDown);
      });
  }, [count]);

  const handleClose = () => {
    setShow(false);
  };
  const handleShow = () => {
    setShow(true);
  };

  const [show2, setShow2] = useState(false);
  const handleClose2 = () => {
    setShow2(false);
  };
  const handleShow2 = () => {
    setShow2(true);
  };

  const handleClick = () => {
    setChecked(true);
    systemMaintenance(true);
    handleClose();
  };

  const handleClick2 = () => {
    setChecked(false);
    systemMaintenance(false);
    handleClose2();
  };

  const columns = [
    {
      dataField: "id",
      text: "ID",
      hidden: true,
    },
    {
      dataField: "status",
      text: "API Status",
    },
    {
      dataField: "createdBy",
      text: "Changed By ",
    },
    {
      dataField: "createdOn",
      text: "Created On",
      formatter: dateAndTimeFormatter,
    },
  ];

  return (
    <Card style = {{marginTop : "-40px"}}>
      <CardHeader title="Maintainence Panel"></CardHeader>
      <CardBody>
        <h5 className="mb-5"> Cautions :-</h5>
        <ul>
          <li> System will go under Maintainence Mode once you activate </li>
          <li>
            {" "}
            Mobile / Front-end Site will stop Working and Show Under-Maintenance
            Status{" "}
          </li>
          <li> Mobile / Front-end Site Funcnality will stop Working </li>
        </ul>

        <br />

        <h5 className="mb-5">Activate / Deactivate </h5>
        <div style={{ width: "60px" }}>
          <BootstrapSwitchButton
            checked={getchecked}
            onChange={getchecked === false ? handleShow : handleShow2}
            onstyle="outline-warning"
            offstyle="outline-primary"
          />
         
        </div>
        <hr></hr>
        <br />
        <h4>Logs of Maintenance</h4>
        <TablePagination
          keyField="Id"
          columns={columns}
          getRecordList={GetShutdownLog}
          isShowExportCsv={false}
        />
      </CardBody>

      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Activate Maintenance</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are Your Sure You Want To Activate Mainetance Mode
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleClick}>
            Understood
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal
        show={show2}
        onHide={handleClose2}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>De-Activate Maintenance</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are Your Sure You Want To Deactivate Mainetance Mode
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleClose2}>
            Close
          </Button>
          <Button variant="primary" onClick={handleClick2}>
            Understood
          </Button>
        </Modal.Footer>
      </Modal>
    </Card>
  );
};

export default Maintenance;
