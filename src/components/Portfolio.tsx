import { motion, useTransform } from "framer-motion"; // Added useTransform import
import { useLanguage } from "../context/LanguageContext";
import { useScroll } from "framer-motion";
import Card from "./Card";

interface Project {
  title: string;
  description: string;
  technologies: string[];
  websiteURL: string;
  image: string;
}
export const Portfolio = ({ titles }: any) => {
  const { lang } = useLanguage();
  const { scrollYProgress } = useScroll({
    offset: [0.1, 0.6],
  });
  const scale = useTransform(scrollYProgress, [0, 1], [0.5, 1]);

  return (
    <motion.div style={{ scale }}>
      <div id={titles[lang]["navBar"][3]} className="text-left paddsection">
        <section id="Portfolio">
          <div className="container">
            <div className="section-title text-center">
              <motion.h2>{titles[lang].portfolioTitle}</motion.h2>
              <motion.h3>{titles[lang].role}</motion.h3>
            </div>
          </div>

          <div className="container">
            <div className="journal-block">
              <div className="row">
                {titles[lang].projects.map((project: Project) => (
                  <Card
                    key={Math.random() * 1000}
                    title={project.title}
                    description={project.description}
                    technologies={project.technologies}
                    websiteURL={project.websiteURL}
                    image={project.image}
                    tech={titles[lang]["technologies"]}
                  />
                ))}
              </div>
            </div>
          </div>
          <div className="container" style={{ marginTop: "50px" }}>
            <div className="section-title text-center">
              <motion.h3>{titles[lang].backendProjects}</motion.h3>
            </div>
          </div>

          <div className="container">
            <div className="journal-block">
              <div
                className="row"
                style={{ alignItems: "center", justifyContent: "center" }}
              >
                {titles[lang].backendProjectsList.map((project: Project) => (
                  <Card
                    key={Math.random() * 1000}
                    title={project.title}
                    description={project.description}
                    technologies={project.technologies}
                    websiteURL={project.websiteURL}
                    image={project.image}
                    tech={titles[lang]["technologies"]}
                    isFrameVisible={false}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="container" style={{ marginTop: "50px" }}>
            <div className="section-title text-center">
              <motion.h3>{titles[lang].devopsProjects}</motion.h3>
            </div>
          </div>

          <div className="container">
            <div className="journal-block">
              <div
                className="row"
                style={{ alignItems: "center", justifyContent: "center" }}
              >
                {titles[lang].backendProjectsList.map((project: Project) => (
                  <Card
                    key={Math.random() * 1000}
                    title={project.title}
                    description={project.description}
                    technologies={project.technologies}
                    websiteURL={project.websiteURL}
                    image={project.image}
                    tech={titles[lang]["technologies"]}
                    isFrameVisible={false}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </motion.div>
  );
};
