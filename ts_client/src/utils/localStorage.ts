export const storeKey = (key: string, val: any): void => {
    const valueToStore = typeof val === 'object' && val !== null
      ? JSON.stringify(val)
      : val;
    localStorage.setItem(key, valueToStore);
  };
  
  export const getKey = (key: string): any => {
    const item = localStorage.getItem(key);
    if (!item) return null;
  
    try {
      return JSON.parse(item);
    } catch (e) {
      return item;
    }
  };
  