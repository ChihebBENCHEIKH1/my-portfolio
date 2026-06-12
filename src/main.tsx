import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { LanguageProvider } from "./context/LanguageContext.tsx";

const container = document.getElementById("root")!;
const tree = (
  <React.StrictMode>
    <LanguageProvider>
      <App />
    </LanguageProvider>
  </React.StrictMode>
);

// Prerendered output (postbuild SSG) ships static HTML inside #root — hydrate it.
// Dev / first-paint without prerender → empty #root → mount fresh.
if (container.firstElementChild) {
  ReactDOM.hydrateRoot(container, tree);
} else {
  ReactDOM.createRoot(container).render(tree);
}
