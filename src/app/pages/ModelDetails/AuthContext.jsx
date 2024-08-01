// AuthProvider.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { authUserDetail } from '../../services/ProfileService';
import { showSuccessToast, showErrorToast, showWarnToast } from '../../../Utility/toastMsg'; 

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [postData, setPostData] = useState([]);

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

  const fetchShareLink = async (postId) => {
    try {
      if (!postId) {
        console.error("Invalid post ID");
        return;
      }

      const response = await fetch(
        `http://192.168.1.13:5000/api/feedposts/${postId}/share`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch shareable link");
      }
      const data = await response.json();
      setShareLink(data.link);
    } catch (error) {
      console.error("Failed to generate shareable link", error);
    }
  };

  useEffect(() => {
    // Call fetchShareLink function here or whenever you need to fetch the share link
    fetchShareLink();
  }, [postData]); // Add dependencies as needed

  const fetchFeeds = async () => {
    try {
      const response = await fetch("http://192.168.1.9:8083/feeds");
      if (!response.ok) {
        throw new Error("Failed to fetch feeds");
      }
      const data = await response.json();
      setPostData(data);
    } catch (error) {
      showErrorToast("Error fetching data: " + error.message);
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
      showWarnToast("Please provide either an image or a description.");
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
      const response = await fetch('http://192.168.1.9:8083/upload', {
        method: 'POST',
        body: form,
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData.error || "Unknown error occurred.";
        setMessage(errorMessage);
        showErrorToast(errorMessage);
        return;
      }

      showSuccessToast("Upload successful");
      setFormData({
        author: "",
        description: "",
        file: null,
      });
      // Don't close the modal if only a description is provided
      if (formData.description && !formData.file) {
        setShow(false);
      }
    } catch (error) {
      const errorMessage = "Error uploading file: " + error.message;
      showErrorToast(errorMessage);
      setMessage(errorMessage);
      console.error(errorMessage);
      setShow(true);
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      const response = await fetch(`http://192.168.1.9:8083/feeds/id/${postId}`, {
        method: "DELETE",
      });

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

 




  const handleLikePost = async (postId) => {
    try {
      const response = await fetch(
        `http://192.168.1.9:8083/feeds/${postId}/like`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId: userDetails?.result.id }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        showWarnToast(errorData.message || "Failed to like post");
        return;
      }

      const data = await response.json();

      setPostData((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId ? { ...post, likes: data.likes } : post
        )
      );
      setLikedPosts([...likedPosts, postId]);
      showSuccessToast("Post liked successfully");
    } catch (error) {
      showErrorToast("Error liking post: " + error.message);
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
      !formData.vendor ||
      !formData.productName ||
      !formData.monthlyPrice ||
      !formData.annualPrice
    ) {
      setMessage("Please fill in all required fields.");
      showWarnToast("Please fill in all required fields.");
      return;
    }

    // Construct FormData
    const form = new FormData();
    form.append("vendor", formData.vendor);
    form.append("productName", formData.productName);
    form.append("monthlyPrice", formData.monthlyPrice);
    form.append("annualPrice", formData.annualPrice);
    form.append("discount", formData.discount);
    // form.append("picture", formData.file);
    form.append("terms_conditions", formData.terms_conditions);
    form.append("created_by", formData.created_by);
    form.append("updated_by", formData.updated_by);

    try {
      const response = await fetch("http://192.168.1.10:8080/warrentyUpload", {
        method: "POST",
        body: form,
      });

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData.error || "Unknown error occurred.";
        setMessage(errorMessage);
        showErrorToast(errorMessage);
        return;
      }

      showSuccessToast("Upload successful");
      setFormData({
        vendor: "",
        productName: "",
        monthlyPrice: "",
        annualPrice: "",
        discount: "",
        // file: null,
        terms_conditions: "",
        created_by: "",
        updated_by: "",
      });
      setShow(false);
    } catch (error) {
      const errorMessage = "Error uploading file: " + error.message;
      showErrorToast(errorMessage);
      setMessage(errorMessage);
      console.error(errorMessage);
      setShow(true);
    }
  };

  const handleUpdateWarranty = async (
    formData,
    setMessage,
    setFormData,
    setShow
  ) => {
    // Check required fields
    if (
      !formData.vendor ||
      !formData.productName ||
      !formData.monthlyPrice ||
      !formData.annualPrice
    ) {
      setMessage("Please fill in all required fields.");
      showWarnToast("Please fill in all required fields.");
      return;
    }

    // Construct FormData
    const form = new FormData();
    form.append("vendor", formData.vendor);
    form.append("productName", formData.productName);
    form.append("monthlyPrice", formData.monthlyPrice);
    form.append("annualPrice", formData.annualPrice);
    form.append("discount", formData.discount);
    // form.append("picture", formData.file);
    form.append("terms_conditions", formData.terms_conditions);
    form.append("created_by", formData.created_by);
    form.append("updated_by", formData.updated_by);

    try {
      const response = await fetch(
        `http://192.168.1.10:8080/warrentyUpdate/${formData.id}`,
        {
          method: "PUT",
          body: form,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData.error || "Unknown error occurred.";
        setMessage(errorMessage);
        showErrorToast(errorMessage);
        return;
      }

      showSuccessToast("Update successful");
      setFormData({
        vendor: "",
        productName: "",
        monthlyPrice: "",
        annualPrice: "",
        discount: "",
        // file: null,
        terms_conditions: "",
        created_by: "",
        updated_by: "",
      });
      setShow(false);
    } catch (error) {
      const errorMessage = "Error updating warranty: " + error.message;
      showErrorToast(errorMessage);
      setMessage(errorMessage);
      console.error(errorMessage);
      setShow(true);
    }
  };

  const handleDeleteWarranty = async (warrantyId) => {
    try {
      const response = await fetch(
        `http://192.168.1.10:8080/warrentyDelete/${warrantyId}`,
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
    <AuthContext.Provider value={{ userDetails, loading, error, handleUpload, postData, fetchFeeds, handleDeletePost }}>
      {children}
    </AuthContext.Provider>
  );
};
