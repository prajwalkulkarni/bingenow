import React from 'react'
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
    props,
    ref,
) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

type SnackbarProps = {
    open:boolean,
    handleClose:(event: Event | React.SyntheticEvent<any, Event>, reason: string) => void,
    message:string,
    severity:'success'|'error'|'info'|'warning'
}
const SnackbarExtended:React.FC<SnackbarProps> = (props) => {

    
    const {open,handleClose,message,severity} = props
    
    return(
        <Snackbar open={open} autoHideDuration={6000}
                    onClose={handleClose}
                    anchorOrigin={{ horizontal: 'center', vertical: 'top' }}>
                    <Alert severity={severity} sx={{ width: '100%' }}>
                       {message}
                    </Alert>
        </Snackbar>
    )
}

export default React.memo(SnackbarExtended)