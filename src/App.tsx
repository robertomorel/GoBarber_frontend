import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import GlobalStyle from './styles/global';

// import { AuthProvider } from './hooks/auth';
// import { ToastProvider } from './hooks/toast';
import AppProvider from './hooks';

import Routes from './routes';

/**
 * O AuthContext.Provider vai dizer que todo o componente dentro dele terá o mesmo
 * contexto ou as mesmas informações de autenticação.
 */

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AppProvider>
        <Routes />
      </AppProvider>
      {/*
      <AuthProvider>
        <ToastProvider>
          <SignIn />
        </ToastProvider>
      </AuthProvider>
      */}

      <GlobalStyle />
    </BrowserRouter>
  );
};

export default App;
