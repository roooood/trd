
import React, { Component } from 'react';
import autoBind from 'react-autobind';
import Context from 'library/Context';
import { t } from 'locales';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import SettingsIcon from '@material-ui/icons/Settings'
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import ChatOutlinedIcon from '@material-ui/icons/ChatOutlined';


const ColorButton = withStyles(theme => ({
    root: {
        marginTop: -3,
        color: '#fff',
        backgroundColor: '#e82944',
        '&:hover': {
            backgroundColor: '#ca152e',
        },
    },
}))(Button);

class Bottom extends Component {
    static contextType = Context;
    constructor(props) {
        super(props);
        this.state = {

        };
        autoBind(this);
    }
    chat() {
        window.ee.emit('sideBar', null, 2)
    }
    render() {
        return (
            <div style={styles.root}>
                <ColorButton variant="outlined" size="small" onClick={this.chat}  >
                    <ChatOutlinedIcon style={{ marginRight: 10, marginLeft: 10 }} fontSize="#fff" /> {t('chatSupport')}
                </ColorButton>
                <IconButton size="medium">
                    <SettingsIcon style={{ color: '#fff' }} />
                </IconButton>
            </div>
        );
    }
}
const styles = {
    root: {
        width: '100%',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0 15px'
    },

}
export default Bottom;