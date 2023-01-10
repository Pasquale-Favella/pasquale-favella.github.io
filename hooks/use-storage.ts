import { useEffect , useRef, useState } from "react";

const parse = (value: string) => {
    try {
      return JSON.parse(value);
    } catch {
      return value;
    }
};

export const useStorage = ( key: string , defaultValue: any ) => {

    const [value, setValue] = useState(() => defaultValue);

    const mount = useRef(false);

    useEffect(() => {

        if(mount.current) return;

        const item = localStorage.getItem(key);
        if (item) setValue(parse(item));

        mount.current = true;
    }, []);
  
    useEffect(() => {
       window.localStorage.setItem(key, JSON.stringify(value));
    }, [key, value]);
  
    return [value, setValue];
};




