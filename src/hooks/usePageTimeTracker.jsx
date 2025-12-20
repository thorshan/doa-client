import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

const usePageTimeTracker = (onTimeUpdate) => {
  const location = useLocation();
  const startTimeRef = useRef(null);
  
  useEffect(() => {
    startTimeRef.current = Date.now();

    return () => {
      const endTime = Date.now();
      const timeSpentMs = endTime - startTimeRef.current;
      const path = location.pathname;

      if (onTimeUpdate) {
        onTimeUpdate(path, timeSpentMs);
      }
    };
  }, [location.pathname, onTimeUpdate]); 
};

export default usePageTimeTracker;