import { useState } from 'react';

const VISIBLE_COUNT = 5;

function LinkList({ data, onItemClick }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleList = () => {
    setIsExpanded(!isExpanded);
  };

  const showToggleButton = data.length > VISIBLE_COUNT;

  return (
    <>
      <ul className="list_link" id="data-list">
        {data.map((item, index) => (
          <li 
            key={index} 
            className={`item_link ${index >= VISIBLE_COUNT ? (isExpanded ? 'expanded' : 'collapsed') : ''}`}
          >
            <button className="button" onClick={() => onItemClick(item)}>
              <img src={item.imageSrc} alt={item.category} />
              {item.title}
            </button>
          </li>
        ))}
      </ul>

      {showToggleButton && (
        <div className="toggle_btn_wrap">
          <button className="toggle_btn" onClick={toggleList}>
            {isExpanded ? '접기' : '더보기'}
          </button>
        </div>
      )}
    </>
  );
}

export default LinkList;
