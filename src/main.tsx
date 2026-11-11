import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "./refinements.css";
import { LanguageProvider } from "./context/LanguageContext.tsx";

const container = document.getElementById("root")!;
const tree = (
  <React.StrictMode>
    <LanguageProvider>
      <App />
    </LanguageProvider>
  </React.StrictMode>
);

// The browser snapshot includes completed animations and decorative scene nodes,
// not React's initial state. Mount fresh to avoid invalid hydration; crawlers
// and visitors without JavaScript retain the complete static snapshot.
ReactDOM.createRoot(container).render(tree);
