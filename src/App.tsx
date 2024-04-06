import "./App.css";
import Navbar from "./components/NavBar";
import { textContent } from "./utils/Text";
import { Header } from "./components/Header";
import { About } from "./components/About";
import { CVDownload } from "./components/CVDownload";
import { Portfolio } from "./components/Portfolio";
import { Footer } from "./components/Footer";
import { Contact } from "./components/Contact";
import { AnimatePresence, motion } from "framer-motion";
function App() {
  return (
    <>
      <AnimatePresence>
        <motion.div
          initial="initialState"
          animate="animateState"
          exit="exitState"
          variants={{
            initialState: {
              opacity: 0.5,
              transition: {
                duration: 1,
              },
            },
            animateState: {
              opacity: 1,
              transition: {
                duration: 1,
              },
            },
            exitState: {},
          }}
        >
          <Navbar titles={textContent} />
          <Header titles={textContent} />
          <About titles={textContent} />
          <CVDownload titles={textContent} />
          <Portfolio titles={textContent} />
          <Contact titles={textContent} />
          <Footer />
        </motion.div>
      </AnimatePresence>
    </>
  );
}

export default App;
