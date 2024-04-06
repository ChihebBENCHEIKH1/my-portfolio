import { useLanguage } from "../context/LanguageContext";
import { AnimatedTyping } from "./AnimatedTyping";

export const Header = ({ titles }: any) => {
  const { lang } = useLanguage();
  return (
    <>
      <div id="header" className="home" key={lang}>
        <section id={titles[lang]["navBar"][0]}>
          <div className="container">
            <div className="header-content">
              <div className="flex">
                <h1>
                  {titles[lang]["I"]}{" "}
                  <span className="typed">
                    <AnimatedTyping infos={titles[lang]["qualities"]} />
                  </span>
                </h1>
              </div>
              <p> {[titles[lang]["myInfo"]]}</p>

              <ul className="list-unstyled list-social">
                <li>
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href="https://www.linkedin.com/in/chiheb-ben-cheikh-448552221/"
                  >
                    <i className="fab fa-linkedin"></i>
                  </a>
                </li>
                <li>
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href="https://github.com/ChihebBENCHEIKH1"
                  >
                    <i className="fab fa-github"></i>
                  </a>
                </li>
                <li>
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href="https://gitlab.com/bencheikh.chiheb"
                  >
                    <i className="fab fa-gitlab"></i>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};
