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
  // const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [postData, setPostData] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [postcomments, setPostcomments] = useState([]);
  const [likedetails, setLikeDetails] = useState([]);
  
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await authUserDetail();
        if (!response.ok) {
          throw new Error("Failed to fetch user details");
        }
        const data = await response.json();
        // console.log(data)
        localStorage.setItem("userName", data.result.username)
        localStorage.setItem("userId", data.result.id)
        localStorage.setItem("firstName", data.result.firstName)
        localStorage.setItem("lastName", data.result.lastName)
    
        setUserDetails(data);
      } catch (error) {
        setError(error.message);
      } //finally {
      //   setLoading(false);
      // }
    };
    fetchUserDetails();
  }, []);
  const fetchFeeds = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_JAVA_API_URL}/all/feeds`, {mode: 'cors'}
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
  const fetchSingleFeed = async (feedId) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_JAVA_API_URL}/${feedId}/feed`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch feed");
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
  //Warranty API
  const handleUploadwarrenty = async (
    formData,
    setMessage,
    setFormData,
    setShow
  ) => {
    // Check required fields
    if (
      !formData.vendor ||
      !formData.name ||
      !formData.monthlyPrice ||
      !formData.annualPrice ||
      !formData.planDescription ||
      !formData.other_Details ||
      !formData.product_price_ids ||
      !formData.planName
    ) {
      setMessage("Please fill in all required fields.");
      showWarnToast("Please fill in all required fields.");
      return;
    }

    // Ensure userDetails is available and contains necessary information
    // if (!userDetails || !userDetails.result || !userDetails.result.id) {
    //   showErrorToast("User details not found.");
    //   return;
    // }
    const firstName = localStorage.getItem("firstName")
    // console.log("firstName:", firstName);
    const lastName = localStorage.getItem("lastName")
    // console.log("lastName:", lastName);
    if (!firstName && !lastName) {
      showErrorToast("User details not found.");
      return;
    }
    // Create FormData payload
    const form = new FormData();
    form.append("vendor", formData.vendor);
    form.append("name", formData.name);
    form.append("monthlyPrice", formData.monthlyPrice);
    form.append("annualPrice", formData.annualPrice);
    form.append("discount", formData.discount || "0"); // Optional field
    form.append("created_by", firstName + " " + lastName); // Use userId from userDetails
    form.append("updated_by", ""); // Use userId from userDetails
    form.append("planDescription", formData.planDescription);
    form.append("planName", formData.planName);
    form.append("product_price_ids", formData.product_price_ids);
    form.append("other_Details", formData.other_Details);

    // Append file if it exists
    if (formData.file) {
      form.append("file", formData.file);
    }

    try {
      const response = await fetch(
        `${process.env.REACT_APP_JAVA_API_URL}/warranty/upload`,
        {
          method: "POST",
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

      setFormData({
        vendor: "",
        name: "",
        monthlyPrice: "",
        annualPrice: "",
        discount: "",
        created_by: "",
        updated_by: "",
        planDescription: "",
        planName: "",
        other_Details: "",
        product_price_ids: "",
        file: null,
      });
      setShowAddModal(false);
      showSuccessToast("Upload successful");
    } catch (error) {
      // setMessage("Error uploading warranty");
      // showErrorToast("Error uploading warranty: " + error.message);
      // setShow(true);
    }
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

  //Comment API
  const fetchComments = async (feedId) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_JAVA_API_URL}/${feedId}/comments`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch comments");
      }
      const data = await response.json();
      // console.log(feedId)
      setPostcomments(data);
      // console.log(data)
      

    } catch (error) {
      showErrorToast("No comment found");
      // console.log(error)
    }
  };


  const createComment = async (postId, commentText) => {
    try {
      const userId = localStorage.getItem("userId")
      // console.log("User ID:", userId);
      // Construct the request
      const response = await fetch(
        `${process.env.REACT_APP_JAVA_API_URL}/${postId}/${userId}/Melbeez/comment`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            text: commentText, // Add the comment text in the request body
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to upload comment");
      }

      const data = await response.json();
      // console.log("Comment uploaded successfully:", data);
      showSuccessToast("Comment added successfully");
    } catch (error) {
      // console.error("Error uploading comment:", error);
      showErrorToast("Failed to add comment");
    }
  };
  const handleDeleteComment = async (feedId, commentId) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_JAVA_API_URL}/${feedId}/${commentId}/comment`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        throw new Error("Failed to delete comment");
      }
      // setPostcomments((prevPosts) =>
      //   prevPosts.filter((post) => post.id !== warrantyId)
      // );
      await fetchComments(feedId);
      // await fetchSingleFeed(feedId)
      showSuccessToast("comment deleted successfully");
      // console.log(feedId,commentId)
      // console.log("comment deleted succesfully")
    } catch (error) {
      showErrorToast("Error deleting comment: " + error.message);
    }
  };

  //Like API
  const createLikes = async (feedId) => {
    try {
      const userId = localStorage.getItem("userId")
      // console.log("User ID:", userId);
      // Construct the request
      const response = await fetch(
        `${process.env.REACT_APP_JAVA_API_URL}/api/${feedId}/${userId}/Melbeez/like`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },

        }
      );
  
      if (!response.ok) {
        throw new Error("Failed to add Like");
      }

    } catch (error) {
      // console.error("Error uploading Like:", error);
      showErrorToast("Failed to add Like");
    }
  };
  const fetchLikesdetails = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_JAVA_API_URL}/api/all/likes`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch feeds");
      }
      const data = await response.json();
      setLikeDetails(data);
      // console.log(data)
      
    } catch (error) {
      showErrorToast("No feed found");
      // console.log(error)
    }
  };
 


  return (
    <AuthContext.Provider
      value={{
        userDetails,
        // loading,
        setPostcomments,
        postcomments,
        error,
        handleUpload,
        createComment,
        postData,
        setPostData,
        fetchFeeds,
        handleDeletePost,
        handleUploadwarrenty,
        handleUpdateWarranty,
        handleDeleteWarranty,
        fetchComments,
        createLikes,
        handleDeleteComment,
        fetchLikesdetails,
        likedetails,
        setLikeDetails,
        fetchSingleFeed
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};