"use client";
import React, { Suspense } from "react";
import { Provider } from "react-redux";
import { LanguageProvider } from "./context/LanguageContext";
import store from "./store";
import PageLoader from "./components/loaders/pageLoader";

const Providers = ({ children }) => {
  return (
    <Provider store={store}>
      <LanguageProvider>
        <Suspense fallback={<PageLoader />}> {children}</Suspense >
      </LanguageProvider >
    </Provider >
  );
};

export default Providers;
