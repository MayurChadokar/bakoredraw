import React, { Component } from "react";
import WhiteBoard from "./components/WhiteBoard";
import axios from 'axios';
import Choose from "./components/Choose";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./App.scss";
import "./components/style.css"

import Dots from 'react-activity/lib/Dots';
import 'react-activity/lib/Dots/Dots.css';


var email = ''
var room = ''

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			email: "",
			typingEmail: "",
			room: "",
			typingRoom: "",
			admin:'',
			loading:true, 
			authResponse:'',
			error:false, 
			user:'',
			errorText:'',
			id:''
		};
		
	}
	
	async componentWillMount(prevState) {
		// Do not auto-login from localStorage if the user just visits the root URL.
		// Session will be restored via URL parameters in componentDidMount instead.
	};
	componentDidMount() {
		let deferredPrompt;
		
		
			window.addEventListener('beforeinstallprompt', e => {
			e.preventDefault()
			deferredPrompt = e
		  })
		  
		  const btnInstallApp = document.getElementById('btn-install-app')
		  
		  if(btnInstallApp) {
			btnInstallApp.addEventListener('click', e => {
			  deferredPrompt.prompt()
			  deferredPrompt.userChoice
				.then(choiceResult => {
				  if(choiceResult.outcome === 'accepted') {
					console.log('user accepted A2HS prompt')
				  } else {
					console.log('user dismissed A2HS prompt')
				  }
				  deferredPrompt = null
				})
			  })
		  }
		const queryString = window.location.search;
		const urlParams = new URLSearchParams(queryString);
		const user = urlParams.get('user');
		const urlRoom = urlParams.get('room');
		const urlEmail = urlParams.get('email');
		room = urlRoom;
		email = urlEmail;

		let param = window.location.pathname;
		
		if(user){
			this.setState({
				room: urlRoom,
				loading:false,
				admin:false, 
				user:true,
				email: urlEmail || 'active@active.com'
			})
		} else if (urlRoom && urlEmail) {
			// Restore admin session if URL has room and email but no user parameter
			this.setState({
				room: urlRoom,
				email: urlEmail,
				loading:false,
				admin:true, 
				user:false
			});
		} else {
			this.setState({
				email:'',
				room:'',
				loading:false,
				admin:false, 
				user:false
			});
		}
	
		
	}

	setEmail = (inputName, value) => {
	
		this.setState({
			typingEmail: value
		});
	};
    setAccesskey = (inputName, value) => {
		
		this.setState({
			typingRoom: value
		});
	};
	getAuth =()=>  {
		console.log("new building - 1");
		this.setState({
			 loading:true,
			 room:this.state.typingRoom,
			 email:this.state.typingEmail
		})
		
		// Communicate directly with the WordPress backend now that CORS is fixed in .htaccess
		const apiUrl = `https://draw.bakoredraw.com/draw/wp-admin/admin-ajax.php?action=check_user&email=${this.state.typingEmail}&accesskey=${this.state.typingRoom}`;
		
		axios.get(apiUrl)
		
		  .then((res => {
			 
				
				// res =JSON.parse(res)
				
				 if(res.data.success == '1'){
					window.history.pushState({}, '', `/?room=${this.state.typingRoom}&email=${this.state.typingEmail}`);
					this.setState({
						admin:true,
						authResponse:res.data.success,
						loading:false,
						errorText:'',
						error:false
					  });
				localStorage.setItem('room',this.state.typingRoom);
				localStorage.setItem('user',this.state.typingEmail); 
				 }else if(res.data.success == '0'){
					this.setState({
				        errorText:'Invalid email or access code',
						error:true,
						loading:false
					  });
				 }else if(res.data.success == '2'){
					window.history.pushState({}, '', `/?room=${this.state.typingRoom}&email=${this.state.typingEmail}&user=true`);
					this.setState({
						admin:false,
						user:true,
						authResponse: '2',
						errorText:'',
						error:false,
						loading:false
					  });
					localStorage.setItem('room',this.state.typingRoom);
					localStorage.setItem('user',this.state.typingEmail);
				 }else{
					this.setState({
				        errorText:'Something went wrong ! Try again',
						error:true,
						loading:false
					  });
				 }
			
			 
		  })).catch((e)=>{
			  // res =JSON.parse(res)
			 
			  this.setState({
				  loading:false,
				  error:true,
				  errorText:'Something went wrong ! Try again',
			  })
		  })
		
		
		}
		
	
    logout =()=>{
		localStorage.removeItem("user");
		localStorage.removeItem("room");
		window.history.pushState({}, '', '/');
		email = '';
		room = '';
		this.setState({
			email:'',
			room:'',
			typingEmail:'',
			typingRoom:'',
			authResponse:'',
			error:'',
		})
	}
	render() {


		if(this.state.loading){
			return(
				<div style = {{display:'flex',justifyContent:'center', alignItems:'center', marginTop:'25%'}}>
					<Dots/>
				</div>
			)
		}else{
			return(
				<div id="container">
					{this.state.authResponse == '1' || (room && email)? (
						<WhiteBoard  {...this.state} logout = {this.logout}/>
					) : this.state.user ?( <WhiteBoard {...this.state}/> )
					:
					
						(<Choose
							{...this.state}
							getAuth={this.getAuth}
							setEmail={this.setEmail}
							setAccesskey={this.setAccesskey}
							error = {this.state.error}
							errorText = {this.state.errorText}
						/>)
					}
					
					</div>
				
			)
		}
		
		
			
			
		
	}
}

export default App;
