import React, { useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import logo from "../assets/logo.png";
import { Language, useLanguage } from "../context/LanguageContext";
type Props = {
  titles: any;
};
const Navbar: React.FC<Props> = ({ titles }: Props) => {
  const controls = useAnimation();
  const { lang, setLang } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      if (scrollPosition < 5) {
        controls.start({
          marginTop: "-100px",
          transition: { duration: 0.7 },
        });
      } else {
        controls.start({ marginTop: "0px", transition: { duration: 0.7 } });
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [controls]);

  const handleLangToggle = (selectedLang: Language) => {
    setLang(selectedLang);
  };

  const scrollToSection = (id: string) => {
    const section = document.getElementById(id);
    if (section) {
      window.scrollTo({
        top: section.offsetTop,
        behavior: "smooth",
      });
    }
  };

  return (
    <motion.nav
      id="main-nav"
      style={{ marginTop: "-100px", display: "block" }}
      animate={controls}
    >
      <div className="align-navbar-items">
        <div className="container">
          <div className="logo">
            <a href="#header" onClick={() => scrollToSection("header")}>
              {" "}
              {/* Scroll to header section */}
              <img src={logo} alt="logo" />
            </a>
          </div>
          <div className="responsive">
            <i data-icon="m" className="ion-navicon-round"></i>
          </div>
          <ul className="nav-menu list-unstyled">
            {titles[lang]["navBar"].map((title: string, index: number) => (
              <li key={index}>
                <a
                  href={`#${title}`}
                  className="smoothScroll"
                  onClick={() => scrollToSection(title)}
                >
                  {/* Scroll to section based on title */}
                  {title}
                </a>
              </li>
            ))}

            <li>
              <a
                href=""
                id="lang-toggle"
                className="smoothScroll"
                onClick={(e) => {
                  e.preventDefault(); // Prevent the default behavior
                  handleLangToggle(lang === "eng" ? "de" : "eng");
                }}
              >
                {lang === "eng" ? "Deutsch" : "English"}
              </a>
            </li>
          </ul>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
