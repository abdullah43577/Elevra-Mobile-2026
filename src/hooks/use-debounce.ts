import { useEffect, useState } from "react";

export function useDebounce<T>(value: T, delay = 400): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timeout); // cancel if value changes before delay finishes
  }, [value, delay]);

  return debouncedValue;
}
