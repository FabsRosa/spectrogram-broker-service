import { useEffect, useRef } from 'react';

// Hook para usar setInterval de forma segura no React
export const useInterval = (callback, delay) => {
  const savedCallback = useRef();

  // Lembra o último callback
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Configura o intervalo
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
};