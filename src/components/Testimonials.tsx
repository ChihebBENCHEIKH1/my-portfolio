import { motion, useTransform } from "framer-motion"; // Added useTransform import
import { useLanguage } from "../context/LanguageContext";
import { useScroll } from "framer-motion";

export const Testimonials = ({ titles }: any) => {
  const { lang } = useLanguage();
  const { scrollYProgress } = useScroll({
    offset: [0.1, 0.6],
  });
  const scale = useTransform(scrollYProgress, [0, 1], [0.5, 1]);

  return (
    <motion.div style={{ scale }}>
      <div id={titles[lang]["navBar"][4]} className="text-left paddsection">
        <section id="testimonialsTitle">
          <div className="container">
            <div className="section-title text-center">
              <motion.h2>{titles[lang].testimonialsTitle}</motion.h2>
            </div>
          </div>

          <div className="container">
            <div className="journal-block">
              {titles[lang].testimonials.map((testimonial: any) => (
                <div
                  style={{
                    display: "flex",
                    gap: "40px",
                    marginBottom: "40px",
                    cursor: "pointer",
                    paddingInline: "50px",
                  }}
                >
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                  >
                    {" "}
                    <img
                      src={testimonial.img}
                      alt=""
                      style={{
                        width: "75px",
                        height: "75px",
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
                    <p style={{ margin: 0 }}>{testimonial.testimonial}</p>
                    <h6>{testimonial.name}</h6>
                    <h6>{testimonial.email}</h6>
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
