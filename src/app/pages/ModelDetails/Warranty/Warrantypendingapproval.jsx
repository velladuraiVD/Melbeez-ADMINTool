import React from "react";
import { AuthProvider } from "../AuthContext";
import WarrantyApprovalProductQueueTable from "./WarrantypendingqueTable";


export default function Warrentypendingapproval() {
  return (
    <>
      <AuthProvider>
        <WarrantyApprovalProductQueueTable
          status={""}
          title={"All Pending Warranty"}
          screen="ALL_DATA"
        />
      </AuthProvider>
    </>
  );
}
