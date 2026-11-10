import { useEffect, useRef, useState } from 'react';

// 요소가 화면에 처음 들어왔는지 감지 (한 번 보이면 유지)
export const useInView = <T extends Element>(threshold = 0.3) => {
  const ref = useRef<T>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element || isInView) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [isInView, threshold]);

  return { ref, isInView };
};
