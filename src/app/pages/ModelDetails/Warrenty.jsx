import React from "react";
import WarrentyProductQueueTable from "./Warrentyque";
import { AuthProvider } from "./AuthContext";
export default function Warrenty() {
    return (
        <>
        <AuthProvider>
            <WarrentyProductQueueTable
                status={""}
                title={"All Product"}
                screen="ALL_DATA"
            />
            </AuthProvider>
        </>
    );
}
