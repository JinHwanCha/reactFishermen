function Popup({ data, onClose }) {
  if (!data) return null;

  const isLinkDisabled = data.closeLink === "TRUE";

  return (
    <div className="dim" onClick={onClose}>
      <div className="popup" onClick={(e) => e.stopPropagation()}>
        <h2 className="popup_title">{data.title}</h2>
        <button className="popup_close" onClick={onClose}></button>
        <ul className="leader_list">
          <li className="leader">
            모임장:<br />
            <span className="leader_name">{data.leaders}</span>
          </li>
          <li className="leader">
            카톡ID:<br />
            <span className="leader_name">{data.kakaoID}</span>
          </li>
        </ul>
        <div className="content">
          {data.contentImg && (
            <img 
              src={data.contentImg} 
              alt={data.title} 
              style={{ 
                width: '100%', 
                maxWidth: '400px', 
                marginBottom: '10px',
                borderRadius: '10px'
              }} 
            />
          )}
          <pre>{data.content}</pre>
        </div>
        <div className="link_wrap">
          <a
            className={`link ${isLinkDisabled ? 'disabled' : ''}`}
            href={isLinkDisabled ? undefined : data.link}
            target="_blank"
            rel="noopener noreferrer"
          >
            {data.linkTitle}
          </a>
        </div>
      </div>
    </div>
  );
}

export default Popup;
