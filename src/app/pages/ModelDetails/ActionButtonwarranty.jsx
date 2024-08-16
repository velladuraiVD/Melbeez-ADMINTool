import React from "react";
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "../../../_metronic/_helpers";

const ActionButtonwarranty = ({
  row,
  onEdit,
  onDelete,
  onView,
  handlePending,
}) => {
  return (
    <>
      {row.status !== "Pending" && (
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
            <SVG
              src={toAbsoluteUrl("/media/svg/icons/Communication/Write.svg")}
            />
          </span>
        </a>
      )}
      {/* {row.status !== "inactive" && ( */}
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
      {/* )} */}
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
      {row.status === "inactive" && (
        <a
          href="#"
          title="Submit"
          className="btn btn-icon btn-light btn-hover-primary btn-sm mx-1"
          onClick={(e) => {
            e.preventDefault();
            handlePending(row); // Call the handlePending function passed as prop
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
      )}
    </>
  );
};

export default ActionButtonwarranty;
