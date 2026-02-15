import { useVisitorCounter } from '../hooks/useVisitorCounter';

function VisitorCounter() {
  const { todayVisitors, currentOnline, totalVisitors, isLoading } = useVisitorCounter();

  if (isLoading) {
    return (
      <div className="visitor-counter">
        <div className="visitor-counter-inner">
          <span className="visitor-loading">로딩중...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="visitor-counter">
      <div className="visitor-counter-inner">
        <div className="visitor-item">
          <span className="visitor-label">오늘</span>
          <span className="visitor-value">{todayVisitors.toLocaleString()}</span>
        </div>
        <div className="visitor-divider">|</div>
        <div className="visitor-item">
          <span className="visitor-label">현재</span>
          <span className="visitor-value online">{currentOnline.toLocaleString()}</span>
        </div>
        <div className="visitor-divider">|</div>
        <div className="visitor-item">
          <span className="visitor-label">누적</span>
          <span className="visitor-value">{totalVisitors.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}

export default VisitorCounter;
