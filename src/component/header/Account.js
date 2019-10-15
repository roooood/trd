import React, { Component } from 'react';
import autoBind from 'react-autobind';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Menu from '@material-ui/core/Menu';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { t } from '../../locales';
import Context from '../../library/Context';

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
class Account extends Component {
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
            <>
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
            </>
        );
    }
}
const styles = {

}
export default Account;