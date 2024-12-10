import React from "react";
import ProductFeed from "./ProductFeed";
import { AuthProvider } from "../AuthContext";

export default function Feed() {
    return (
        <AuthProvider>
            <ProductFeed status={""} title={"Admin Feed"} screen="ALL_DATA" />
        </AuthProvider>
    )

}
