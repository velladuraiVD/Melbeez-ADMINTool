/* eslint-disable jsx-a11y/role-supports-aria-props */
/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router";
import { NavLink } from "react-router-dom";
import SVG from "react-inlinesvg";
import { toAbsoluteUrl, checkIsActive } from "../../../../_helpers";

export function AsideMenuList({ layoutProps }) {
  const location = useLocation();
  const getMenuItemActive = (url, hasSubmenu = false) => {
    return checkIsActive(location, url)
      ? ` ${!hasSubmenu &&
          "menu-item-active"} menu-item-open menu-item-not-hightlighted`
      : "";
  };

  const [rolebaseData, setRolebaseData] = useState("");
  let isSuperAdmin = localStorage.getItem("Role") === "SuperAdmin";
  useEffect(() => {
    setTimeout(() => {
      let authToken = localStorage.getItem("authToken");
      const reqoption = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "melbeez-platform": "AdminPortal",
          Authorization: "Bearer " + authToken,
        },
      };
      fetch(`${process.env.REACT_APP_API_URL}/api/user`, reqoption)
        .then((res) => {
          return res.json();
        })
        .then((result) => {
          if (localStorage.getItem("Role") === "SuperAdmin") {
            setRolebaseData(
              <>
                <NavLink className="menu-link" to="/adminuser">
                  <i className="menu-bullet menu-bullet-dot">
                    <span />
                  </i>
                  <span className="menu-text">Admin Users</span>
                </NavLink>
              </>
            );
          }
        });
    }, 500);
  }, []);

  return (
    <>
      <ul className={`menu-nav ${layoutProps.ulClasses}`}>
        <li
          className={`menu-item ${getMenuItemActive("/dashboard", false)}`}
          aria-haspopup="true"
        >
          <NavLink className="menu-link" to="/dashboard">
            <span className="svg-icon menu-icon">
              <SVG src={toAbsoluteUrl("/media/svg/icons/Home/Home.svg")} />
            </span>
            <span className="menu-text">Dashboard</span>
          </NavLink>
        </li>
        {/* <li
          className={`menu-item ${getMenuItemActive("/model-details", false)}`}
          aria-haspopup="true"
        >
          <NavLink className="menu-link" to="/model-details">
            <span className="svg-icon menu-icon">
              <SVG src={toAbsoluteUrl("/media/svg/icons/Code/Compiling.svg")} />
            </span>
            <span className="menu-text">Model No</span>
          </NavLink>
        </li> */}

        <li
          className={`menu-item menu-item-submenu ${getMenuItemActive(
            "/UserManange",
            true
          )}`}
          aria-haspopup="true"
          data-menu-toggle="hover"
        >
          <NavLink className="menu-link menu-toggle" to="/UserManange">
            <span className="svg-icon menu-icon">
              <SVG src={toAbsoluteUrl("/media/svg/icons/General/Expand-arrows.svg")} />
            </span>
            <span className="menu-text">Product Model Info</span>
            <i className="menu-arrow" />
          </NavLink>
          <div className="menu-submenu">
            <i className="menu-arrow" />
            <ul className="menu-subnav">
              <li
                className={`menu-item ${getMenuItemActive("/model-details")}`}
                aria-haspopup="true"
              >
                <NavLink className="menu-link" to="/model-details">
                  <i className="menu-bullet menu-bullet-dot">
                    <span />
                  </i>
                  <span className="menu-text">All Products</span>
                </NavLink>
              </li>
            </ul>
          </div>

          <div className="menu-submenu">
            <i className="menu-arrow" />
            <ul className="menu-subnav">
              <li
                className={`menu-item ${getMenuItemActive("/product-queue")}`}
                aria-haspopup="true"
              >
               <NavLink className="menu-link" to="/product-queue">
                  <i className="menu-bullet menu-bullet-dot">
                    <span />
                  </i>
                  <span className="menu-text">New Product Queue</span>
                </NavLink>
              </li>
            </ul>
          </div>
          {isSuperAdmin && 
          <>
          <div className="menu-submenu">
            <i className="menu-arrow" />
            <ul className="menu-subnav">
              <li
                className={`menu-item ${getMenuItemActive("/approval-pending-table")}`}
                aria-haspopup="true"
              >
               <NavLink className="menu-link" to="/approval-pending-table">
                  <i className="menu-bullet menu-bullet-dot">
                    <span />
                  </i>
                  <span className="menu-text">Pending Approval</span>
                </NavLink>
              </li>
            </ul>
          </div>
          </>
          }
        </li>


        <li
          className={`menu-item menu-item-submenu ${getMenuItemActive(
            "/UserManange",
            true
          )}`}
          aria-haspopup="true"
          data-menu-toggle="hover"
        >
          <NavLink className="menu-link menu-toggle" to="/UserManange">
            <span className="svg-icon menu-icon">
              <SVG src={toAbsoluteUrl("/media/svg/icons/General/warrenty3.svg")} />
            </span>
            <span className="menu-text">Warrenty Product info</span>
            <i className="menu-arrow" />
          </NavLink>
          

          
          {isSuperAdmin && 
          <>
          



          <div className="menu-submenu">
            <i className="menu-arrow" />
            <ul className="menu-subnav">
              <li
                className={`menu-item ${getMenuItemActive("/warrenty")}`}
                aria-haspopup="true"
              >
               <NavLink className="menu-link" to="/warrenty">
                  <i className="menu-bullet menu-bullet-dot">
                    <span />
                  </i>
                  <span className="menu-text">All Warranties</span>
                </NavLink>
              </li>
            </ul>
          </div>
          </>
          }
        </li>

        
        <li
          className={`menu-item menu-item-submenu ${getMenuItemActive(
            "/UserManange",
            true
          )}`}
          aria-haspopup="true"
          data-menu-toggle="hover"
        >
          <NavLink className="menu-link menu-toggle" to="/UserManange">
            <span className="svg-icon menu-icon">
              <SVG src={toAbsoluteUrl("/media/svg/icons/General/User.svg")} />
            </span>
            <span className="menu-text">User Management</span>
            <i className="menu-arrow" />
          </NavLink>
          <div className="menu-submenu">
            <i className="menu-arrow" />
            <ul className="menu-subnav">
              <li
                className={`menu-item ${getMenuItemActive("userlist")}`}
                aria-haspopup="true"
              >
                <NavLink className="menu-link" to="/userlist">
                  <i className="menu-bullet menu-bullet-dot">
                    <span />
                  </i>
                  <span className="menu-text">Users</span>
                </NavLink>
              </li>
            </ul>
          </div>

          <div className="menu-submenu">
            <i className="menu-arrow" />
            <ul className="menu-subnav">
              <li
                className={`menu-item ${getMenuItemActive("/adminuser")}`}
                aria-haspopup="true"
              >
                {rolebaseData}
              </li>
            </ul>
          </div>
        </li>

        <li
          className={`menu-item menu-item-submenu ${getMenuItemActive(
            "/configuration",
            true
          )}`}
          aria-haspopup="true"
          data-menu-toggle="hover"
        >
          <NavLink className="menu-link menu-toggle" to="/configuration">
            <span className="svg-icon menu-icon">
              <SVG
                src={toAbsoluteUrl("/media/svg/icons/Layout/Layout-grid.svg")}
              />
            </span>
            <span className="menu-text">Configurations</span>
            <i className="menu-arrow" />
          </NavLink>
          <div className="menu-submenu">
            <i className="menu-arrow" />
            <ul className="menu-subnav">
              <li
                className={`menu-item ${getMenuItemActive("/category")}`}
                aria-haspopup="true"
              >
                <NavLink className="menu-link" to="/category">
                  <i className="menu-bullet menu-bullet-dot">
                    <span />
                  </i>
                  <span className="menu-text">Manage Categories</span>
                </NavLink>
              </li>
            </ul>
          </div>
          <div className="menu-submenu">
            <i className="menu-arrow" />
            <ul className="menu-subnav">
              <li
                className={`menu-item ${getMenuItemActive("/ContactUs")}`}
                aria-haspopup="true"
              >
                <NavLink className="menu-link" to="/ContactUs">
                  <i className="menu-bullet menu-bullet-dot">
                    <span />
                  </i>
                  <span className="menu-text">Contact Us Logs</span>
                </NavLink>
              </li>
            </ul>
          </div>
          <div className="menu-submenu">
            <i className="menu-arrow" />
            <ul className="menu-subnav">
              <li
                className={`menu-item ${getMenuItemActive("/PhoneLogs")}`}
                aria-haspopup="true"
              >
                <NavLink className="menu-link" to="/PhoneLogs">
                  <i className="menu-bullet menu-bullet-dot">
                    <span />
                  </i>
                  <span className="menu-text">Phone Logs</span>
                </NavLink>
              </li>
            </ul>
          </div>
          <div className="menu-submenu">
            <i className="menu-arrow" />
            <ul className="menu-subnav">
              <li
                className={`menu-item ${getMenuItemActive("/EmailLogs")}`}
                aria-haspopup="true"
              >
                <NavLink className="menu-link" to="/EmailLogs">
                  <i className="menu-bullet menu-bullet-dot">
                    <span />
                  </i>
                  <span className="menu-text">Email Logs</span>
                </NavLink>
              </li>
            </ul>
          </div>
          <div className="menu-submenu">
            <i className="menu-arrow" />
            <ul className="menu-subnav">
              <li
                className={`menu-item ${getMenuItemActive("/ErrorLogs")}`}
                aria-haspopup="true"
              >
                <NavLink className="menu-link" to="/ErrorLogs">
                  <i className="menu-bullet menu-bullet-dot">
                    <span />
                  </i>
                  <span className="menu-text">Errors Logs</span>
                </NavLink>
              </li>
            </ul>
          </div>
          <div className="menu-submenu">
            <i className="menu-arrow" />
            <ul className="menu-subnav">
              <li
                className={`menu-item ${getMenuItemActive("/activitylog")}`}
                aria-haspopup="true"
              >
                <NavLink className="menu-link" to="/activitylog">
                  <i className="menu-bullet menu-bullet-dot">
                    <span />
                  </i>
                  <span className="menu-text">API Activity Logs</span>
                </NavLink>
              </li>
            </ul>
          </div>
          <div className="menu-submenu">
            <i className="menu-arrow" />
            <ul className="menu-subnav">
              <li
                className={`menu-item ${getMenuItemActive("/AdminActivity")}`}
                aria-haspopup="true"
              >
                <NavLink className="menu-link" to="/AdminActivity">
                  <i className="menu-bullet menu-bullet-dot">
                    <span />
                  </i>
                  <span className="menu-text">Admin Activity Logs</span>
                </NavLink>
              </li>
            </ul>
          </div>
        </li>

        <li
          className={`menu-item menu-item-submenu ${getMenuItemActive(
            "/document",
            true
          )}`}
          aria-haspopup="true"
          data-menu-toggle="hover"
        >
          <NavLink className="menu-link menu-toggle" to="/document">
            <span className="svg-icon menu-icon">
              <SVG
                src={toAbsoluteUrl("/media/svg/icons/Code/Info-circle.svg")}
              />
            </span>
            <span className="menu-text">Documents</span>
            <i className="menu-arrow" />
          </NavLink>
          <div className="menu-submenu">
            <i className="menu-arrow" />
            <ul className="menu-subnav">
              <li
                className={`menu-item ${getMenuItemActive("/privacy")}`}
                aria-haspopup="true"
              >
                <NavLink className="menu-link" to="/privacy">
                  <i className="menu-bullet menu-bullet-dot">
                    <span />
                  </i>
                  <span className="menu-text">Privacy Policy</span>
                </NavLink>
              </li>
              <li
                className={`menu-item ${getMenuItemActive("/term_condition")}`}
                aria-haspopup="true"
              >
                <NavLink className="menu-link" to="/term_condition">
                  <i className="menu-bullet menu-bullet-dot">
                    <span />
                  </i>
                  <span className="menu-text">Terms and Condition</span>
                </NavLink>
              </li>
              <li
                className={`menu-item ${getMenuItemActive("/cookies")}`}
                aria-haspopup="true"
              >
                <NavLink className="menu-link" to="/cookies">
                  <i className="menu-bullet menu-bullet-dot">
                    <span />
                  </i>
                  <span className="menu-text">Cookie Policy</span>
                </NavLink>
              </li>
              <li
                className={`menu-item ${getMenuItemActive("/eula")}`}
                aria-haspopup="true"
              >
                <NavLink className="menu-link" to="/eula">
                  <i className="menu-bullet menu-bullet-dot">
                    <span />
                  </i>
                  <span className="menu-text">Eula</span>
                </NavLink>
              </li>
            </ul>
          </div>
        </li>
        <li
          className={`menu-item ${getMenuItemActive("/maintenance")}`}
          aria-haspopup="true"
        >
          <NavLink className="menu-link menu-toggle" to="/maintenance">
            <span className="svg-icon menu-icon">
              <SVG
                src={toAbsoluteUrl("/media/svg/icons/General/Thunder-move.svg")}
              />
            </span>
            <span className="menu-text">System Maintenance</span>
          </NavLink>
        </li>
        

        <li
          className={`menu-item ${getMenuItemActive("/feed")}`}
          aria-haspopup="true"
        >
          <NavLink className="menu-link menu-toggle" to="/feed">
            <span className="svg-icon menu-icon">
              <SVG
                src={toAbsoluteUrl("/media/svg/icons/General/Feed.svg")}
              />
            </span>
            <span className="menu-text">Admin feed</span>
          </NavLink>
        </li>
      </ul>
    </>
  );
}
