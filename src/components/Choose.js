import React, { Component } from "react";
import logo from "./drawlogo.png";
import companyLogo from './bakore_logo2.png';
import { Alert } from "reactstrap";
import Swal from 'sweetalert2'

export default class Choose extends Component {
	
	render() {
		return (

<>

<header className="header border-bottom">
<div className="container">
	<div className="top_logo my-2">
		<div className="top_logo_left">
			<img src={logo} className="img-fluid"/>
		</div>
		<div className="top_logo_right">
			<a  target="_blank"href="https://www.bakoremagic.com ">
				<img src={companyLogo} className="img-fluid"/>
			</a>
		</div>
	</div>
</div>
</header>

<div className="verify_process_section">
<div className="container">

	<div className="verify_process_section_details">
	<div >{this.props.error &&<Alert color="danger">
       {this.props.errorText !== null ? this.props.errorText : 'Something went wrong ! Try again'}
       </Alert>
 	}</div> 
	 {/* <div >{this.props.error &&<p>
       {this.props.errorText !== null ? this.props.errorText : 'Something went wrong ! Try again'}
       </p>
 	}</div>  */}
		<h3>Please Verify to Process</h3>
		
		<form >
			<div className="container">
				<div className="row">
					<div className="col-lg-6 offset-lg-3 col-md-8 offset-md-2">
						<div className="row">
							<div className="col-sm-12">
								<label for="uname">Email:</label>
								  <input type="text" onKeyPress={(e) =>
								e.key === "Enter"
									? this.props.setEmail()
									: null
							}
							name="email"
							placeholder="Email"
							autoComplete="username"
							value={this.props.typing}
							onChange={(e) =>
								this.props.setEmail(
									e.target.name,
									e.target.value
								)
							} required="required"


							/>
							</div>
							<div className="col-sm-12">
								<label for="psw">Access Key:</label>
								  <input type="password" name="room"
							placeholder="Accesskey"
							autoComplete="current-password"
							onKeyPress={(e) =>
								e.key === "Enter"
									? this.props.setAccesskey()
									: null
							}
							value={this.props.typingRoom}
							onChange={(e) =>
								this.props.setAccesskey(
									e.target.name,
									e.target.value
								)
							}required="required"


							/>
							</div>
							<div className="col-sm-12 text-center my-4">
								 <button type="button" onClick={() => this.props.getAuth()} className="verify_button">Verify</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</form>
	</div>
</div>
</div>
</>
		);
	}
}
