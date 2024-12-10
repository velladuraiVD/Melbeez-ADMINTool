import React from "react";
export const VideoPlayer = React.memo(({ videoRef, src, onPlay }) => (
    <video
      className="post-video"
      controls
      crossOrigin="anonymous"
      src={src}
      alt="Video Post"
      style={{
        height: "300px",
        width: "100%",
        objectFit: "contain",
        background: "#1a1a27",
      }}
      ref={videoRef}
      onPlay={onPlay}
    />
  ));