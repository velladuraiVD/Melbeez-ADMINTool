import React from "react";
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "../../../_metronic/_helpers";

const ActionButtons = ({ row, onEdit, onDelete, onView }) => (
  <>
    <a
      href="#"
      title="Edit"
      className="btn btn-icon btn-light btn-hover-primary btn-sm mx-1"
      onClick={(e) => {
        e.preventDefault();
        onEdit(row);
      }}
    >
      <span className="svg-icon svg-icon-md svg-icon-primary">
        <SVG src={toAbsoluteUrl("/media/svg/icons/Communication/Write.svg")} />
      </span>
    </a>
    <a
      href="#"
      title="Delete"
      className="btn btn-icon btn-light btn-hover-danger btn-sm mr-2"
      onClick={(e) => {
        e.preventDefault();
        onDelete(row);
      }}
    >
      <span className="svg-icon svg-icon-md svg-icon-danger">
        <SVG src={toAbsoluteUrl("/media/svg/icons/General/Trash.svg")} />
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
