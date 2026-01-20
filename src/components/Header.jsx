function Header() {
  return (
    <>
      <h1 className="logo">
        <img src="/logo.png" alt="logo" />
      </h1>
      <div className="title_wrap">
        <h2 className="title">@FishermenMoim</h2>
        <p className="title_desc">
          And he saith unto them, <br />
          Follow me, and I will make you fishers of men. <br />
          Matthew 4:19
        </p>
        <ul className="list_sns">
          <li className="item_sns item_youtube">
            <a
              title="YouTube"
              data-testid="SocialIcon"
              target="_blank"
              rel="noopener noreferrer"
              href="https://youtube.com/@naesoofishermen?si=sRH2adNZru9hspJv"
              aria-label="YouTube"
            >
              <img src="/youtube_logo.png" alt="YouTube" />
              <span className="sr-only">YouTube</span>
            </a>
          </li>
          <li className="item_sns item_instagram">
            <a
              title="Instagram"
              data-testid="SocialIcon"
              target="_blank"
              rel="noopener noreferrer"
              href="https://www.instagram.com/naesoofishermen/"
              aria-label="Instagram"
            >
              <img src="/insta_logo.png" alt="Instagram" />
              <span className="sr-only">Instagram</span>
            </a>
          </li>
          <li className="item_sns item_kakao">
            <a
              title="kakaotalk"
              data-testid="SocialIcon"
              target="_blank"
              rel="noopener noreferrer"
              href="https://pf.kakao.com/_xibZxhC"
              aria-label="kakaotalk"
            >
              <img src="/kakao.png" alt="Kakaotalk" />
              <span className="sr-only">kakaotalk</span>
            </a>
          </li>
        </ul>
      </div>
    </>
  );
}

export default Header;
