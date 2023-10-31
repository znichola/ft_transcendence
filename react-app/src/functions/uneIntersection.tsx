import { useState, useEffect } from "react";

export const useIntersection = (
  element: React.MutableRefObject<null>,
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

    const cur = element.current;

    cur && observer.observe(cur);

    return () => {
      if (cur) {
        observer.unobserve(cur);
      }
    };
  }, [element, rootMargin]);

  return isVisible;
};
