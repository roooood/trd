import React, { Component } from "react";
import ChatBubble from "./chat/ChatBubble";
import Context from 'library/Context';
import autoBind from 'react-autobind';

class Chat extends Component {
  static contextType = Context;
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
    };
    autoBind(this);
  }
  componentDidMount() {
    this.context.game.register('message', this.recieveMessage);
    this.context.game.send({ get: 'Messages' });
  }
  handleNewMessage(text) {
    this.context.game.send({ message: text });
  }
  recieveMessage(msg) {
    this.setState({
      messages: [...this.state.messages, ...msg]
    }, () => {
      setTimeout(() => {
        this.chat.scrollToBottom();
      }, 500);
    });
  }
  render() {
    return (
      <div style={styles.root} className="swing-in-top-fwd" >
        <ChatBubble
          ref={ref => this.chat = ref}
          messages={this.state.messages}
          onNewMessage={this.handleNewMessage}
        />
      </div>
    );
  }
}
const styles = {
  root: {
    flexGrow: 1,
    padding: 7
  }

}
export default Chat;