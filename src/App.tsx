import { lazy, Suspense } from 'react';
import './i18n';
import Loader from 'components/Loader';
import './assets/scss/main.scss';

const Game = lazy(() => import('view/Game'));

const App = () => {
  return (
    <Suspense fallback={<Loader />}>
      <Game />
    </Suspense>
  );
};

export default App;
