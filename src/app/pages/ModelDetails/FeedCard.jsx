import React, { useEffect, useState } from "react";
import Card from "react-bootstrap/Card";
import { toAbsoluteUrl } from "../../../_metronic/_helpers";
import SVG from "react-inlinesvg";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import {
  FaWhatsapp,
  FaEnvelope,
  FaTelegram,
  FaInstagram,
  FaFacebook,
} from "react-icons/fa";
import { useAuth } from "./AuthContext"; // Adjust the path accordingly
import "../ModelDetails/FeedCard.css";

const CardHeader = ({ author, postAge }) => (
  <div className="card-header-custom">
    <div className="header-left">
      <img
        src={toAbsoluteUrl("/media/users/300_21.jpg")}
        alt="Avatar"
        className="avatar"
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
  const [commentImage, setCommentImage] = useState(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const {
    postData,
    fetchFeeds,
    handleDeletePost,
    handleUpload,
    handleLikePost,
  } = useAuth();

  useEffect(() => {
    fetchFeeds();
  }, [fetchFeeds, handleUpload]);

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
      return `${minutesDifference} minute${
        minutesDifference > 1 ? "s" : ""
      } ago`;
    }
  };

  const handleShareClick = (post) => {
    setSelectedPost(post);
    setShowShareModal(true);
  };

  const handleShareWhatsApp = (post) => {
    const message = `Check out this post: ${post.link}`;
    const url = `whatsapp://send?text=${encodeURIComponent(message)}`;
    window.location.href = url;
  };

  const handleShareFacebook = (post) => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      post.link
    )}`;
    window.open(url, "_blank");
  };

  const handleShareInstagram = (post) => {
    const message = `Check out this post: ${post.link}`;
    const url = `https://www.instagram.com/share?text=${encodeURIComponent(
      message
    )}`;
    window.location.href = url;
  };

  const handleShareTelegram = (post) => {
    const message = encodeURIComponent(`Check out this post: ${post.link}`);
    const url = `https://telegram.me/share/url?url=${message}`;
    window.open(url, "_blank");
  };

  const handleCommentSubmit = () => {
    console.log("Comment text:", commentText);
    console.log("Comment image:", commentImage);
    setShowCommentModal(false);
  };

  const handleCommentClick = (post) => {
    setSelectedPost(post);
    setShowCommentModal(true);
  };

  const handleLikeClick = (postId) => {
    handleLikePost(postId);
  };

  const handleShareGmail = (post) => {
    const subject = "Check out this post";
    const body = `Hi,\n\nI thought you might be interested in this post: ${post.link}`;
    const url = `mailto:?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
    window.location.href = url;
  };

  return (
    <div className="feed-card-container">
      {postData.map((post) => (
        <Card key={post.id} className="feed-card">
          <Card.Header>
            <CardHeader
              author={post.author}
              postAge={calculatePostAge(post.createdAt)}
            />
          </Card.Header>
          <Card.Img
            className="post-img"
            variant="top"
            src={post.link}
            alt="Post"
          />
          <Card.Body>
            <Card.Text>{post.description}</Card.Text>
          </Card.Body>
          <Card.Footer className="card-footer-custom">
            <div>
              <button
                title="Like"
                className="btn btn-icon btn-light btn-hover-danger btn-sm mr-2"
                onClick={() => handleLikeClick(post.id)}
              >
                <span
                  className={`svg-icon svg-icon-md svg-icon-${
                    post.likes > 0 ? "danger" : "warning"
                  }`}
                >
                  <SVG
                    src={toAbsoluteUrl("/media/svg/icons/General/Heart.svg")}
                  />
                </span>
              </button>
              <a
                href="#"
                title="Comment"
                className="btn btn-icon btn-light btn-hover-danger btn-sm mr-2"
                onClick={() => handleCommentClick(post)}
              >
                <span className="svg-icon svg-icon-md svg-icon-warning">
                  <SVG
                    src={toAbsoluteUrl("/media/svg/icons/General/comment.svg")}
                  />
                </span>
              </a>
              <a
                href="#"
                title="Share"
                className="btn btn-icon btn-light btn-hover-danger btn-sm mr-2"
                onClick={() => handleShareClick(post)}
              >
                <span className="svg-icon svg-icon-md svg-icon-warning">
                  <SVG
                    src={toAbsoluteUrl("/media/svg/icons/General/share.svg")}
                  />
                </span>
              </a>
            </div>
            <div>
              <a
                href="#"
                title="Delete Post"
                className="btn btn-icon btn-light btn-hover-danger btn-sm mr-2"
                onClick={() => handleDeletePost(post.id)}
              >
                <span className="svg-icon svg-icon-md svg-icon-danger">
                  <SVG
                    src={toAbsoluteUrl("/media/svg/icons/General/Trash.svg")}
                  />
                </span>
              </a>
            </div>
          </Card.Footer>
        </Card>
      ))}

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
            <Form>
              <Form.Group controlId="commentText">
                <Form.Label>Type Your Comment</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
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
      )}

      <Modal
        show={showShareModal}
        onHide={() => setShowShareModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Share Post</Modal.Title>
          <div style={{ marginLeft: "auto" }}>
            <Button variant="danger" onClick={() => setShowShareModal(false)}>
              Close
            </Button>
          </div>
        </Modal.Header>
        <Modal.Body>
          <div className="share-buttons-container">
            <Button
              variant="light"
              onClick={() => handleShareWhatsApp(selectedPost)}
            >
              <FaWhatsapp size={20} color="#128C7E" />
            </Button>
            <Button
              variant="light"
              onClick={() => handleShareGmail(selectedPost)}
            >
              <FaEnvelope size={20} color="#EA4335" />
            </Button>
            <Button
              variant="light"
              onClick={() => handleShareTelegram(selectedPost)}
            >
              <FaTelegram size={20} color="#0088cc" />
            </Button>
            <Button
              variant="light"
              onClick={() => handleShareInstagram(selectedPost)}
            >
              <FaInstagram size={20} color="#bc2a8d" />
            </Button>
            <Button
              variant="light"
              onClick={() => handleShareFacebook(selectedPost)}
            >
              <FaFacebook size={20} color="#3b5998" />
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default FeedCard;
