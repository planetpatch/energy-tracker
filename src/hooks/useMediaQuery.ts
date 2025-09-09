"use client";

import { useState, useEffect } from 'react';

export const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState<boolean>(false);

  useEffect(() => {
    // Ensure this code runs only on the client
    if (typeof window !== 'undefined') {
      const media = window.matchMedia(query);
      
      const updateMatch = () => setMatches(media.matches);

      // Set the initial value
      updateMatch();

      // Listen for changes
      media.addEventListener('change', updateMatch);

      // Cleanup listener on component unmount
      return () => media.removeEventListener('change', updateMatch);
    }
  }, [query]);

  return matches;
};
