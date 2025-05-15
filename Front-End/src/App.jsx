import { useEffect } from 'react';
import Home from './pages/Home';
import Header from './components/Header';

function App() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then(reg => console.log('Service Worker registrado:', reg))
        .catch(err => console.error('Erro ao registrar SW:', err));
    }
  }, []);

  return (
    <>
      <Header />
      <Home />
    </>
  );
}

export default App;
