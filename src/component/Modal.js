import React from 'react';
import autoBind from 'react-autobind';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

class Modal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            component: null
        };
        autoBind(this);
        window.ee.on('hideModal', this.hide)
        window.ee.on('showModal', this.show)
    }
    hide() {
        this.setState({ open: false, component: null })
    }
    show(component) {
        this.setState({ open: true, component })
    }
    render() {
        return (
            <Dialog
                fullWidth={true}
                maxWidth={'md'}
                open={this.state.open}
                TransitionComponent={Transition}
                onClose={this.hide}
                className="modal"
            >
                {/* <DialogTitle id="max-width-dialog-title">Optional sizes</DialogTitle> */}
                <DialogContent>
                    {this.state.component}
                </DialogContent>
                {/* <DialogActions>
                    <Button onClick={this.hide} color="primary">
                        Close
                    </Button>
                </DialogActions> */}
            </Dialog>
        );
    }
}

export default Modal;