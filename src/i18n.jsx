import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import fallbackLangData from "./locales/en.json";

const isDevelopment = import.meta.env.DEV;

const defaultLang = { code: "en", label: "English" };

const languages = [
  defaultLang,
  ...[
    { code: "pt-BR", label: "Português (Brasil)" },
    { code: "es", label: "Español" },
    { code: "ar", label: "العربية", rtl: true },
  ],
];

const TEST_LANG_CODE = "__test__";
if (isDevelopment) {
  languages.unshift(
    { code: TEST_LANG_CODE, label: "test language" },
    {
      code: `${TEST_LANG_CODE}.rtl`,
      label: "\u{202a}test language (rtl)\u{202c}",
      rtl: true,
    }
  );
}

let currentLang = defaultLang;
let currentLangData = {};

const findPartsForData = (data, parts) => {
  for (let index = 0; index < parts.length; ++index) {
    const part = parts[index];
    if (data[part] === undefined) {
      return undefined;
    }
    data = data[part];
  }
  if (typeof data !== "string") {
    return undefined;
  }
  return data;
};

export const t = (path, replacement = null, fallback = null) => {
  if (currentLang.code.startsWith(TEST_LANG_CODE)) {
    const name = replacement
      ? `${path}(${JSON.stringify(replacement).slice(1, -1)})`
      : path;
    return `\u{202a}[[${name}]]\u{202c}`;
  }

  const parts = path.split(".");
  let translation =
    findPartsForData(currentLangData, parts) ||
    findPartsForData(fallbackLangData, parts) ||
    fallback;
  if (!translation) {
    const errorMessage = `Can't find translation for ${path}`;
    // in production, don't blow up the app on a missing translation key
    if (!isDevelopment) {
      console.warn(errorMessage);
      return "";
    }
    throw new Error(errorMessage);
  }

  if (replacement) {
    for (const key in replacement) {
      translation = translation.replace(`{{${key}}}`, String(replacement[key]));
    }
  }
  return translation;
};

const I18nContext = createContext();

export const I18nProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [langCode, setLangCode] = useState(() => {
    const storedLang = localStorage.getItem("lang");
    return storedLang || defaultLang.code;
  });

  useEffect(() => {
    const updateLang = async () => {
      setIsLoading(true);

      currentLang =
        languages.find((lang) => lang.code === langCode) || defaultLang;
      document.documentElement.dir = currentLang.rtl ? "rtl" : "ltr";
      document.documentElement.lang = currentLang.code;

      if (langCode.startsWith(TEST_LANG_CODE)) {
        currentLangData = {};
      } else {
        try {
          currentLangData = await import(`./locales/${currentLang.code}.json`);
        } catch (error) {
          console.error(`Failed to load language ${langCode}:`, error.message);
          currentLangData = fallbackLangData;
        }
      }

      localStorage.setItem("lang", langCode);

      setTimeout(() => setIsLoading(false), 100);
    };

    updateLang();
  }, [langCode]);

  return (
    <I18nContext.Provider
      value={{
        t,
        langCode: currentLang.code,
        languages,
        setLanguage: useCallback(
          (lang) => {
            setLangCode(lang);
          },
          [setLangCode]
        ),
      }}
    >
      {!isLoading && children}
    </I18nContext.Provider>
  );
};

export const useI18n = () => useContext(I18nContext);