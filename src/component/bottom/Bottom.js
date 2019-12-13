
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
import FullscreenIcon from '@material-ui/icons/Fullscreen';
import FullscreenExitIcon from '@material-ui/icons/FullscreenExit';
import { connect } from 'react-redux';
import Timer from './Timer';
import Hidden from '@material-ui/core/Hidden';

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
            fullscreen: false
        };
        autoBind(this);
    }
    chat() {
        window.ee.emit('sideBar', null, 1)
    }
    changeScreen() {
        this.setState({ fullscreen: !this.state.fullscreen })
        if ((document.fullScreenElement && document.fullScreenElement !== null) ||
            (!document.mozFullScreen && !document.webkitIsFullScreen)) {
            if (document.documentElement.requestFullScreen) {
                document.documentElement.requestFullScreen();
            } else if (document.documentElement.mozRequestFullScreen) {
                document.documentElement.mozRequestFullScreen();
            } else if (document.documentElement.webkitRequestFullScreen) {
                document.documentElement.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
            }
        } else {
            if (document.cancelFullScreen) {
                document.cancelFullScreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.webkitCancelFullScreen) {
                document.webkitCancelFullScreen();
            }
        }
    }
    render() {
        let profit = this.context.state.setting.profit || 0;
        return (
            <div style={styles.root}>
                <ColorButton variant="outlined" size="small" onClick={this.chat}  >
                    <ChatOutlinedIcon style={{ marginRight: 10, marginLeft: 10, color: '#fff' }} /> {t('chatSupport')}
                </ColorButton>
                <Hidden only={['md', 'lg', 'xl']}>
                    <div style={styles.profit}>
                        <div style={styles.info} >
                            <Typography variant="button" display="block" >
                                {t('profit')}:
                            </Typography>
                        </div>
                        <div style={styles.info} >
                            <Typography display="block" style={{ color: '#25b940' }} >
                                {profit}%
                        </Typography>
                        </div>
                        {/* <div style={styles.info} >
                            <Typography variant="h5" display="block" style={{ color: this.state.state == 'up' ? '#25b940' : ' #fc155a' }} >
                                {(this.state.bet * profit / 100).toFixed(2)}$
                        </Typography>
                        </div> */}
                    </div>
                </Hidden>
                <div style={styles.actions} >
                    <div style={styles.timer}>
                        <span style={styles.span}>{t('currentTime')}:</span><Timer />
                    </div>
                    <IconButton size="medium" onClick={this.changeScreen}>
                        {this.state.fullscreen
                            ? <FullscreenIcon style={styles.icon} />
                            : <FullscreenExitIcon style={styles.icon} />
                        }
                    </IconButton>
                </div>
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
    actions: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    icon: {
        color: '#fff'
    },
    profit: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    info: {
        marginRight: 4,
        marginLeft: 4,
    },
    timer: {
        display: 'flex',
        color: '#fafafa',
        fontSize: 13,
        marginRight: 20,
        width: 230
    },
    span: {
        color: '#b5b5b5',
        marginRight: 5
    }
}
export default connect(state => state)(Bottom);