import { useEffect, useRef } from 'react';

function Calendar() {
  const calendarRef = useRef(null);

  useEffect(() => {
    if (calendarRef.current && !calendarRef.current.querySelector('iframe')) {
      const iframe = document.createElement('iframe');
      iframe.src = 'https://calendar.google.com/calendar/embed?src=1cc384df8081335a97628b2d6e4170a84430dae267b3fd579e418ffdee35ffad%40group.calendar.google.com&ctz=Asia%2FSeoul';
      iframe.style.border = '0';
      iframe.width = '100%';
      iframe.height = '600';
      iframe.frameBorder = '0';
      iframe.scrolling = 'no';
      iframe.title = 'FishermenMoim Calendar';
      iframe.loading = 'lazy';
      
      calendarRef.current.appendChild(iframe);
    }
  }, []);

  return (
    <section className="calendar-section">
      <div className="calendar-container">
        <h3 className="calendar-title">어부들 캘린더</h3>
        <div className="calendar-wrapper" ref={calendarRef}></div>
      </div>
    </section>
  );
}

export default Calendar;
