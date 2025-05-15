import { useState, useEffect, useRef } from 'react';
import Home from './pages/Home';
import Header from './components/Header'

function App() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./public/sw.js')
        .then(reg => console.log('Service Worker registrado:', reg))
        .catch(err => console.error('Erro ao registrar SW:', err));
    });
  }  
  return (
      <>
      <Header />
       <Home />
      </>
  )
}

export default App;
