import VisitorCounter from './VisitorCounter';

function Footer() {
  return (
    <>
      <div className="footer">
        <p>어부들 인플루언서 :</p>
        <a href="https://www.instagram.com/2moksa/" target="_blank" rel="noopener noreferrer">
          <img src="/2moksa.png" alt="2moksa" />
        </a>
      </div>
      <VisitorCounter />
    </>
  );
}

export default Footer;
