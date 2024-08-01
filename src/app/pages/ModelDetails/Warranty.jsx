import React from "react";
import { AuthProvider } from "./AuthContext";
import WarrantyProductQueueTable from "./warrantyqueTable";

export default function Warrenty() {
  return (
    <>
      <AuthProvider>
        <WarrantyProductQueueTable
          status={""}
          title={"All Warranty"}
          screen="ALL_DATA"
        />
      </AuthProvider>
    </>
  );
}
