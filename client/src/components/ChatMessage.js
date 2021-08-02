import React, { Component } from 'react'

export default class ChatMessage extends Component{
	constructor(){
        super();
        this.state = {textColor:''}
    }

	componentDidMount() {
		//if the current user is sending the message
		if (this.props.username == this.props.sender) {
			//message will be orange
			this.setState({textColor:"orange"});
		}
		//if the remote user is sending the message
		else {
			//message will be blue
			this.setState({textColor:"blue"});
		}
	}

    render(){
        return(
            <li className={this.state.textColor}>
                <div className="user-text">{`${this.props.sender}`}</div> 
				<div className="body-text"> {`${this.props.message}`}</div>
            </li>
        )

    }
}

//ensures that the sender username and message are in string format
ChatMessage.propTypes = {
    sender: React.PropTypes.string.isRequired,
    message: React.PropTypes.string.isRequired
}
