import React, { Component } from 'react';
import autoBind from 'react-autobind';
import DynamicFeed from '@material-ui/icons/DynamicFeed';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import { green, purple } from '@material-ui/core/colors';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Grid from '@material-ui/core/Grid';
import { t } from '../locales';
import Context from '../library/Context';

const options = [
    'Show some love to Material-UI',
    'Show all notification content',
    'Hide sensitive notification content',
    'Hide all notification content',
];
const ColorButton = withStyles(theme => ({
    root: {
        color: theme.palette.getContrastText(purple[500]),
        height: '100%',
        background: 'linear-gradient(90deg, #525a69, #898dda)',
        '&:hover': {
            backgroundColor: purple[700],
        },
    },
}))(Button);

const StyledMenu = withStyles({
    paper: {
        border: '1px solid #d3d4d5',
    },
})(props => (
    <Menu
        elevation={0}
        getContentAnchorEl={null}
        anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
        }}
        transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
        }}
        {...props}
    />
));
class Deposit extends Component {
    constructor(props) {
        super(props);
        this.state = {
            help: null,
            stateselectedIndex: 1
        };
        autoBind(this);
    }
    openHelp(event) {
        this.setState({ help: event.currentTarget })
    }
    closeHelp() {
        this.setState({ help: null })
    }
    render() {
        return (
            <Grid container justify="space-between" style={{ height: '100%' }}>
                <List disablePadding={true} component="div" aria-label="Device settings">
                    <ListItem
                        button
                        aria-haspopup="true"
                        aria-controls="lock-menu"
                        aria-label="when device is locked"
                        onClick={this.openHelp}
                        className="list-item"
                    >
                        <ListItemText className="account" primary={t('practiceAccount')} secondary={"$ 20,000"} />
                    </ListItem>
                </List>
                <StyledMenu
                    open={Boolean(this.state.help)}
                    anchorEl={this.state.help}
                    onClose={this.closeHelp}
                >
                    <div style={{ width: 400, height: 400 }} />
                </StyledMenu>

                <ColorButton variant="contained" color="primary">
                    <DynamicFeed style={{ marginRight: 20 }} /> {t('deposit')}
                </ColorButton>
            </Grid>
        );
    }
}
const styles = {
    root: {
        flexGrow: 1,
    },
    dir: {
        display: 'flex',
        margin: 10,
        borderRadius: 10,
        position: 'relative',
    },
}
export default Deposit;