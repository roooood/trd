import React from 'react';
import autoBind from 'react-autobind';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import { withStyles } from '@material-ui/core/styles';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const StyledModal = withStyles(theme => ({
    paper: {
        backgroundColor: '#25272b',
        color: ' #fff'
    },
}))(Dialog);
const StyledDialogContent = withStyles(theme => ({
    root: {
        padding: 10
    },
}))(DialogContent);

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
            <StyledModal
                fullWidth={true}
                maxWidth={'md'}
                open={this.state.open}
                TransitionComponent={Transition}
                onClose={this.hide}
                className="modal"
            >
                {/* <DialogTitle id="max-width-dialog-title">Optional sizes</DialogTitle> */}
                <StyledDialogContent>
                    {this.state.component}
                </StyledDialogContent>
                {/* <DialogActions>
                    <Button onClick={this.hide} color="primary">
                        Close
                    </Button>
                </DialogActions> */}
            </StyledModal>
        );
    }
}

export default Modal;