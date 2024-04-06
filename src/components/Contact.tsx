import { useLanguage } from "../context/LanguageContext";
import { motion, useScroll, useTransform } from "framer-motion";

export const Contact = (titles: any) => {
  const { lang } = useLanguage();
  const { scrollYProgress } = useScroll({
    offset: [0.1, 0.9], // Adjusted offset for better animation start and end
  });
  const scale = useTransform(scrollYProgress, [0, 1], [0.4, 1]);
  return (
    <>
      <motion.div style={{ scale }}>
        <div id="contact" className="paddsection">
          <section id={titles["titles"][lang]["navBar"][3]}>
            <div className="container">
              <div className="contact-block1">
                <div className="row">
                  <div className="col-lg-6">
                    <div className="contact-contact">
                      <h2 className="mb-30">
                        {titles["titles"][lang]["contactTitle"]}
                      </h2>

                      <ul className="contact-details">
                        <li>
                          <span>Chiheb BEN CHEIKH</span>
                        </li>
                        <li>
                          <span>bencheikh.chiheb@gmail.com</span>
                        </li>
                        <br />
                        <li>
                          <a
                            target="_blank"
                            rel="noopener noreferrer"
                            href="https://www.linkedin.com/in/chiheb-ben-cheikh-448552221/"
                          >
                            <i className="fab fa-linkedin"></i> Linkedin
                          </a>
                        </li>
                        <li>
                          <a
                            target="_blank"
                            rel="noopener noreferrer"
                            href="https://github.com/ChihebBENCHEIKH1"
                          >
                            <i className="fab fa-github"></i>{" "}
                            {titles["titles"][lang]["codeProjects"]}
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="col-lg-6"></div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </motion.div>
    </>
  );
};
