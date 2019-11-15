import React, { Component } from 'react';
import autoBind from 'react-autobind';
import { Scrollbars } from 'react-custom-scrollbars';
import { t } from 'locales';
import Typography from '@material-ui/core/Typography';
import CheckIcon from '@material-ui/icons/Check';
import DoneAllIcon from '@material-ui/icons/DoneAll';

import './ChatBubble.css';

class ChatBubble extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newMessage: ''
    };
    autoBind(this);
  }
  scrollToBottom() {
    this.refs.scroll.scrollToBottom();
  }
  getConversations(messages) {
    if (messages == undefined) {
      return;
    }

    const listItems = messages.map((message, index) => {
      let bubbleClass = 'me';
      let bubbleDirection = '';

      if (message.status == 'from') {
        bubbleClass = 'you';
        bubbleDirection = "bubble-direction-reverse";
      }
      return (
        <div className={`bubble-container ${bubbleDirection}`} key={index}>
          <div className="message-time" >
            {new Date(message.time).toDateString()}
            <div classname="message-status" >
              {
                message.seen == false
                  ? <CheckIcon fontSize="small" style={{ color: '#fff' }} />
                  : <DoneAllIcon fontSize="small" style={{ color: '#fff' }} />
              }
            </div>
          </div>
          <div className={`bubble ${bubbleClass}`}>{message.text}</div>

        </div>
      );
    });
    return listItems;
  }

  handleSubmit(e) {
    e.preventDefault()

    const { props: { onNewMessage }, state: { newMessage } } = this

    if (onNewMessage && newMessage) {
      onNewMessage(newMessage)
    }

    this.setState({
      newMessage: '',
    })

  }

  handleInputChange(e) {
    this.setState({
      newMessage: e.target.value,
    })
  }
  render() {
    const { props: { messages }, state: { newMessage } } = this;
    const chatList = this.getConversations(messages);

    return (
      <>
        <Typography align="center" gutterBottom > {t('chatSupport')}</Typography >
        <div className="chats">
          <Scrollbars style={{ height: '69vh' }} ref="scroll" >
            <div className="chat-list">
              {chatList}
            </div>
          </Scrollbars>
          <form
            className="new-message"
            onSubmit={this.handleSubmit}
          >
            <input
              value={newMessage}
              placeholder={t('type')}
              onChange={this.handleInputChange}
              className="new-message-input"
            />
          </form>
        </div>
      </>
    );
  }
}

export default ChatBubble;
