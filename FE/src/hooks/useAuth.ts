import React,{useCallback} from 'react';



const useAuth = (conditionCB:Function) => {

    const [val, setVal] = React.useState('');
    const [focus, setFocus] = React.useState(false);
    const [isBlurred, setIsBlurred] = React.useState(false);
    
    const isValid = conditionCB(val);
    const isInvalid = !conditionCB(val) && isBlurred;

    const onChange = useCallback((e:React.ChangeEvent<HTMLInputElement>) => setVal(e.target.value),[]);

    const onBlurHandler = useCallback(() => setIsBlurred(true),[]);
    const onFocusHandler = useCallback(() => setFocus(true),[])


    return {
        val,
        isValid,
        isInvalid,
        onBlurHandler,
        onFocusHandler,
        onChangeHandler: onChange
    }

}

export default useAuth;