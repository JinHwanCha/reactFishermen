import { useState, useEffect } from 'react';
import { useDiscussionData } from '../hooks/useDiscussionData';
import '../styles/discussionGuide.css';

function DiscussionGuide() {
  const [isLoaded, setIsLoaded] = useState(false);
  const { data: guideData, loading } = useDiscussionData();
  const [headerDate, setHeaderDate] = useState({
    title: '',
    date: ''
  });

  useEffect(() => {
    // 페이지 배경색 설정
    document.body.classList.add('discussion-page');
    
    // 페이지 진입 애니메이션
    setTimeout(() => {
      setIsLoaded(true);
    }, 1000);

    // 오늘 날짜 계산 (다가오는 일요일)
    const today = new Date();
    const dayOfWeek = today.getDay();
    const daysUntilSunday = dayOfWeek === 0 ? 0 : 7 - dayOfWeek;

    const sunday = new Date(today);
    sunday.setDate(today.getDate() + daysUntilSunday);

    const year = sunday.getFullYear();
    const month = String(sunday.getMonth() + 1).padStart(2, '0');
    const day = String(sunday.getDate()).padStart(2, '0');

    setHeaderDate({
      title: `${year} 내수동교회 청년부`,
      date: `${year}.${month}.${day}.`
    });

    // 컴포넌트 언마운트 시 배경색 제거
    return () => {
      document.body.classList.remove('discussion-page');
    };
  }, []);

  return (
    <div className={`wrap ${isLoaded ? 'on' : ''}`}>
      <div className="header">
        <div className="header_top">
          <p className="header_title">{headerDate.title}</p>
          <p><span className="date">{headerDate.date}</span> 주일예배</p>
        </div>
        <h2 className="title">어부들 <br />목장 나눔지</h2>
        <div className="discussion_wrap">
          <h3 className="discussion_title">{guideData.title}</h3>
          <p className="bible_passage">{guideData.passage}</p>
          <p className="bible_preacher">{guideData.preacher}</p>
        </div>
      </div>
      <div className="content">
        <div className="content_wrap observation_questions">
          <h4>본문 질문</h4>
          {guideData.observationQuestions.map((question, index) => (
            <p key={index} className="question">
              <span>{index + 1}.</span>{question}
            </p>
          ))}
        </div>
        <div className="content_wrap application_questions">
          <h4>적용 질문</h4>
          {guideData.applicationQuestions.map((question, index) => (
            <p key={index} className="question">
              <span>{index + 1}.</span>{question}
            </p>
          ))}
        </div>
        <div className="sharing_wrap">
          <h4 className="sharing_title">{guideData.sharingTitle}</h4>
          <ul className="sharing_list">
            {guideData.sharingQuestions.map((question, index) => (
              <li key={index} className="sharing_question">{question}</li>
            ))}
          </ul>
        </div>
      </div>
      <div className="footer">
        <h1 className="logo">
          <img src="/fishermen_logo.svg" alt="logo" />
        </h1>
      </div>
      <p className="copyright">© 2025 Fishremen. All rights reserved.</p>
    </div>
  );
}

export default DiscussionGuide;
