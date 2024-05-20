import React, { Suspense, lazy, useState, useEffect } from "react";
import { Redirect, Switch, Route, Link } from "react-router-dom";
import { LayoutSplashScreen, ContentRoute } from "../_metronic/layout";
import { MyPage } from "./pages/MyPage";
import { Privacy } from "./modules/Document/Privacy/Privacy";
import { Term_condition } from "./modules/Document/Terms&Condition/Term_Condition";
import UserList from "../app/modules/UserManagement/UserList";
import Category from "./pages/config/Category/Category";
import AdminUser from "./modules/AdminUser/adminUser";
import DashBoard from "./modules/Dashboard/Dashboard";
import EmailLogs from "./pages/config/Logs/EmailLogs";
import PhoneLogs from "./pages/config/Logs/PhoneLogs";
import AdminLogs from "./pages/config/Logs/AdminActivityLogs";
import ErrorLogs from "./pages/config/Logs/ErrorLogs";
import ContactUs from "./pages/config/Logs/Contact";
import { PrivacyforAdmin } from "./modules/Document/Privacy/PrivacyforAdmin";
import { Term_conditionforAdmin } from "./modules/Document/Terms&Condition/Term_ConditionforAdmin";
import { Modal } from "react-bootstrap";
import ActivityLogs from "./pages/config/Logs/ActivityLogs";
import Maintenance from "./pages/Maintenance";
import { CookiesPage } from "./modules/Document/Cookies/Cookies";
import { EulaPage } from "./modules/Document/Eula/Eula";
import { EulaForAdmin } from "./modules/Document/Eula/EulaForAdmin";
import { CookiePolicyForAdmin } from "./modules/Document/Cookies/CookiesForAdmin";
import AllData from "./pages/ModelDetails/AllData";
import ApprovalPendingTable from "./pages/ModelDetails/ApprovalPendingTable";
import ProductQueueTable from "./pages/ModelDetails/ProductQueueTable";
import BulkUpload from "./pages/ModelDetails/BulkUpload";
import Feed from "./pages/ModelDetails/Feed";
import Warrenty from "./pages/ModelDetails/Warrenty";


const UserProfilepage = lazy(() =>
  import("./modules/UserProfile/UserProfilePage")
);

export default function BasePage() {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [RoleRoute, setRoleRoute] = useState("");

  const handleAPIRefresh = () => {
    setInterval(() => {
      var obj = {
        token: localStorage.getItem("authToken"),
        refreshToken: localStorage.getItem("refToken"),
      };

      const reqoption = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "melbeez-platform": "AdminPortal",
        },
        body: JSON.stringify(obj),
      };
      fetch(
        `${process.env.REACT_APP_API_URL}/api/user/refresh-token`,
        reqoption
      )
        .then((res) => {
          return res.json();
        })
        .then(() => {
          localStorage.clear();
          handleShow();
        })
        .catch((error) => {
          console.log(error);
        });
    }, 7000000);
  };
  useEffect(() => {
    handleAPIRefresh();
  }, []);

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
            setRoleRoute(
              <>
                <Route path="/term_condition" component={Term_condition} />
                <Route path="/privacy" component={Privacy} />
                <Route path="/cookies" component={CookiesPage} />
                <Route path="/eula" component={EulaPage} />
                <Route path="/adminuser" component={AdminUser} />
              </>
            );
          } else {
            setRoleRoute(
              <>
                <Route path="/privacy" component={PrivacyforAdmin} />
                <Route
                  path="/term_condition"
                  component={Term_conditionforAdmin}
                />
                <Route path="/eula" component={EulaForAdmin} />
                <Route path="/cookies" component={CookiePolicyForAdmin} />
              </>
            );
          }
        })
        .catch((error) => {
          console.log({ error });
        });
    }, 1000);
  }, []);

  return (
    <>
      <Suspense fallback={<LayoutSplashScreen />}>
        <Switch>
          {<Redirect exact from="/" to="/dashboard" />}
          <Route path="/dashboard" component={DashBoard} />
          <ContentRoute path="/my-page" component={MyPage} />
          <Route path="/user-profile" component={UserProfilepage} />
          {/* <Route path="/sitemap" component={SiteMap} /> */}
          <Route path="/userlist" component={UserList} />
          {/* <Route path="/location" component={Location} /> */}
          <Route path="/category" component={Category} />
          <Route path="/EmailLogs" component={EmailLogs} />
          <Route path="/PhoneLogs" component={PhoneLogs} />
          <Route path="/AdminActivity" component={AdminLogs} />
          <Route path="/ErrorLogs" component={ErrorLogs} />
          <Route path="/maintenance" component={Maintenance} />
          <Route path="/ContactUs" component={ContactUs} />
          <Route path="/activitylog" component={ActivityLogs} />
          <Route path="/model-details" component={AllData} />
          <Route path="/feed" component={Feed} />
          <Route path="/warrenty" component={Warrenty} /> 
          <Route path="/product-queue" component={ProductQueueTable} /> 
          <Route path="/approval-pending-table" component={ApprovalPendingTable} /> 
          <Route path="/bulk-upload" component={BulkUpload} /> 
        </Switch>
      </Suspense>
      <Switch>{RoleRoute}</Switch>

      <Modal show={show}>
        <Modal.Body> Your Session Has Ended Please Login Again </Modal.Body>
        <Modal.Footer>
          <Link
            to="/logout"
            className="btn btn-light-primary font-weight-bold"
            style={{
              backgroundColor: "#facd21",
              color: "black",
            }}
          >
            Close
          </Link>
        </Modal.Footer>
      </Modal>
    </>
  );
}
