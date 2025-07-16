const VideoCard = ({ videoSrc }) => {
  if (!videoSrc || typeof videoSrc !== 'string') {
    return <div style={errorStyle}>Invalid or missing video link</div>;
  }

  const getEmbedUrl = (url) => {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/);
    return match ? `https://www.youtube.com/embed/${match[1]}` : null;
  };

  const embedUrl = getEmbedUrl(videoSrc);

  if (!embedUrl) {
    return <div style={errorStyle}>Invalid or unsupported YouTube link</div>;
  }

  return (
      <div style={videoContainerStyle}>
        <iframe
            width="100%"
            height="100%"
            src={embedUrl}
            title="YouTube video"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={iframeStyle}
        />
      </div>
  );
};

const videoContainerStyle = {
  width: '100%',
  height: '100%',
  borderRadius: '16px',
  overflow: 'hidden',
  border: '1px solid rgba(255,255,255,0.1)',
  backgroundColor: 'rgba(0,0,0,0.4)',
  backdropFilter: 'blur(8px)',
};

const iframeStyle = {
  border: 'none',
  width: '100%',
  height: '100%',
};

const errorStyle = {
  padding: '20px',
  color: '#ff6b6b',
  textAlign: 'center',
  fontSize: '0.9rem',
  background: 'rgba(255,255,255,0.05)',
  borderRadius: '12px',
};

export default VideoCard;
