import { t, useI18n } from "./i18n";

function App() {
  const { languages, langCode, setLanguage } = useI18n();

  return (
    <div>
      <p>{t("messages.hello")}</p>
      <select value={langCode} onChange={(e) => setLanguage(e.target.value)}>
        {languages.map(({ code, label }) => (
          <option key={code} value={code}>
            {label}
          </option>
        ))}
      </select>
    </div>
  );
}

export default App;
