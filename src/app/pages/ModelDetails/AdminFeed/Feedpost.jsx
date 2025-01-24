/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { useEffect, useState } from "react";
import { Card } from "react-bootstrap";
import { toAbsoluteUrl } from "../../../../_metronic/_helpers";
import SVG from "react-inlinesvg";

const FeedPost = ({
  post,
  createLikes,
  onPlay,
  isLiked,
  playingVideoId,
  setPlayingVideoId,
  handleCommentClick,
  calculatePostAge,
  onDelete,
  preventLinkDefault,
  commentCount
}) => {
  // Initialize local state for like count and liked status
  const [likeCount, setLikeCount] = useState(post.likesCount);
  const [isLikeds, setIsLiked] = useState(isLiked ||  false); // Assume post.isLiked is provided

  // Effect to update local liked status if it changes in props
  useEffect(() => {
    setIsLiked(isLiked);
    setLikeCount(post.likesCount); // Update like count if it changes in props
  }, [isLiked, post]);

  const handleLikeClick = async () => {
    // Calculate new like count based on current like status
    const newLikeCount = isLikeds ? likeCount - 1 : likeCount + 1;

    // Optimistically update UI
    setLikeCount(newLikeCount);
    setIsLiked(!isLikeds); // Toggle isLiked state

    try {
      // Call backend to update like status
      await createLikes(post.id);
    } catch (error) {
      console.error("Error updating likes:", error);
      // Revert changes if there's an error
      setLikeCount(isLikeds ? newLikeCount + 1 : newLikeCount - 1);
      setIsLiked(isLikeds); // Revert isLiked state
    }
  };

  return (
    <div key={post.id}>
      <Card className="feed-card">
        <div style={{ padding: "15px" }}>
          <div className="card-header-custom">
            <div className="header-left">
              <img
                src={toAbsoluteUrl("/media/logos/logo-light.png")}
                alt="Avatar"
                className="avatar bg-dark"
              />
              <h6>{post.author}</h6>
            </div>
            <div>
              <small>{calculatePostAge}</small>
            </div>
          </div>
        </div>
        {post.link.endsWith(".mp4") ? (
          <video
            className="post-video"
            controls
            crossOrigin="anonymous"
            src={post.link}
            alt="Video Post"
            style={{
              height: "300px",
              width: "100%",
              objectFit: "contain",
              background: "#1A1A27",
            }}
            onClick={onPlay}
            onPlay={() => {
              if (playingVideoId !== post.id) {
                setPlayingVideoId(post.id); // Set the current video as playing
              }
            }}
            autoPlay={playingVideoId === post.id}
          />
        ) : (
          <img
            className="post-img"
            loading="lazy"
            src={post.link}
            style={{
              height: "300px",
              width: "100%",
              objectFit: "contain",
              background: "#1A1A27",
            }}
            alt="Image Post"
          />
        )}
        <Card.Body>
          <Card.Text>{post.description}</Card.Text>
        </Card.Body>
        <Card.Footer className="card-footer-custom">
          <div>
            {/* Like Button */}
            <button
              title="Like"
              className={`btn btn-icon btn-md mr-2 p-2`}
              onClick={handleLikeClick}
            >
              <span
                className={`svg-icon svg-icon-md ${isLikeds ? "svg-icon-danger" : "svg-icon-warning"}`}
              >
                <SVG title="like" src={toAbsoluteUrl("/media/svg/icons/General/Heart.svg")} />
              </span>
              <span className="d-block p-1">{likeCount}</span>
            </button>

            {/* Comment Button */}
            <button
              title="Comment"
              className="btn btn-icon btn-md mr-2 p-2"
              onClick={(e) => {
                preventLinkDefault(e);
                if (playingVideoId === post.id) {
                  const videoElement = document.querySelector(`video[src="${post.link}"]`);
                  if (videoElement) {
                    videoElement.pause();
                  }
                  setPlayingVideoId(null); // Reset playing video state
                }
                handleCommentClick(post)
                
              }}
            >
              <span className="svg-icon svg-icon-md svg-icon-warning d-block">
                <SVG title="comment" src={toAbsoluteUrl("/media/svg/icons/General/comment.svg")} />
              </span>
              <span className="d-block p-1">{commentCount}</span>
            </button>
          </div>

          {/* Delete Button */}
          <button
            title="Delete Post"
            className="btn btn-icon btn-light btn-sm mr-2"
            onClick={() => onDelete(post, "post")}
          >
            <span className="svg-icon svg-icon-md svg-icon-danger">
              <SVG src={toAbsoluteUrl("/media/svg/icons/General/Trash.svg")} />
            </span>
          </button>
        </Card.Footer>
      </Card>
    </div>
  );
};

export default FeedPost;
