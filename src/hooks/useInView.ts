import { useEffect, useRef, useState } from 'react';

interface UseInViewOptions {
  threshold?: number;
  once?: boolean; // true: 처음 한 번만 감지, false: 나갔다 들어올 때마다 갱신
}

// 요소가 화면 안에 있는지 감지
export const useInView = <T extends Element>({ threshold = 0.3, once = true }: UseInViewOptions = {}) => {
  const ref = useRef<T>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
        if (entry.isIntersecting && once) observer.disconnect();
      },
      { threshold },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [threshold, once]);

  return { ref, isInView };
};
