
import React, { Component } from "react";
import companyLogo from './download.png';
import cancle from './cancle.png'
import slider from './slider.png'
import logout from './logout.png'
import RangeSlider from 'react-bootstrap-range-slider';
import {Form, Row, Col,  } from 'reactstrap'

export  class Setting extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            visible:false
         }
    }
    toggler_detail = () => {
        this.setState((prevState) => {
			return {
				visible: !prevState.visible
			};
		});
	}
    copyCodeToClipboard = () => {
        const el = this.input
       
		el.select()
		document.execCommand("copy")
      }
      handleInput(e) {
       
    }
    render(){
       
        
            

return(
<div style={{position:'relative', background:'white', height:'100vh',overflowY: 'scroll'}}>
<header className="header container-fluid">
	<div className="container">
	<div className="row align-center top-row my-2">
			<div className="col-md-6 col-6">
				<img src="drawlogo.png" className="img-fluid logo"/>
			</div>
			<div className="col-md-6 col-6 text-right">
				<div className="setting">
					<a  onClick = {this.props.toggler_setting} >
						<img src={cancle} className="img-fluid"/>
						<h4>BACK</h4>
					</a>
				</div>
			</div>
		</div>
	</div>
</header>
<div className="copy-clipboard container-fluid">



	<div className="container">
		
		<div className="row copy">
			<div className="col-sm-12">
				<div className="logout_refresh_button_section">
					<button className="refresh_buttton"  onClick = {this.props.onRefresh}>Refresh</button>
					{/* <button className="logout_button" onClick = {this.props.save}>save</button>
					<input
						type="file"
						id="load"
						name="avatar"
						accept="image/png"
						onChange={(e) =>
							this.props.load()
						}
					></input> */}
				</div>
				<div className="dflex justify-content-between align-items-center my-2">
					<input  ref={(input) => this.input = input}	
                name="link"
                placeholder=""
                // disabled
                defaultValue={'https://bakoredraw.com?room='+this.props.room+'&user='+true}
                // defaultValue={'http://192.168.1.95:3000?room='+this.props.room+'&user='+true}
                />
					<button className="copyBtn"  onClick = {() => this.copyCodeToClipboard()}>Copy</button>
				</div>
				<p className="url_link_deatils">Copy and send link to your sender assistant</p>
				<div className="user_details_section">
					<p onClick = {this.toggler_detail} className="user_details_button"> User Details {"> > > >"}<br/>
					<div  className= {this.state.visible?'fadeIn':'fadeOut'}  >
						<p className="email_id">Email Id: {this.props.id}</p>
						<p className="license_key">Your license key: {this.props.room}</p>
                        {/* <h1 className='email_id'>Email:{this.props.id}</h1>
                        <h1 className='license_key'>Access Key:{this.props.room}</h1> */}
					</div>
					</p>
				</div>
			</div>
		</div>
		<div className="row pen-color align-center color-code-wrapper">
			<div className="col-sm-12">
				<div className="dflex">
				<h4>Pen Color</h4>
					<ul>
					
					<li><button value = {"#000000"} style={{backgroundColor:" #000000"}}
                     onClick={e => this.props.selectColor(
                        // e.target.name,
                        e.target.value
                    )} 
                    ></button></li>
					<li><button value = {"#ffffff"} style={{backgroundColor:" #ffffff"}}
                     onClick={e => this.props.selectColor(
                        // e.target.name,
                        e.target.value
                    )} 
                    ></button></li>
					<li><button value = {"#0c29c2"} style={{backgroundColor:" #0c29c2"}}
                     onClick={e => this.props.selectColor(
                        // e.target.name,
                        e.target.value
                    )} 
                    ></button></li>
					<li><button value = {"#fffb00"} style={{backgroundColor:"#fffb00"}}
                     onClick={e => this.props.selectColor(
                        // e.target.name,
                        e.target.value
                    )} 
                    ></button></li>
					<li><button value = {"#29c207"} style={{backgroundColor:" #29c207"}}
                     onClick={e => this.props.selectColor(
                        // e.target.name,
                        e.target.value
                    )} 
                    ></button></li>
					<li><button value = {"#ff8800"} style={{backgroundColor:" #ff8800"}}
                     onClick={e => this.props.selectColor(
                        // e.target.name,
                        e.target.value
                    )} 
                    ></button></li>
                    <li><button value = {"#f80203"} style={{backgroundColor:" #f80203"}} 
                    onClick={e => this.props.selectColor(
                        // e.target.name,
                        e.target.value
                       
                    )} 
                    
                    ></button></li>
				</ul>
			</div>
			</div>
		</div>
		<div className="row pen-color align-center color-code-wrapper">
			<div className="col-sm-12">
				<div className="dflex">
					<h4>Background Color</h4>
					<ul>
					
                    <li><button value = {"#000000"} style={{backgroundColor:" #000000"}}
                     onClick={e => this.props.selectBoardColor(
                        // e.target.name,
                        e.target.value
                    )} 
                    ></button></li>
					<li><button value = {"#ffffff"} style={{backgroundColor:" #ffffff"}}
                     onClick={e => this.props.selectBoardColor(
                        // e.target.name,
                        e.target.value
                    )} 
                    ></button></li>
					<li><button value = {"#0c29c2"} style={{backgroundColor:" #0c29c2"}}
                     onClick={e => this.props.selectBoardColor(
                        // e.target.name,
                        e.target.value
                    )} 
                    ></button></li>
					<li><button value = {"#fffb00"} style={{backgroundColor:"#fffb00"}}
                     onClick={e => this.props.selectBoardColor(
                        // e.target.name,
                        e.target.value
                    )} 
                    ></button></li>
					<li><button value = {"#29c207"} style={{backgroundColor:" #29c207"}}
                     onClick={e => this.props.selectBoardColor(
                        // e.target.name,
                        e.target.value
                    )} 
                    ></button></li>
					<li><button value = {"#ff8800"} style={{backgroundColor:" #ff8800"}}
                     onClick={e => this.props.selectBoardColor(
                        // e.target.name,
                        e.target.value
                    )} 
                    ></button></li>
                    <li><button value = {"#f80203"} style={{backgroundColor:" #f80203"}} 
                    onClick={e => this.props.selectBoardColor(
                        // e.target.name,
                        e.target.value
                       
                    )} 
                    
                    ></button></li>
					</ul>
				</div>
			</div>
		</div>
        <div className="row pen-color align-center color-code-wrapper">
			<div className="col-sm-12">
				<div className="dflex">
				<h4> Current Pen Color</h4>
					<ul>
					
					<li><button value = {"#000000"} style={{backgroundColor:this.props.currentColor}}
                    
                    
                    ></button></li>
					
				</ul>
			</div>
			</div>
		</div>
        <div className="row pen-color align-center color-code-wrapper">
			<div className="col-sm-12">
				<div className="dflex">
				<h4>Current Background Color</h4>
					<ul>
					
					<li><button value = {"#000000"} style={{backgroundColor:this.props.currentBoardColor}}
                    
                    
                    ></button></li>
					
				</ul>
			</div>
			</div>
		</div>
		<div className="row pen-size align-center ">
			<div className="col-sm-12">
				<div className="dflex">
					<h4>Pen Size</h4>
					<form>
						<div className="form-group">
	   						<div className="pwyw-container">
	 							<input id="pwyw-input" className="pwyw-input"  type="range" 
                                name = 'currentSize'
                                onChange={(e) =>
                                    this.props.selectPen(
                                        e.target.name,
                                        e.target.value
                                    )
                                }
                                min="2" max="10"
                                value={this.props.currentSize}/>
	 							<label id="pwyw-label" className="pwyw-label">{this.props.currentSize}</label>
							</div>
	  					</div>
					</form>
				</div>
			</div>
		</div>
        
		<div className="row instructions">
			<div className="col-sm-12">
				<h3>Instructions</h3>
				<ul>
					<li>
						<a href = 'https://vimeo.com/515750387/27aa83951c' target="_blank">Video</a>
						<p>How to install the app on your phone </p>
					</li>
					<li>
						<a href = 'https://vimeo.com/515752278/823693e3db' target="_blank">Video</a>
						<p>Introduction</p>
					</li>
					<li>
						<a href = 'https://vimeo.com/515781095/85557a22cf' target="_blank">Video</a>
						<p>Basic opertaion of the app</p>
					</li>
					<li>
						<a href = 'https://vimeo.com/515782081/be645d7c4d' target="_blank">Video</a>
						<p>Presantation & Tips</p>
					</li>
					<li>
						<a href = 'https://vimeo.com/516071773/3a7847c75f' target="_blank">Video</a>
						<p>Erasable “DRY” board</p>
					</li>
				</ul>
			</div>
		</div>

		
	
		<footer className="footer">
			<div className="container">
				<div className="row">
					<div className="col-sm-12">
						<p className="footer_p">Join <a href="https://www.facebook.com/groups/274126977674338" target="_blank">BakoreDRAW Facebook Page</a> for Draw tips and updates</p>
					</div>
				</div>
				<div className="row align-center">
					<div className="col-md-8 col-8 footer_bottom">
						<p>&copy; 2021 Copyright Bakore Magic. All Rights Reserved.</p>
					</div>
					<div className="col-md-4 col-4 text-right">
						<a href="https://www.bakoremagic.com " target="_blank">
							<img  src="bakore_logo2.png" className="img-fluid" width="100"/>
						</a>
					</div>
				</div>
			</div>
		</footer>
	</div>
</div>
</div>
  
        )
    }
    
}
export default Setting;
