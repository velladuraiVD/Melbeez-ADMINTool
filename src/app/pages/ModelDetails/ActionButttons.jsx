import React from "react";
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "../../../_metronic/_helpers";

const ActionButtons = ({
  row,
  onEdit,
  onDelete,
  onView,
  handleApproval,
  handleReject,
}) => (
  <>
    <a
      href="#"
      title="Approve"
      className="btn btn-icon btn-light btn-hover-primary btn-sm mx-3"
      onClick={(e) => {
        e.preventDefault();
        handleApproval(row);
      }}
    >
      <span
        className="svg-icon svg-icon-md svg-icon-primary"
        // onClick={(e) => {
        //   e.preventDefault();
        //   onapproval(row);
        // }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="green"
          className="bi bi-check-lg"
          viewBox="0 0 16 16"
        >
          <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425a.247.247 0 0 1 .02-.022Z" />
        </svg>
      </span>
    </a>
    <a
      href="#"
      title="Reject"
      className="btn btn-icon btn-light btn-hover-danger btn-sm mr-2"
      onClick={(e) => {
        e.preventDefault();
        handleReject(row);
      }}
    >
      <span className="svg-icon svg-icon-md svg-icon-danger">
        <SVG src={toAbsoluteUrl("/media/svg/icons/Code/Error-circle.svg")} />
      </span>
    </a>

    <a
      href="#"
      title="View"
      className="btn btn-icon btn-light btn-hover-warning btn-sm mr-2"
      onClick={(e) => {
        e.preventDefault();
        onView(row);
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

export default ActionButtons;
