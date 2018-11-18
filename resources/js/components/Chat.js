import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import { connect } from 'react-redux';
import { setMessage, sendMessageTo } from './../actions/messageActions';
import { fetchConversationWith, addLocalMsgToConversation } from './../actions/conversationActions';


class Chat extends Component {
    constructor(props) {
      super(props);

      this.updateMessage = this.updateMessage.bind(this);
      this.sendMessage = this.sendMessage.bind(this);

      this.state = {
        id: this.props.user.id === 1 ? 2 : 1
      }
    }
    componentDidMount() {
      this.props.onFetchConversationWith(this.state.id);

      Echo.private(`message-to.${this.props.user.id}`)
      .listen('MessageSent', (e) => {
          this.props.onFetchConversationWith(this.state.id);
      });
    }
    updateMessage(e) {
      this.props.onUpdateMessage(e.target.value);
    }
    sendMessage() {
      this.props.onSendMessage(this.state.id);
      this.props.onAddLocalMsgToConversation(this.props.message);
      // ?
      this.refs.input.value = '';
      this.props.onUpdateMessage('');
    }
    render() {
        let messages = this.props.conversation.map((message, index) => {
          return (
            <li key={index}>{message.body}</li>
          )
        })
        return (
          <div className="chat">
            <div className="messages">
              <ul>
                { messages }
              </ul>
            </div>
            <input ref="input" onInput={this.updateMessage} onKeyPress={e => {if(e.key === 'Enter') this.sendMessage();} } type="text"/>
            <button onClick={this.sendMessage}>Send</button>
          </div>
        );
    }
}

const mapStateToProps = state => ({
  conversation: state.conversation,
  user: state.user,
  message: state.message
});

const mapActionsToProps = {
  onUpdateMessage: setMessage,
  onSendMessage: sendMessageTo,
  onAddLocalMsgToConversation: addLocalMsgToConversation,
  onFetchConversationWith: fetchConversationWith
}

export default connect(mapStateToProps, mapActionsToProps)(Chat);
