import React, { Component } from 'react'
import bg from '../assets/background.jpg';
import hi from '../assets/header.png';
export default class Register extends Component{
	
	render(){
        return(
        	<div className="bodyLogin">
        		<img className="bg_image" src={bg} alt="background"/>
            	<div className="registerForm">
            		<div className="loginWrap">
						<img className="header_image" src={hi} alt="header"/>
            			<h1>Register</h1>
			    		<div>
			    			<label>Username:</label>
			    			<input type="text" name="username_reg" onChange={this.props.username}/>
			    			<div className="errRegister">{this.props.errUser}</div>
			    		</div>
                        <div>
			    			<label>EmailID:</label>
			    			<input type="text" name="email_reg" onChange={this.props.useremail}/>
			    			<div className="errRegister">{this.props.errUser}</div>
			    		</div>
			    		<div>
			        		<label>Password:</label>
			        		<input type="password" name="password_reg" onChange={this.props.password}/>
			    		</div>
			    		<div>
			        		<button className="register_btn" onClick={this.props.submit}>Register</button>
			    		</div>
			    		<div className="loginLinkWrap">
			    			<p className="login_sentence">Already have an account?</p>
			    			<a className="login_link" onClick={this.props.switch} href='/'>Login</a>
			    		</div>
					</div>
				</div>
			</div>
        )
    }
}