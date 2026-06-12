import { motion, useScroll, useTransform } from "framer-motion";
import { useLanguage } from "../context/LanguageContext";
import englishCv from "../assets/cv/Chiheb_CV.pdf";

export const CVDownload = ({ titles }: any) => {
  // Modified parameter to receive an object
  const { lang } = useLanguage();
  const { scrollYProgress } = useScroll({
    offset: [0.1, 0.4], // Adjusted offset for better animation start and end
  });
  const scale = useTransform(scrollYProgress, [0, 1], [0.7, 1]);

  return (
    <>
      <motion.div style={{ scale }}>
        <div id="portfolio" className="paddsection text-center">
          <div className="container">
            <div className="section-title text-center">
              <h2>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="0.9em"
                  height="0.9em"
                  viewBox="0 0 384 512"
                  fill="currentColor"
                  aria-hidden="true"
                  style={{ verticalAlign: "-0.1em", marginRight: "0.4em" }}
                >
                  <path d="M369.9 97.9L286 14C277 5 264.8-.1 252.1-.1H48C21.5 0 0 21.5 0 48v416c0 26.5 21.5 48 48 48h288c26.5 0 48-21.5 48-48V131.9c0-12.7-5.1-25-14.1-34zM332.1 128H256V51.9l76.1 76.1zM48 464V48h160v104c0 13.3 10.7 24 24 24h104v288H48zm228.5-145.4l-66.5 64.4V232c0-4.4-3.6-8-8-8h-20c-4.4 0-8 3.6-8 8v151l-66.5-64.4c-3.2-3.1-8.3-3-11.3.1l-13.9 14.1c-3.1 3.2-3 8.3.1 11.3l111.1 107.6c3.1 3 8.1 3 11.1 0l111.1-107.6c3.2-3.1 3.3-8.1.1-11.3l-13.9-14.1c-3-3.1-8.1-3.2-11.3-.1z" />
                </svg>
                {titles[lang].cvDownload}
              </h2>
              <h3></h3>
            </div>
            <p className="p-heading">{titles[lang]?.moreInfo}</p>{" "}
            {/* Modified titles access */}
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={englishCv}
              className="btn btn-cv"
            >
              {" "}
              English
            </a>
            {/* <a
              target="_blank"
              rel="noopener noreferrer"
              href="./images/cv/cv-thais_avelino-FR.pdf"
              className="btn btn-cv"
            >
              {" "}
              Français
            </a> */}
          </div>
        </div>
      </motion.div>
    </>
  );
};
