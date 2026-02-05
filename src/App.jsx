import { useState, useEffect } from 'react';
import './reset.css';
import './style.css';
import Header from './components/Header';
import LinkList from './components/LinkList';
import Calendar from './components/Calendar';
import Footer from './components/Footer';
import Popup from './components/Popup';
import { useFishermenData } from './hooks/useFishermenData';

function App() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [popupData, setPopupData] = useState(null);
  const { data, loading } = useFishermenData();

  useEffect(() => {
    if (!loading) {
      setTimeout(() => {
        setIsLoaded(true);
      }, 500);
    }
  }, [loading]);

  const handleOpenPopup = (itemData) => {
    setPopupData(itemData);
    document.body.style.overflow = 'hidden';
  };

  const handleClosePopup = () => {
    setPopupData(null);
    document.body.style.overflow = '';
  };

  return (
    <>
      <div className={`wrap ${isLoaded ? 'on' : ''}`}>
        <Header />
        <LinkList data={data} onItemClick={handleOpenPopup} />
        <Calendar />
        <Footer />
        <p className="copyright">© 2026 Fishremen. All rights reserved.</p>
      </div>
      {popupData && <Popup data={popupData} onClose={handleClosePopup} />}
    </>
  );
}

export default App;
