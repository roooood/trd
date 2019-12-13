import React, { Component } from 'react';

class Timer extends Component {
    constructor(props) {
        super(props);
        this.state = { curTime: null };
    }
    componentDidMount() {
        setInterval(() => {
            let cd = new Date();
            this.setState({ curTime: cd.getFullYear() + "." + (cd.getMonth() + 1) + "." + cd.getDate() + " " + cd.getHours() + ":" + cd.getMinutes() + ":" + cd.getSeconds() });
        }, 1000);
    }
    render() {
        return (
            <div>{this.state.curTime}</div>
        );
    }
}

export default Timer;