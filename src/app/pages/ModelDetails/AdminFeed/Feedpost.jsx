import React, { useState } from "react";
import { Card } from "react-bootstrap";
import { toAbsoluteUrl } from "../../../../_metronic/_helpers";
import SVG from "react-inlinesvg";

// import "./FeedCard.css";
const FeedPost = ({ post,isLiked,  createLikes ,onplay,  playingVideoId, setPlayingVideoId,  handleCommentClick, 
    calculatePostAge,
    handleDeleteClick,
    preventLinkDefault,}) => {
        const [likeCount, setLikeCount] = useState(post.likesCount);
        const [liked, setLiked] = useState(isLiked);
        const handleLikeClick = async () => {
          const newLikeCount = liked ? likeCount - 1 : likeCount + 1;
          setLikeCount(newLikeCount);
          setLiked(!liked);
          try {
            await createLikes(post.id); // Update like status in backend
          } catch (error) {
            // console.error("Error updating likes:", error);
            // Revert the like state and count in case of error
            setLikeCount(likeCount);
            setLiked(liked);
          }
        };

  return (
    <div key={post.id} >
      <Card className="feed-card">
        <div style={{ padding: "15px 15px 5px 10px" }}>
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
            onClick={onplay}
            // onPause={() => {
            //   if (playingVideoId === post.id) {
            //     setPlayingVideoId(null); // Reset playing video on pause
            //   }
            // }}
            onPlay={() => {
              if (playingVideoId !== post.id) {
                setPlayingVideoId(post.id); // Set the current video as playing
              }
            }}
            autoPlay={playingVideoId === post.id} // Only autoplay if
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
            <button
              title="Like"
              className={`btn btn-icon btn-md mr-2 p-2`}
              onClick={handleLikeClick}
            >
              <span
                className={`svg-icon svg-icon-md ${liked ? "svg-icon-danger" : "svg-icon-warning"}`}
              >
                <SVG title="like"src={toAbsoluteUrl("/media/svg/icons/General/Heart.svg")} />
              </span>
              <span className="d-block p-1">{likeCount}</span>
            </button>
            <button
                title="Comment"
                className="btn btn-icon btn-md mr-2 p-2"
                onClick={(e) => {
                    preventLinkDefault(e);
                    // Pause the video if it's playing
                    if (playingVideoId === post.id) {
                      const videoElement = document.querySelector(`video[src="${post.link}"]`);
                      if (videoElement) {
                        videoElement.pause();
                      }
                      setPlayingVideoId(null); // Reset playing video state
                    }
                    handleCommentClick(post);
                  }}
              >
                <span className="svg-icon svg-icon-md svg-icon-warning d-block">
                  <SVG
                  title="comment"
                    src={toAbsoluteUrl("/media/svg/icons/General/comment.svg")}
                  />
                </span>
                <span className="d-block p-1">{post.commentCount}</span>
              </button>
            </div>
            {/* Delete Button */}
              <button
                title="Delete Post"
                className="btn btn-icon btn-light btn-sm mr-2"
                onClick={() => handleDeleteClick(post, "post")}
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