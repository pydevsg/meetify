import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { getPeerMessage } from '../actions'
import ChatMessage from '../components/ChatMessage'

class ChatBox extends Component {
    constructor() {
        super();
        this.state = {
            message:''
        }
    }

    // componentDidMount() {
    //     var self = this;
    // }

    /*-----SAVES TEXT AS IT IS TYPED-----*/
    handleTextAreaChange(evt) {
        this.setState({message: evt.target.value});
    }

    /*-------SEND MESSAGE------*/
    handleKeyPress(evt) {
        //enter key is pressed
        if(evt.which === 13) {
            //prevent default action
            evt.preventDefault();
            //if a peer connection has already been established
            if(this.props.p2p.conn && this.props.p2p.conn.open) {
                //stores message to be sent and which user is sending the message
                var message = { type:'peerMessage', sender: this.props.username, message:this.state.message};
                console.log('Attempting to send message...');
                //stores the messages in redux to be used in the child component
                this.props.p2p.conn.send(message);
                this.props.getPeerMessage(message);
                evt.target.value = '';
            }
        }
    }

	render(){
		return (
			<div className='chat-section'>
                <ul>
                    {
                        (this.props.messages && (this.props.messages.length > 0)) ?
                        this.props.messages.map((message,index)=>{
                            return <ChatMessage username={this.props.username} key = {index} {...message}/>
                        }) : 'No messages'
                    }
                </ul>
                
                <textarea placeholder='Type a message' rows={2} ref='messageBox' onKeyPress={this.handleKeyPress.bind(this)} onChange={this.handleTextAreaChange.bind(this)}></textarea>

            </div>
		)
	}
}

/*--------BIND REDUX STATES TO COMPONENT------*/
function mapStateToProps(state) {
    return {
        messages:state.chatMessages,
        username: state.username,
        p2p:state.p2p
    }
}

/*------BIND REDUX ACTIONS TO COMPONENT--------*/
function matchDispatchToProps(dispatch) {
    return bindActionCreators({
        getPeerMessage
    }, dispatch);
}

export default connect(mapStateToProps,matchDispatchToProps)(ChatBox);
