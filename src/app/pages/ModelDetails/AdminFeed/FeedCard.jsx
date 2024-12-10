import React, { useEffect, useState } from "react";
import { FixedSizeList as List } from "react-window";
import { useAuth } from "../AuthContext";

import CommentList from "./CommentList";
import { Modal } from "react-bootstrap"; // Keep Modal as it is
import DeleteModal from "./DeleteModel";
// Replace these lines
import { Form } from "react-bootstrap"; // Corrected import
import { Button } from "react-bootstrap"; // Corrected import

import "./FeedCard.css";

import FeedPost from "./Feedpost";
import { calculatePostAge } from "../../../../Utility/calculateFeedAge";
function FeedCard() {
  const {
    postData,
    
    fetchFeeds,
    handleDeletePost,
    fetchComments,
   
    postcomments,
    createComment,
    createLikes,
    handleDeleteComment,
    fetchLikesdetails,
    likedetails,
    
  } = useAuth();
  const [playingVideoId, setPlayingVideoId] = useState(null);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [commentText, setCommentText] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteType, setDeleteType] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);
  useEffect(() => {
    fetchFeeds();
    fetchLikesdetails();
  }, []);
  const handleCommentSubmit = async (e) => {
    e.stopPropagation();
    if (!selectedPost || !commentText.trim()) {
  
      return;
    }
    try {
      await createComment(selectedPost.id, commentText);
       await fetchComments(selectedPost.id);
       await fetchFeeds();
      setCommentText("");
    } catch (error) {
      // console.error("Error submitting comment:", error);
    }
  };
  const handleCommentClick = async (post) => {
    setSelectedPost(post);
    
    await fetchComments(post.id);
    await fetchLikesdetails();
    await fetchFeeds();
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
    await fetchFeeds();
    if (deleteType === "comment") {
      await fetchComments(selectedPost.id);
    }
  };
  const sortedPosts = [...postData].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );
  const sortedComments = [...postcomments].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );
  const preventLinkDefault = (e) => e.preventDefault();
  const handleVideoPlay = (postId) => {
    // Check if the current video is already playing
    if (playingVideoId !== postId) {
      setPlayingVideoId(postId); // Set the current video as playing
    } else {
      // Don't reset the video if it's already playing
      setPlayingVideoId(postId); // Ensuring it stays playing when clicked again
    }
  };
  const isPostLikedByUser = (postId) => {
    const userId = localStorage.getItem("userId");
    return likedetails.some((like) => like.feed.id === postId && like.userId === userId);
  };

  const renderPost = ({ index, style }) => {
    const post = sortedPosts[index];
    const isLiked = isPostLikedByUser(post.id);

    const enhancedStyle = {
      ...style,
      display: "flex",
      flexWrap: "wrap",
      justifyContent: "center",
      gap: "10px",
      padding: "10px",
  
    };
    return (
      <div style={enhancedStyle}>
        <FeedPost
          post={post}
          // fetchFeeds={fetchFeeds}
          fetchComments={fetchComments}
          createLikes={createLikes}
          postcomments={post.comments}
          onplay={handleVideoPlay}
          playingVideoId={playingVideoId}
          setPlayingVideoId={setPlayingVideoId}
          onDelete={handleDeleteClick}
          handleCommentClick={handleCommentClick}
          handleDeleteClick={handleDeleteClick}
          preventLinkDefault={preventLinkDefault}
          calculatePostAge={calculatePostAge(post.createdAt)}
          isLiked={isLiked}
        />
      </div>
    );
  };
  return (
    <div>
      <List
        height={700} // Visible height of the list
        itemCount={sortedPosts.length} // Total number of posts
        itemSize={600} // Height of each post (300px video + padding)
        width="100%" // Full width
      >
        {renderPost}
      </List>
      <DeleteModal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        onDelete={handleDeleteConfirm}
      />
      {/* Comment Modal */}
      {selectedPost && (
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
              <CommentList
                comments={sortedComments}
                onDeleteClick={handleDeleteClick}
                calculatePostAge={calculatePostAge}
              />
            ) : (
              <p>No comments available.</p>
            )}
            <Form>
              <Form.Group controlId="commentText">
                <Form.Label style={{ marginTop: "25px" }}>
                  Type Your Comment
                </Form.Label>
                <Form.Control
                  as="textarea"
                  rows={1}
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                />
              </Form.Group>
            </Form>
            {/* <CommentForm  commentText={commentText}  setCommentText={setCommentText}  /> */}
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setShowCommentModal(false)}
            >
              Close
            </Button>
            <Button variant="primary" onClick={(e)=>handleCommentSubmit(e)}>
              Submit
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
}
export default FeedCard;