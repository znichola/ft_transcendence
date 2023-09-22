import { useState, useEffect } from "react";

export const useIntersection = (
  element: React.MutableRefObject<undefined>,
  rootMargin: string,
): boolean => {
  const [isVisible, setState] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setState(entry.isIntersecting);
      },
      { rootMargin },
    );

    element.current && observer.observe(element.current);

    return () => {
      if (element.current) {
        observer.unobserve(element.current);
      }
    };
  }, [element, rootMargin]);

  return isVisible;
};
