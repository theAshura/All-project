/* APP
   ========================================================================== */

import "assets/styles/reset.css";
import "assets/styles/global.css";
import "services/i18n";

import { BrowserRouter, useRoutes } from "react-router-dom";
import store, { Provider } from "store";
import ErrorBoundary from "containers/error-boundary/error-boundary";
import { reload } from "utils/functions";
import message from "antd/es/message";
import routes from "routes";
import "antd/dist/reset.css";
import "./assets/css/root.scss";
import "./App.scss";
import { useEffect } from "react";

/**
 * Entry point for route component
 * @returns JSX Element represents for route components
 */
const Main = () => {
  useEffect(() => {
    message.config({
      top: 25,
      duration: 2,
      maxCount: 1,
    });
  }, []);
  const element = useRoutes(routes);
  return element;
};

/**
 * Entry point for App
 * @returns JSX Element represents for app
 */
const App = () => {
  return (
    <ErrorBoundary onReset={reload}>
      <BrowserRouter>
        {/* <ThemesProvider> */}
        <Provider store={store}>
          <Main />
        </Provider>
        {/* </ThemesProvider> */}
      </BrowserRouter>
    </ErrorBoundary>
  );
};

export default App;
