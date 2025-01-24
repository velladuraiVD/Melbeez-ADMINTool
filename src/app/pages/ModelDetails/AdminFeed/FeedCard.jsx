import React, { useEffect, useState } from "react";
import { Modal, Spinner, Form, Button } from "react-bootstrap";
import InfiniteScroll from "react-infinite-scroll-component";
import { useAuth } from "../AuthContext";
import CommentList from "./CommentList";
import DeleteModal from "./DeleteModel";
import FeedPost from "./Feedpost";
import { calculatePostAge } from "../../../../Utility/calculateFeedAge";
import "./FeedCard.css";

function FeedCard() {
  const {
    handleDeletePost,
    fetchComments,
    postcomments,
    createComment,
    createLikes,
    handleDeleteComment,
    fetchLikesdetails,
    likedetails,
    fetchFeeds,
  } = useAuth();

  const [feeds, setFeeds] = useState([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [playingVideoId, setPlayingVideoId] = useState(null);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [commentText, setCommentText] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteType, setDeleteType] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);
  // Fetch feeds and likes on mount
  useEffect(() => {
    loadFeeds();
    fetchLikesdetails();
  }, []);

  const loadFeeds = async () => {
    try {
      const newFeeds = await fetchFeeds(page, 3); // Fetch 3 posts at a time
      if (newFeeds.length === 0) {
        setHasMore(false);
      } else {
        // Sort posts by createdAt (most recent first)

        setFeeds((prevFeeds) => [...prevFeeds, ...newFeeds]);
        setPage((prevPage) => prevPage + 1);
      }
    } catch (error) {
      console.error("Error fetching feeds:", error);
    }
  };

  // Get user ID and name from local storage
  const userId = localStorage.getItem("userId");
  const userName = localStorage.getItem("userName");

  // Handle comment submission
  const handleCommentClick = async (post) => {
    setSelectedPost(post);
    await fetchComments(post.id); // Fetch comments for the selected post
    setShowCommentModal(true);
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    if (!selectedPost || !commentText.trim()) return; // Ensure there's a selected post and comment text

    try {
      // Create the comment
      const newComment = await createComment(
        selectedPost.id,
        userId,
        commentText,
        userName
      );

      // Update local comments list without refetching
      postcomments.push(newComment); // Add newly created comment to the list
      setCommentText(""); // Clear input field after submission

      // Sort comments by creation date (most recent first)
      postcomments.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      // Update the comment count for the selected post
      setFeeds((prevFeeds) =>
        prevFeeds.map((feed) =>
          feed.id === selectedPost.id
            ? { ...feed, commentCount: feed.commentCount + 1 } // Increase the comment count by 1
            : feed
        )
      );

      // Optionally refresh comments if needed
      await fetchComments(selectedPost.id); // Refresh comments for the selected post
    } catch (error) {
      
      alert("Failed to submit comment. Please try again."); // Notify user of error
    }
  };

  // Handle delete click
  const handleDeleteClick = (item, type) => {
    setItemToDelete(item);
    setDeleteType(type);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      if (deleteType === "post") {
        await handleDeletePost(itemToDelete.id);
      } else if (deleteType === "comment") {
        await handleDeleteComment(selectedPost.id, itemToDelete.id);

        // Update the comment list with sorted comments after deletion
        setFeeds((prevFeeds) =>
          prevFeeds.map((feed) =>
            feed.id === selectedPost.id
              ? {
                  ...feed,
                  commentCount: feed.commentCount - 1, // Decrease the comment count by 1
                  comments: feed.comments
                    ? feed.comments
                        .filter((comment) => comment.id !== itemToDelete.id) // Filter comments
                        .sort(
                          (a, b) =>
                            new Date(b.createdAt) - new Date(a.createdAt)
                        ) // Sort comments by creation date
                    : [], // If no comments, fallback to empty array
                }
              : feed
          )
        );
      }

      setShowDeleteModal(false);
      setItemToDelete(null);
      setDeleteType(null);

      // Optionally refresh comments if needed (but not feeds)
      if (deleteType === "comment") {
        await fetchComments(selectedPost.id); // Refresh comments if necessary
      }
    } catch (error) {
      
    }
  };

  const preventLinkDefault = (e) => e.preventDefault();

  const handleVideoPlay = (postId) => {
    if (playingVideoId === postId) {
      setPlayingVideoId(null); // Pause video if it's already playing
    } else {
      setPlayingVideoId(postId); // Set new video as playing
    }
  };

  const isPostLikedByUser = (postId) => {
    return likedetails.some(
      (like) => like.feed.id === postId && like.userId === userId
    );
  };

  return (
    <div>
      <InfiniteScroll
        dataLength={feeds.length}
        next={loadFeeds}
        hasMore={hasMore}
        loader={
          <h4 className="text-center">
            <Spinner animation="border" role="status">
              <span className="sr-only">Loading...</span>
            </Spinner>
          </h4>
        }
        endMessage={
          <p className="text-center text-danger mt-4">
            No more posts available.
          </p>
        }
      >
        {feeds.map((post) => {
          const isLiked = isPostLikedByUser(post.id); // Check if the post is liked by the user
          return (
            <div
              key={post.id}
              style={{
                padding: "10px",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <FeedPost
                post={post}
                fetchComments={fetchComments}
                createLikes={createLikes}
                postcomments={post.comments}
                onplay={handleVideoPlay}
                playingVideoId={playingVideoId}
                setPlayingVideoId={setPlayingVideoId}
                onDelete={handleDeleteClick}
                handleCommentClick={handleCommentClick}
                preventLinkDefault={preventLinkDefault}
                calculatePostAge={calculatePostAge(post.createdAt)}
                isLiked={isLiked} // Pass liked status to FeedPost
                commentCount={post.commentCount} // Pass the updated comment count to FeedPost
              />
            </div>
          );
        })}
      </InfiniteScroll>

      <DeleteModal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        onDelete={handleDeleteConfirm}
      />

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
            {postcomments.length > 0 ? (
              <CommentList
                comments={postcomments}
                onDeleteClick={handleDeleteClick}
                calculatePostAge={calculatePostAge}
              />
            ) : (
              <p>No comments available.</p>
            )}
            <Form onSubmit={handleCommentSubmit}>
              {" "}
              {/* Prevent default form submission */}
              <Form.Group controlId="commentText">
                <Form.Label style={{ marginTop: "25px" }}>
                  Type Your Comment
                </Form.Label>
                <Form.Control
                  as="textarea"
                  rows={1}
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  required // Ensure this field is filled before submission
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              type="submit"
              onClick={() => setShowCommentModal(false)}
            >
              Close
            </Button>
            <Button
              variant="primary"
              type="submit"
              onClick={handleCommentSubmit}
            >
              Submit
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
}

export default FeedCard;
