"use client";
import { useEffect, useState } from 'react';

export function useSafari() {
  const [isSafari, setIsSafari] = useState(false);

  useEffect(() => {
    const checkSafari = () => {
      // Detect Safari (but not Chrome, which also contains "Safari" in user agent)
      const userAgent = navigator.userAgent;
      const isSafariBrowser = /^((?!chrome|android).)*safari/i.test(userAgent);
      setIsSafari(isSafariBrowser);
    };

    checkSafari();
  }, []);

  return isSafari;
}
