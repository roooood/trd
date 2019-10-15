import React from 'react';
import autoBind from 'react-autobind';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Fade from '@material-ui/core/Fade';

class Modal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            component: null
        };
        autoBind(this);
        window.ee.on('hideModal', this.handleClose)
        window.ee.on('showModal', this.show)
    }
    handleClose() {
        this.setState({ open: false })
    }
    show(component) {
        this.setState({ open: true, component })
    }
    render() {
        return (
            <Dialog
                fullWidth={false}
                maxWidth={'md'}
                open={this.state.open}
                onClose={this.handleClose}
            >
                {/* <DialogTitle id="max-width-dialog-title">Optional sizes</DialogTitle> */}
                <DialogContent>
                    <Fade timeout={1000}>
                        <this.state.component inModal={true} />
                    </Fade>
                </DialogContent>
                {/* <DialogActions>
                    <Button onClick={this.handleClose} color="primary">
                        Close
                    </Button>
                </DialogActions> */}
            </Dialog>
        );
    }
}

export default Modal;