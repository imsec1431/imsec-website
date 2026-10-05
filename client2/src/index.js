import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

// Bootstrap
import "bootstrap/dist/css/bootstrap.min.css";

// Redux
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import store, { persistor } from "./redux/store";

// Router
import { BrowserRouter } from "react-router-dom";

// Toast
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Auth Context
import { AuthProvider } from "./admin/context/AuthContext";
import ErrorBoundary from "./components/ErrorBoundary";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <BrowserRouter>
          <AuthProvider>
            <App />

            <ToastContainer
              position="top-right"
              autoClose={3000}
              theme="colored"
            />
          </AuthProvider>
        </BrowserRouter>
      </PersistGate>
      </Provider>
    </ErrorBoundary>
  </React.StrictMode>,
);

reportWebVitals();
