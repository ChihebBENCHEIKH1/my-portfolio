import { motion, useTransform } from "framer-motion"; // Added useTransform import
import { useLanguage } from "../context/LanguageContext";
import { useScroll } from "framer-motion";
import Card from "./Card";

export const WorkExperience = ({ titles }: any) => {
  const { lang } = useLanguage();
  const { scrollYProgress } = useScroll({
    offset: [0.1, 0.6],
  });
  const scale = useTransform(scrollYProgress, [0, 1], [0.5, 1]);

  return (
    <motion.div style={{ scale }}>
      <div id={titles[lang]["navBar"][2]} className="text-left paddsection">
        <section id="workExperience">
          <div className="container">
            <div className="section-title text-center">
              <motion.h2>{titles[lang].workExperience}</motion.h2>
            </div>
          </div>

          <div className="container">
            <div className="journal-block">
              {titles[lang].workExperienceList.map((workExperience) => (
                <div
                  style={{
                    display: "flex",
                    gap: "40px",
                    marginBottom: "20px",
                    cursor: "pointer",
                  }}
                >
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                  >
                    {" "}
                    <img
                      src={workExperience.img}
                      alt=""
                      style={{
                        width: "100px",
                        height: "100px",
                        borderRadius: "50%",
                      }}
                    />
                  </motion.div>

                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "10px",
                    }}
                  >
                    <h5>{workExperience.company}</h5>

                    <h5>{workExperience.title}</h5>
                    <p>{workExperience.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </motion.div>
  );
};
