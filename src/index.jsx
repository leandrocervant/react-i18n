import ReactDOM from "react-dom/client";
import { I18nProvider } from "./i18n";
import App from "./App";

const container = document.getElementById("root");
const root = ReactDOM.createRoot(container);

root.render(
  <I18nProvider>
    <App />
  </I18nProvider>
);
