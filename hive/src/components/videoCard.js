const VideoCard = ({ videoSrc }) => {
  if (!videoSrc || typeof videoSrc !== 'string') {
    return <div>Invalid or missing video link</div>;
  }

  const getEmbedUrl = (url) => {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/);
    return match ? `https://www.youtube.com/embed/${match[1]}` : null;
  };

  const embedUrl = getEmbedUrl(videoSrc);

  if (!embedUrl) {
    return <div>Invalid or unsupported YouTube link</div>;
  }

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <iframe
        width="100%"
        height="100%"
        src={embedUrl}
        title="YouTube video"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        style={{ borderRadius: '8px' }}
      />
    </div>
  );
};

export default VideoCard;
