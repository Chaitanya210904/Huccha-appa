import React from 'react';
import { I18nProvider } from './hooks/useI18n.jsx';
import { Layout } from './layout/Layout.jsx';
import './styles/theme.css';
import './styles/print.css';

export function App() {
  return (
    <I18nProvider>
      <Layout />
    </I18nProvider>
  );
}

export default App;

