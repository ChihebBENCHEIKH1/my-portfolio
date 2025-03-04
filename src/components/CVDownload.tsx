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
                <i className="fas fa-file-download"></i>{" "}
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
