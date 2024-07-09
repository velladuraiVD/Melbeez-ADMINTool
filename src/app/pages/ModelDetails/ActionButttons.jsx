import React from "react";
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "../../../_metronic/_helpers";

const ActionButtons = ({ row, onEdit, onDelete }) => (
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
  </>
);

export default ActionButtons;
