import { useRef } from "react";

function useDebounce(fn: Function, delay=500) {
  const refTimer = useRef<NodeJS.Timeout>();

  return function f(...args: any) {
    if (refTimer.current) {
      clearTimeout(refTimer.current);
    }
    refTimer.current = setTimeout(() => {
      fn(args);
    }, delay);
  }
}

export default useDebounce;
