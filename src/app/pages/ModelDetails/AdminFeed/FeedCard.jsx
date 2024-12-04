import React, { useEffect, useState } from "react";
import Card from "react-bootstrap/Card";
import { toAbsoluteUrl } from "../../../../_metronic/_helpers";
import SVG from "react-inlinesvg";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
// import {
//   FaWhatsapp,
//   FaEnvelope,
//   FaTelegram,
//   FaInstagram,
//   FaFacebook,
// } from "react-icons/fa";
import { useAuth } from "../AuthContext";
import "./FeedCard.css";
import { showErrorToast } from "../../../../Utility/toastMsg";
import DeleteConfirmationModal from "./DeleteModel";

const CardHeader = ({ author, postAge }) => (
  <div className="card-header-custom">
    <div className="header-left">
      <img
        src={toAbsoluteUrl("/media/logos/logo-light.png")}
        alt="Avatar"
        className="avatar bg-dark"
      />
      <h6>{author}</h6>
    </div>
    <div>
      <small>{postAge}</small>
    </div>
  </div>
);

function FeedCard() {
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [commentText, setCommentText] = useState("");
  // const [likedPosts, setLikedPosts] = useState([]);
  // const [showShareModal, setShowShareModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteType, setDeleteType] = useState(null); // 'post' or 'comment'
  const [itemToDelete, setItemToDelete] = useState(null);

  const {
    postData,
    fetchFeeds,
    handleDeletePost,
    fetchComments,
    setPostcomments,
    userDetails,
    fetchSingleFeed ,
    postcomments ,
    createComment,
    createLikes,
    handleDeleteComment,
    fetchLikesdetails ,
    likedetails
  } = useAuth();

  // Fetch feeds on component mount
  useEffect(() => {
    fetchFeeds();
    fetchLikesdetails();

  }, []);


  const calculatePostAge = (createdAt) => {
    const postDate = new Date(createdAt);
    const currentDate = new Date();
    const timeDifference = currentDate - postDate;
    const minutesDifference = Math.floor(timeDifference / (1000 * 60));
    const hoursDifference = Math.floor(timeDifference / (1000 * 60 * 60));
    const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

    if (minutesDifference < 1) {
      return "just now";
    } else if (daysDifference > 0) {
      return `${daysDifference} day${daysDifference > 1 ? "s" : ""} ago`;
    } else if (hoursDifference > 0) {
      return `${hoursDifference} hour${hoursDifference > 1 ? "s" : ""} ago`;
    } else {
      return `${minutesDifference} minute${minutesDifference > 1 ? "s" : ""} ago`;
    }
  };

  const handleCommentSubmit = async () => {
    if (!selectedPost || !commentText.trim()) {
      showErrorToast("Please enter a valid comment.");
      return;
    }
    try {
      await createComment(selectedPost.id, commentText);
       await fetchComments(selectedPost.id); // Refresh comments
      await fetchFeeds();
      setCommentText(""); // Clear input
      //setShowCommentModal(false); // Close modal
    } catch (error) {
      console.error("Error submitting comment:", error);
    }
  };
  const handleCommentClick = async (post) => {
    setSelectedPost(post);
    await fetchComments(post.id); // Fetch comments for the post
    setShowCommentModal(true);
  };

  const handleDeleteClick = (item, type) => {
    setItemToDelete(item);
    setDeleteType(type);
    setShowDeleteModal(true);
  };
  
  const handleDeleteConfirm = async () => {
    if (deleteType === "post") {
      await handleDeletePost(itemToDelete.id);
    } else if (deleteType === "comment") {
      await handleDeleteComment(selectedPost.id, itemToDelete.id);
    }
    setShowDeleteModal(false);
    setItemToDelete(null);
    setDeleteType(null);
    await fetchFeeds(); // Refresh feeds
    if (deleteType === "comment") {
      await fetchComments(selectedPost.id); // Refresh comments for the post
    }
  };
  const handleLikeClick = async (post) => {
    await createLikes(post.id); // Fetch comments for the post
    // console.log("liked")
    // console.log(post.id) 
    await fetchFeeds();
    await fetchLikesdetails()
  };

  // const handleShareClick = (post) => {

  //   // setSelectedPost(post);
  //   // setShowShareModal(true);
  //   console.log("clicked")
  //   if (navigator.share) {
  //     navigator
  //       .share({
  //         title: post.author,
  //         text: post.description,
  //         image: post.url,
  //         url: window.location.href, // Use a specific URL for the post

  //       })
  //       .then(() => console.log("Post shared successfully"))
  //       .catch((error) => console.error("Error sharing post:", error));
  //   } else {
  //     alert("Sharing is not supported in your browser.");
  //   }
  // };

  const preventLinkDefault = (e) => e.preventDefault();
  const sortedPosts = [...postData].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  const sortedComments = [...postcomments].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  const isPostLikedByUser = (postId) => {
    const userId = localStorage.getItem("userId");
    return likedetails.some((like) => like.feed.id === postId && like.userId === userId);
  };

  return (
    <div className="feed-card-container">
     {sortedPosts.map((post) => {
      const isLiked = isPostLikedByUser(post.id);

      return (
        <Card key={post.id} className="feed-card">
          <Card.Header>
            <CardHeader
              author={post.author}
              postAge={calculatePostAge(post.createdAt)}
            />
          </Card.Header>

          {/* Post Media */}
          {post.link.endsWith(".mp4") ? (
            <video
              className="post-video"
              controls
              src={post.link}
              alt="Video Post"
            />
          ) : (
            <img className="post-img" src={post.link} alt="Image Post" />
          )}

          <Card.Body>
            <Card.Text>{post.description}</Card.Text>
          </Card.Body>

          <Card.Footer className="card-footer-custom">
            <div>
              {/* Like Button */}
              <button
                title="Like"
                className={`btn btn-icon  btn-md mr-2 p-2 `}
                onClick={() => handleLikeClick(post)}
              >
                <span
                  className={`svg-icon svg-icon-md ${
                    isLiked ? "svg-icon-danger" : "svg-icon-warning"
                  }`}
                >
                  <SVG src={toAbsoluteUrl("/media/svg/icons/General/Heart.svg")} />
                </span>
                <span className="d-block p-1">{post.likesCount}</span>
              </button>

              {/* Comment Button */}
              <button
                title="Comment"
                className="btn btn-icon  btn-md mr-2 p-2"
                onClick={(e) => {
                  preventLinkDefault(e);
                  
                  handleCommentClick(post);
                }}
              >
                <span className="svg-icon svg-icon-md svg-icon-warning d-block">
                  <SVG
                    src={toAbsoluteUrl("/media/svg/icons/General/comment.svg")}
                  />
                </span>
                <span className="d-block p-1">{post.commentCount}</span>
              </button>

              {/* Share Button */}
              {/* <a
                href="#"
                title="Share"
                className="btn btn-icon   btn-md mr-2 "
                onClick={(e) => {
                  preventLinkDefault(e);
                  handleShareClick(post);
                }}
              >
                <span className="svg-icon svg-icon-md svg-icon-warning ">
                  <SVG
                    src={toAbsoluteUrl("/media/svg/icons/General/share.svg")}
                  />
                </span>
              </a> */}
            </div>

            {/* Delete Button */}
            <div>
            <button
              title="Delete Post"
              className="btn btn-icon btn-light btn-sm mr-2"
              onClick={() => handleDeleteClick(post, "post")}
            >
              <span className="svg-icon svg-icon-md svg-icon-danger">
                <SVG src={toAbsoluteUrl("/media/svg/icons/General/Trash.svg")} />
              </span>
            </button>
          </div>
            {/* <div>
              <a
                href="#"
                title="Delete Post"
                className="btn btn-icon btn-light  btn-sm mr-2"
                onClick={(e) => {
                  preventLinkDefault(e);
                  // handleDeletePost(post.id);
                  handleDeleteClick(post)
                }}
              >
                <span className="svg-icon svg-icon-md svg-icon-danger">
                  <SVG
                    src={toAbsoluteUrl("/media/svg/icons/General/Trash.svg")}
                  />
                </span>
              </a>
              <DeleteConfirmationModal
            show={showDeleteModal}
            onHide={() => setShowDeleteModal(false)}
            onDelete={ handleDeletePost(post.id)}
            // rowData={rowData}
          />

            </div> */}
          </Card.Footer>
        </Card>
      );
    })}
      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
      show={showDeleteModal}
      onHide={() => setShowDeleteModal(false)}
      onDelete={handleDeleteConfirm}
    />
      {/* Comment Modal */}
      {
        selectedPost && (
          <Modal
            show={showCommentModal}
            onHide={() => setShowCommentModal(false)}
            centered
          >
            <Modal.Header closeButton>
              <Modal.Title>Comment</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {sortedComments.length > 0 ? (
                <div className="comment-section">
                  {sortedComments.map((comment, index) => (
                    <div key={index} className="comment-container">
                      <div className="profile-icon">
                        {comment.profilePicture ? (
                          <img
                            src={comment.profilePicture}
                            alt="Profile"
                            className="profile-picture"
                          />
                        ) : (
                          <div className="initials">
                            {comment.userName.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div key={index} className="comment">
                        <strong>{comment.userName} </strong><span style={
                          { fontSize: "10px", marginLeft: "15px" }
                        }>   {calculatePostAge(comment.createdAt)}</span>     
                          <a href="#" onClick={() => handleDeleteClick(comment, "comment")}
                       > <span className="svg-icon svg-icon-md svg-icon-secondary ">
                        <SVG
                          src={toAbsoluteUrl("/media/svg/icons/General/Trash.svg")}
                        />
                      </span></a>
                        <p>{comment.text}</p>
                 
                      </div>
                       
                    
                    </div>
                  ))}
                </div>
              ) : (
                <p>No comments available.</p>
              )}
              <Form>
                <Form.Group controlId="commentText">
                  <Form.Label style={{ marginTop: "25px" }}>Type Your Comment</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={1}
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                  />
                </Form.Group>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="secondary"
                onClick={() => setShowCommentModal(false)}
              >
                Close
              </Button>
              <Button variant="primary" onClick={handleCommentSubmit}>
                Submit
              </Button>
            </Modal.Footer>
          </Modal>
        )
      }
    </div >
  )
}

export default FeedCard;
