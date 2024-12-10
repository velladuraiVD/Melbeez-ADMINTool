import React from "react";
import { toAbsoluteUrl } from "../../../../_metronic/_helpers";
import SVG from "react-inlinesvg";

const CommentList = ({ comments, onDeleteClick, calculatePostAge }) => (
    <div className="comment-section">
      {comments.map((comment, index) => (
        <div key={index} className="comment-container">
          <div className="profile-icon">
            {comment.profilePicture ? (
              <img src={comment.profilePicture} alt="Profile" className="profile-picture" />
            ) : (
              <div className="initials">{comment.userName.charAt(0).toUpperCase()}</div>
            )}
          </div>
          <div className="comment">
            <strong>{comment.userName}</strong>
            <span style={{ fontSize: "10px", marginLeft: "15px" }}>
              {calculatePostAge(comment.createdAt)}
            </span>
            <a href="#" onClick={() => onDeleteClick(comment, "comment")}>
              <span className="svg-icon svg-icon-md svg-icon-secondary">
                <SVG src={toAbsoluteUrl("/media/svg/icons/General/Trash.svg")} />
              </span>
            </a>
            <p>{comment.text}</p>
          </div>
        </div>
      ))}
    </div>
  );
  export default CommentList