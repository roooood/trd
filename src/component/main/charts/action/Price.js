import React, { Component } from 'react';
import autoBind from 'react-autobind';
import Context from '../../../../library/Context';
import { t } from '../../../../locales';
import Typography from '@material-ui/core/Typography';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import HelpIcon from '@material-ui/icons/Help';



class Price extends Component {
    static contextType = Context;
    constructor(props) {
        super(props);
        this.state = {
            value: 1
        };
        autoBind(this);
    }
    up() {
        this.setState({ value: this.state.value + 1 });
    }
    down() {
        if (this.state.value > 1)
            this.setState({ value: this.state.value - 1 })
    }
    render() {
        return (
            <div style={styles.root}>
                <div style={styles.info} >
                    <Typography variant="button" display="block" style={styles.color}>
                        {t('amount')}
                    </Typography>
                    <HelpIcon style={{ ...styles.color, fontSize: 14 }} />
                </div>
                <div style={styles.display} >
                    <AttachMoneyIcon style={{ ...styles.color, fontSize: '1.9em', marginRight: 10 }} />
                    <input type="text" style={styles.input} value={this.state.value} />
                </div>
                <div style={styles.picker} >
                    <RemoveIcon onClick={this.down} style={styles.color} />
                    <div style={styles.diver} />
                    <AddIcon onClick={this.up} style={styles.color} />
                </div>
            </div>
        );
    }
}
const styles = {
    root: {
        background: 'rgba(255,255,255,.1)',
        padding: 5,
        borderRadius: 5,
        cursor: 'pointer',
    },
    info: {
        width: '100%',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    color: {
        color: '#b5b5b5'
    },
    display: {
        display: 'flex',
        alignItems: 'center',
    },
    picker: {
        borderTop: '1px solid #111',
        display: 'flex',
        justifyContent: 'space-around',
        height: 25,
        alignItems: 'center',
        paddingTop: 5
    },
    diver: {
        borderLeft: '1px solid #111',
        height: '80%',
        width: 1,
    },
    input: {
        background: 'transparent',
        border: 0,
        color: '#fff',
        fontSize: '1.6em',
        padding: 0,
        marginTop: 5
    }
}
export default Price;