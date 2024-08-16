/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import SVG from 'react-inlinesvg';
import { toAbsoluteUrl } from '../../../_metronic/_helpers';

const renderActions = (setShow, setRowData, setDeleteShow) => (_, row) => {
    return (
        <>
            <a
                href="#"
                title="Edit"
                className="btn btn-icon btn-light btn-hover-primary btn-sm mx-1"
                onClick={(e) => {
                    e.preventDefault();
                    setShow(true);
                    setRowData(row);
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
                    setRowData(row);
                    setDeleteShow(true);
                }}
            >
                <span className="svg-icon svg-icon-md svg-icon-danger">
                    <SVG src={toAbsoluteUrl("/media/svg/icons/General/Trash.svg")} />
                </span>
            </a>
        </>
    );
};

export default renderActions;
