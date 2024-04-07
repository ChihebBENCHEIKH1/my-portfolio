import React, { useState } from "react";
import { motion } from "framer-motion";

type Props = {
  title: string;
  description: string;
  technologies: string[];
  websiteURL: string;
  image: string;
  tech: string;
};

const Card: React.FC<Props> = ({
  title,
  description,
  technologies,
  websiteURL,
  image,
  tech,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="col-lg-4 col-md-6">
      <div className="journal-info">
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.9 }}
          transition={{ duration: 0.3 }}
        >
          <div
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {isHovered ? (
              <iframe
                src={websiteURL}
                className="frame-responsive"
                title="Website Preview"
              ></iframe>
            ) : (
              <img src={image} className="img-responsive" alt="img" />
            )}
          </div>

          <div className="journal-txt">
            <h4>
              <a href={websiteURL}>{title}</a>
            </h4>
            <p className="separator">
              <a href={websiteURL}>
                {description}
                <br />
              </a>
              <a href={websiteURL}>
                {" "}
                <strong>{tech} : </strong> {technologies.join(" / ")}
              </a>
            </p>
            <p className="separator"></p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Card;
