const debounce = <T extends (...args: any[]) => void>(fn: T, delay: number = 500) => {
  let timer: NodeJS.Timeout;

  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn(...args);
    }, delay);
  };
};

export default debounce;
