// AuthProvider.js
import React, { createContext, useContext, useState, useEffect } from "react";
import { authUserDetail } from "../../services/ProfileService";
import {
  showSuccessToast,
  showErrorToast,
  showWarnToast,
} from "../../../Utility/toastMsg";
const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);
export const AuthProvider = ({ children }) => {
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [postData, setPostData] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await authUserDetail();
        if (!response.ok) {
          throw new Error("Failed to fetch user details");
        }
        const data = await response.json();
        setUserDetails(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUserDetails();
  }, []);
  const fetchFeeds = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_JAVA_API_URL}/feeds`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch feeds");
      }
      const data = await response.json();
      setPostData(data);
    } catch (error) {
      showErrorToast("No feed found");
      // console.log(error)
    }
  };
  const handleUpload = async (formData, setMessage, setFormData, setShow) => {
    if (!formData.author) {
      setMessage("Author is required.");
      showWarnToast("Please fill in all required fields.");
      return;
    }
    if (!formData.file && !formData.description) {
      setMessage("Please provide either an image or a description.");
      showWarnToast("Please provide image and description.");
      setShow(true);
      return;
    }
    const form = new FormData();
    form.append("author", formData.author);
    if (formData.file) {
      form.append("file", formData.file);
    }
    if (formData.description) {
      form.append("description", formData.description);
    }
    if (userDetails) {
      form.append("userId", userDetails.result.id);
    }
    try {
      const response = await fetch(
        `${process.env.REACT_APP_JAVA_API_URL}/upload`,
        {
          method: "POST",
          body: form,
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData.error || "Unknown error occurred.";
        setShow(true);
        setMessage(errorMessage);
        showErrorToast(errorMessage);
        return;
      }
      // setShow(false)
      showSuccessToast("Upload feed successful");
      setFormData({
        author: "",
        description: "",
        file: null,
      });
      // // Don't close the modal if only a description is provided
      // if (formData.description && !formData.file) {
      //   setShow(true);
      //   showWarnToast("Please provide image and description.");
      // }else{
      // }
      // Fetch feeds after successful upload
      fetchFeeds();
    } catch (error) {
      const errorMessage = "Error uploading file";
      showWarnToast("Please provide image and description.");
      setMessage(errorMessage);
      // console.error(errorMessage);
      setShow(true);
    }
  };
  const handleDeletePost = async (postId) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_JAVA_API_URL}/feeds/id/${postId}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        throw new Error("Failed to delete post");
      }
      setPostData((prevPosts) =>
        prevPosts.filter((post) => post.id !== postId)
      );
      showSuccessToast("Post deleted successfully");
    } catch (error) {
      showErrorToast("Error deleting post: " + error.message);
    }
  };
  const handleUploadwarrenty = async (
    formData,
    setMessage,
    setFormData,
    setShow
  ) => {
    // Check required fields
    if (
      // !formData.warrantyId||
      !formData.vendor ||
      !formData.productName ||
      !formData.monthlyPrice ||
      !formData.annualPrice ||
      !formData.discount ||
      !formData.terms_conditions ||
      !formData.status
    ) {
      setMessage("Please fill in all required fields.");
      showWarnToast("Please fill in all required fields.");
      return;
    }
    // Create JSON payload
    const payload = {
      // warrantyId: formData.warrantyId,
      status: formData.status,
      vendor: formData.vendor,
      productName: formData.productName,
      monthlyPrice: formData.monthlyPrice,
      annualPrice: formData.annualPrice,
      discount: formData.discount,
      terms_conditions: formData.terms_conditions,
      created_by: formData.created_by,
      updated_by: formData.updated_by,
    };
    try {
      const response = await fetch(
        `${process.env.REACT_APP_JAVA_API_URL}/warranty/upload`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData.error || "Unknown error occurred.";
        setMessage(errorMessage);
        showErrorToast(errorMessage);
        return;
      }
      // showSuccessToast("Upload successful");
      setFormData({
        // warrantyId: "",
        status: "",
        vendor: "",
        productName: "",
        monthlyPrice: "",
        annualPrice: "",
        discount: "",
        terms_conditions: "",
        created_by: "",
        updated_by: "",
      });
      // showSuccessToast("add success")
      setShowAddModal(false);
    } catch (error) {}
  };
  const handleUpdateWarranty = async (formData) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_JAVA_API_URL}/warranty/${formData.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to update warranty.");
      }
      return response.json(); // Optionally return data or handle success
    } catch (error) {
      throw new Error(error.message); // Throw error to be caught by the calling component
    }
  };
  const handleDeleteWarranty = async (warrantyId) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_JAVA_API_URL}/warrenty/${warrantyId}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        throw new Error("Failed to delete warranty");
      }
      setPostData((prevPosts) =>
        prevPosts.filter((post) => post.id !== warrantyId)
      );
      showSuccessToast("Warranty deleted successfully");
    } catch (error) {
      showErrorToast("Error deleting warranty: " + error.message);
    }
  };
  return (
    <AuthContext.Provider
      value={{
        userDetails,
        loading,
        error,
        handleUpload,
        postData,
        fetchFeeds,
        handleDeletePost,
        handleUploadwarrenty,
        handleUpdateWarranty,
        handleDeleteWarranty,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
