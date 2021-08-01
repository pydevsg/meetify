import React, { Component } from 'react';
import bg from '../assets/background.jpg';
import hi from '../assets/header.png';
export default class Login extends Component{
	
	render(){
        return(
        	<div className="bodyLogin">
				<img className="bg_image" src={bg} alt="background"/>
            	<div className="loginForm">
            		<div className="loginWrap">
            			<img className="header_image" src={hi} alt="header"/>
            			<h1>Login</h1>
						<div>
			        		<label>EMAIL</label>
			        		<input type="text" name="usermail"  onChange={this.props.usermail}/>
			        		<div className="errUsermail">{this.props.errUser}</div>
			    		</div>
			    		<div>
			        		<label>PASSWORD</label>
			        		<input type="password" name="password" onChange={this.props.password}/>
			        		<div className="errPassword">{this.props.errPass}</div>
			    		</div>
			    		<div>
			        		<button className="login_btn" onClick={this.props.submit}>Login</button>
			    		</div>
			    		<div className="registerLinkWrap">
			    			<p className="register_sentence">Don't have an account?</p>
			    			<a className="register_link" onClick={this.props.switch} href='/register'>Register</a>
			    		</div>
			    	</div>
				</div>
			</div>
        )
    }
}
