import { useEffect, useState } from 'react';

enum ScreenSize {
  XS = 'XS',
  SM = 'SM',
  MD = 'MD',
  LG = 'LG',
  XL = 'XL',
}

export const Breakpoints: Record<ScreenSize, number> = {
  XS: 0,
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
};

export default function useWindowDimensions() {
  const [width, setWidth] = useState(window.innerWidth);
  const [height, setHeight] = useState(window.innerHeight);

  function handleScreenResize() {
    setWidth(window.innerWidth);
    setHeight(window.innerHeight);
  }

  useEffect(() => {
    // the timeout is an absolutely stupid workaound for a Safari PWA bug: the resize event fires before the viewport is updated, so window.innerWidth and window.innerHeight will have wrong values
    window.addEventListener('resize', () => setTimeout(handleScreenResize, 50));
    handleScreenResize();

    return () => {
      window.removeEventListener('resize', handleScreenResize);
    };
  }, []);

  return { width, height };
}
