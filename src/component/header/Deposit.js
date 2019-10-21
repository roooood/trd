import React, { Component } from 'react';
import autoBind from 'react-autobind';
import DynamicFeed from '@material-ui/icons/DynamicFeed';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { t } from '../../locales';
import Context from '../../library/Context';

import DepositModal from './DepositModal';

const ColorButton = withStyles(theme => ({
    root: {
        width: 125,
        background: 'linear-gradient(90deg,  #5C91D9, #c84169)',
        '&:hover': {

        },
    },
}))(Button);

class Deposit extends Component {
    static contextType = Context;
    constructor(props) {
        super(props);
        this.state = {
        };
        autoBind(this);
    }
    deposit() {
        let modal = this.context.app('modal');
        modal.show(<DepositModal />);
    }

    render() {
        return (
            <ColorButton onClick={this.deposit} variant="contained" color="primary" style={{ margin: 5 }}>
                <DynamicFeed style={{ marginRight: 10 }} /> {t('deposit')}
            </ColorButton>
        );
    }
}
const styles = {

}
export default Deposit;