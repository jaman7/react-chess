import { createRoot } from 'react-dom/client';
import { Provider } from 'mobx-react';
import Store from './store/Store';
import App from './App';
import reportWebVitals from './reportWebVitals';

const container = document.getElementById('app');
const root = createRoot(container!);
root.render(
  <Provider Store={Store}>
    <App />
  </Provider>
);

reportWebVitals();
