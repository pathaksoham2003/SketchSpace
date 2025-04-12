import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ReactKeycloakProvider } from '@react-keycloak/web';
import keycloak from './utils/keycloak';
import { Provider } from "react-redux";
import store from './store';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <ReactKeycloakProvider authClient={keycloak} initOptions={{ onLoad: "login-required", checkLoginIframe: false }}>
    <React.StrictMode>
      <Provider store={store}>
        <App />
      </Provider>
    </React.StrictMode>
  </ReactKeycloakProvider>
);
