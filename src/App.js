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
		 email = await localStorage.getItem('user');
		 room = await localStorage.getItem('room');
	
		
		if (email && room) {
		
		
		  this.setState({ 
			  room: room,
			  email:email,
			  loading:false,
			 });
		} else {
		  this.setState({ 
			room: '',
			email:'',
			loading:false
		   });
		}
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

 const user = urlParams.get('user')
// const user = true
 room = urlParams.get('room')

		let param = window.location.pathname;
		
		if(user){
			
			this.setState({
				room:room,
				loading:false,
				admin:false, 
				user:true,
				email:'active@active.com'
			})
		}else {
			
			

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
		this.setState({
			 loading:true,
			 room:this.state.typingRoom,
			 email:this.state.typingEmail
		})
		
		const apiUrl ='https://bakoredraw.com/draw/wp-admin/admin-ajax.php?action=check_user&email='+this.state.typingEmail+'&accesskey='+this.state.typingRoom;
		
		
		axios.get(apiUrl)
		
		  .then((res => {
			 
				
				// res =JSON.parse(res)
				
				 if(res.data.success == '1'){
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
					this.setState({
				        errorText:'User has already downloaded maximum time',
						error:true,
						loading:false
					  });
				 }else{
					this.setState({
				        errorText:'Some thing went wrong ! Try again',
						error:true,
						loading:false
					  });
				 }
			
			 
		  })).catch((e)=>{
			  // res =JSON.parse(res)
			 
			  this.setState({
				  loading:false,
				  error:true,
				  errorText:'Some thing went wrong ! Try again',
			  })
		  })
		
		
		}
		
	
    logout =()=>{
		localStorage.removeItem("user");
		localStorage.removeItem("room");
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
