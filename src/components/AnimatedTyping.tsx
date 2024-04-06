import { useEffect } from "react";
import Typed from "typed.js";

type props = {
  infos: string[];
};
export const AnimatedTyping = ({ infos }: props) => {
  useEffect(() => {
    const options = {
      strings: infos,
      typeSpeed: 100,
      loop: true,
    };

    const typed = new Typed("#typed", options);

    return () => {
      typed.destroy();
    };
  }, []);

  return <span id="typed"></span>;
};
