import React, { Component } from 'react';
import autoBind from 'react-autobind';
import BusinessCenter from '@material-ui/icons/BusinessCenter';

class Menu extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    render() {
        return (
            <BusinessCenter></BusinessCenter>
        );
    }
}

export default Menu;