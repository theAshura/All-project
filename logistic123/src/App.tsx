import { FC, useEffect } from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { Router } from 'react-router';
import { Slide, ToastContainer } from 'react-toastify';
import store from 'store';
import history from './helpers/history.helper';
import RootLayout from './layout/RootLayout';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
import 'antd/dist/antd.css';
import 'assets/css/utilities/index.scss';
import '../node_modules/react-grid-layout/css/styles.css';
import '../node_modules/react-resizable/css/styles.css';

const App: FC = () => {
  useEffect(() => {
    window.addEventListener('error', (e) => {
      if (
        e.message.includes('Loading chunk') ||
        e.message.includes('Loading CSS chunk')
      ) {
        window.location.reload();
      }
    });
  }, []);

  return (
    <>
      <Provider store={store.store}>
        <PersistGate persistor={store.persistor}>
          <Router history={history}>
            <RootLayout />
          </Router>
        </PersistGate>
      </Provider>
      <ToastContainer hideProgressBar position="top-right" transition={Slide} />
    </>
  );
};

export default App;
