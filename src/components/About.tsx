import { useLanguage } from "../context/LanguageContext";
import reactLogo from "../assets/me.jpeg";
import { useScroll, useTransform } from "framer-motion";
import { motion } from "framer-motion";

export const About = ({ titles }: { titles: any }) => {
  const { lang } = useLanguage();
  const { scrollYProgress } = useScroll({
    offset: [0.1, 0.2], // Adjusted offset for better animation start and end
  });

  const scale = useTransform(scrollYProgress, [0, 1], [0.85, 1]);

  return (
    <div id="about" className="paddsection">
      <section id={titles[lang]["navBar"][1]}>
        <div className="container">
          <motion.div
            style={{ scale }}
            transition={{ ease: "easeIn", duration: 0.3 }}
          >
            <div className="row justify-content-between">
              <div className="col-lg-4 ">
                <div className="div-img-bg">
                  <div className="about-img">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.9 }}
                      transition={{ duration: 0.3 }}
                    >
                      <img
                        src={reactLogo}
                        className="img-responsive"
                        alt="me"
                      />
                    </motion.div>
                  </div>
                </div>
              </div>

              <div className="col-lg-7">
                <div className="about-descr">
                  <p className="p-heading">{titles[lang]["headerTitle"]}</p>
                  <p className="separator mb-30" style={{ minWidth: "100%" }}>
                    {titles[lang]["headerDescription"]}
                    <div style={{ marginTop: "20px" }}>
                      <strong>{titles[lang]["skill"]} :</strong>{" "}
                      {titles[lang]["headerSkills"]}
                    </div>
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};
