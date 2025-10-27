'use client';

import React, { useState, useCallback } from 'react';
import useWindowFocus from 'use-window-focus';

export function useInstagramFollow() {
  const [hasOpenedInstagram, setHasOpenedInstagram] = useState(false);
  const [isFormUnlocked, setIsFormUnlocked] = useState(false);
  const windowFocused = useWindowFocus();

  const openInstagram = useCallback(() => {
    setHasOpenedInstagram(true);
    window.open('https://instagram.com/monalu_oficial', '_blank', 'noopener,noreferrer');
  }, []);

  const handleWindowFocus = useCallback(() => {
    if (hasOpenedInstagram && windowFocused) {
      setIsFormUnlocked(true);
    }
  }, [hasOpenedInstagram, windowFocused]);

  React.useEffect(() => {
    handleWindowFocus();
  }, [windowFocused, handleWindowFocus]);

  return {
    isFormUnlocked,
    hasOpenedInstagram,
    openInstagram,
  };
}
