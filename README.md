# React i18n Example

This is a simple example of how to implement internationalization (i18n) in a React application without library, using only context and hooks. The project demonstrates how to switch between different languages and handle right-to-left (RTL) languages.

## Getting Started

### Prerequisites

- Node.js
- npm or yarn

### Installation

1. Clone the repository:

   ```sh
   git clone https://github.com/leandrocervant/react-i18n.git
   cd react-i18n
   ```

2. Install dependencies:
   ```sh
   npm install
   # or
   yarn install
   ```

### Running the Application

To start the development server, run:

```sh
npm run dev
# or
yarn dev
```

## Project Details

### i18n Implementation

The i18n functionality is implemented in the src/i18n.jsx file. It uses React's context and hooks to provide translation capabilities throughout the application.

### Key Functions and Components

- `I18nProvider`: A context provider that manages the current language and provides translation functions to the rest of the app.
- `useI18n`: A custom hook that provides access to the i18n context.
- `t`: A function that translates a given key into the current language.

### Example Usage

In the `App.jsx` file, the `useI18n` hook is used to access the current language and the t function to translate text.

```jsx
import { t, useI18n } from "./i18n";
import "./App.css";

function App() {
  const { languages, langCode, setLanguage } = useI18n();
  return (
    <div className="App">
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
```

And in the `index.jsx` file, the `I18nProvider` wraps the `App` component.

```jsx
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
```

Language files are located in the src/locales directory.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.
