import { useEffect, useRef, useState } from 'react';

function PopupImageSlider({ images }) {
  const [index, setIndex] = useState(0);
  const dragStart = useRef(null);

  useEffect(() => {
    setIndex(0);
  }, [images]);

  if (!images || images.length === 0) return null;

  const total = images.length;
  const goPrev = () => setIndex((i) => (i - 1 + total) % total);
  const goNext = () => setIndex((i) => (i + 1) % total);

  const THRESHOLD = 50;

  const handlePointerDown = (e) => {
    dragStart.current = e.clientX ?? e.touches?.[0]?.clientX;
  };

  const handlePointerUp = (e) => {
    if (dragStart.current === null) return;
    const endX = e.clientX ?? e.changedTouches?.[0]?.clientX;
    const diff = dragStart.current - endX;
    if (diff > THRESHOLD) goNext();
    else if (diff < -THRESHOLD) goPrev();
    dragStart.current = null;
  };

  return (
    <div className="popup_slider">
      <div
        className="popup_slider_viewport"
        onMouseDown={handlePointerDown}
        onMouseUp={handlePointerUp}
        onTouchStart={handlePointerDown}
        onTouchEnd={handlePointerUp}
        style={{ userSelect: 'none' }}
      >
        <div
          className="popup_slider_track"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {images.map((src, i) => (
            <div className="popup_slider_slide" key={`${src}-${i}`}>
              <img src={src} alt={`이미지 ${i + 1}`} />
            </div>
          ))}
        </div>

        {total > 1 && (
          <>
            <button
              type="button"
              className="popup_slider_btn popup_slider_btn_prev"
              onClick={goPrev}
              aria-label="이전"
            >
              ‹
            </button>
            <button
              type="button"
              className="popup_slider_btn popup_slider_btn_next"
              onClick={goNext}
              aria-label="다음"
            >
              ›
            </button>
          </>
        )}
      </div>

      {total > 1 && (
        <div className="popup_slider_dots">
          {images.map((_, i) => (
            <button
              type="button"
              key={i}
              className={`popup_slider_dot ${i === index ? 'active' : ''}`}
              onClick={() => setIndex(i)}
              aria-label={`${i + 1}번 이미지`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default PopupImageSlider;
