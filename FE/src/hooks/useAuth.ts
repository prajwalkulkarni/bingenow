import React from 'react';



const useAuth = (conditionCB:Function) => {

    const [val, setVal] = React.useState('');
    const [focus, setFocus] = React.useState(false);
    const [isBlurred, setIsBlurred] = React.useState(false);
    
    const isValid = conditionCB(val) && focus;
    const isInvalid = !conditionCB(val) && isBlurred;

    const onChange = (e:React.ChangeEvent<HTMLInputElement>) => setVal(e.target.value);

    const onBlurHandler = () => setIsBlurred(true);
    const onFocusHandler = () => setFocus(true)


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