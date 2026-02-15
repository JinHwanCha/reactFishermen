import { useState, useEffect } from 'react';
import { database, ref, get, set, onValue, runTransaction } from '../firebase/firebase';

// 오늘 날짜를 YYYY-MM-DD 형식으로 반환
const getTodayDate = () => {
  const today = new Date();
  return today.toISOString().split('T')[0];
};

// 고유 방문자 ID 생성/조회 (브라우저별)
const getVisitorId = () => {
  let visitorId = localStorage.getItem('visitorId');
  if (!visitorId) {
    visitorId = 'visitor_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('visitorId', visitorId);
  }
  return visitorId;
};

// 오늘 이미 방문했는지 확인
const hasVisitedToday = () => {
  const lastVisit = localStorage.getItem('lastVisitDate');
  const today = getTodayDate();
  return lastVisit === today;
};

// 오늘 방문 기록
const markVisitedToday = () => {
  localStorage.setItem('lastVisitDate', getTodayDate());
};

export function useVisitorCounter() {
  const [todayVisitors, setTodayVisitors] = useState(0);
  const [currentOnline, setCurrentOnline] = useState(0);
  const [totalVisitors, setTotalVisitors] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const visitorId = getVisitorId();
    const today = getTodayDate();

    // 현재 접속자 등록
    const onlineRef = ref(database, `online/${visitorId}`);
    const todayRef = ref(database, `daily/${today}`);
    const totalRef = ref(database, 'total');
    const todayVisitorsRef = ref(database, `dailyVisitors/${today}/${visitorId}`);

    // 현재 접속자로 등록
    set(onlineRef, {
      timestamp: Date.now(),
      date: today
    });

    // 브라우저 종료/탭 닫기 시 접속자 제거
    const handleBeforeUnload = () => {
      // navigator.sendBeacon으로 종료 시 데이터 전송
      const url = `https://${firebaseConfig.projectId}-default-rtdb.firebaseio.com/online/${visitorId}.json`;
      navigator.sendBeacon(url, JSON.stringify(null));
    };
    
    // visibilitychange로 탭 숨김 감지
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        set(onlineRef, null);
      } else {
        set(onlineRef, {
          timestamp: Date.now(),
          date: today
        });
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // 오늘 처음 방문이면 카운터 증가
    if (!hasVisitedToday()) {
      // 오늘 방문자에 추가
      set(todayVisitorsRef, true);
      
      // 누적 방문자 증가
      runTransaction(totalRef, (currentValue) => {
        return (currentValue || 0) + 1;
      });

      markVisitedToday();
    } else {
      // 이미 방문했어도 오늘 방문자 목록에는 기록
      set(todayVisitorsRef, true);
    }

    // 실시간 리스너 설정
    // 오늘 방문자 수 (고유 방문자)
    const todayVisitorsListRef = ref(database, `dailyVisitors/${today}`);
    const unsubscribeToday = onValue(todayVisitorsListRef, (snapshot) => {
      const data = snapshot.val();
      setTodayVisitors(data ? Object.keys(data).length : 0);
    });

    // 현재 접속자 수
    const onlineListRef = ref(database, 'online');
    const unsubscribeOnline = onValue(onlineListRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        // 5분 이내 활동한 사용자만 카운트
        const fiveMinutesAgo = Date.now() - 5 * 60 * 1000;
        const activeUsers = Object.values(data).filter(
          user => user.timestamp > fiveMinutesAgo
        );
        setCurrentOnline(activeUsers.length);
      } else {
        setCurrentOnline(0);
      }
    });

    // 누적 방문자 수
    const unsubscribeTotal = onValue(totalRef, (snapshot) => {
      setTotalVisitors(snapshot.val() || 0);
      setIsLoading(false);
    });

    // 주기적으로 온라인 상태 갱신 (1분마다)
    const heartbeatInterval = setInterval(() => {
      set(onlineRef, {
        timestamp: Date.now(),
        date: getTodayDate()
      });
    }, 60000);

    // 정리
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      clearInterval(heartbeatInterval);
      set(onlineRef, null); // 접속자 목록에서 제거
      unsubscribeToday();
      unsubscribeOnline();
      unsubscribeTotal();
    };
  }, []);

  return {
    todayVisitors,
    currentOnline,
    totalVisitors,
    isLoading
  };
}
