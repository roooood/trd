import React, { Component } from 'react';
import autoBind from 'react-autobind';

class Route extends Component {
    constructor(props) {
        super(props);
        this.state = {};
        autoBind(this);
    }
    render() {
        return (
            <div id="content" className={"theme-default"}>
                <header class="header">Header</header>
                <div class="holygrail-body">
                    <div class="content">Content</div>
                    <div class="nav">
                        Nav
                    </div>
                    <div class="aside">Aside</div>
                </div>
                <footer class="footer">Footer</footer>
            </div>
        );
    }
}

export default Route;