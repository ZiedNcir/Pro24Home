import { useState } from 'react';

const useToggle = (initialState: boolean): [boolean, () => void] => {
    const [value, setValue] = useState<boolean>(initialState);
    const toggle = () => setValue(_value => !_value);

    return [value, toggle];
};

export default useToggle;
