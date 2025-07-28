import React, { Component } from "react";
import { CirclePicker ,SketchPicker} from "react-color";

import { Container , Modal,ModalHeader, ModalBody, ModalFooter, Button, FormGroup,Label, Input, Col, Row } from "reactstrap";

import RangeSlider from 'react-bootstrap-range-slider';
import Setting from "./setting";
import { isMobile } from "react-device-detect";

export default class ColorSelector extends Component {
	constructor(props) {
		super(props);
		this.state = {
			toggle: false,
			toggle_set:false
		};
	}

	componentDidMount() {
		//remove when live
		//this.toggleFullScreen();
	}
    copyCodeToClipboard = () => {
		const el = this.input
		el.select()
		document.execCommand("copy")
	  }
	toggleFullScreen = () => {
		if (
			window.innerWidth < 800 &&
			!window.screenTop &&
			!window.screenY &&
			!/iPhone|iPad|iPod/i.test(navigator.userAgent)
		) {
			let doc = window.document;
			let docEl = doc.documentElement;

			let requestFullScreen =
				docEl.requestFullscreen ||
				docEl.mozRequestFullScreen ||
				docEl.webkitRequestFullScreen ||
				docEl.msRequestFullscreen;
			let cancelFullScreen =
				doc.exitFullscreen ||
				doc.mozCancelFullScreen ||
				doc.webkitExitFullscreen ||
				doc.msExitFullscreen;

			if (
				!doc.fullscreenElement &&
				!doc.mozFullScreenElement &&
				!doc.webkitFullscreenElement &&
				!doc.msFullscreenElement
			) {
				requestFullScreen.call(docEl);
			} else {
				cancelFullScreen.call(doc);
			}
		}
	};

	toggler = (e) => {
		e.preventDefault();
		this.setState((prevState) => {
			return {
				toggle: !prevState.toggle
			};
		});
	};
    toggler_setting = () => {
        this.setState((prevState) => {
			return {
				toggle_set: !prevState.toggle_set
			};
		});
	}
	render() {
		const { toggle, toggle_set } = this.state;
		const {admin} = this.props
		
		// console.log('poprs in colorselector', this.props.admin, admin, this.props)
		return (
			<>
			<Container >
			<div className="button-container">
			
				<div className="clear" style={isMobile ? {position: 'fixed',bottom:'5%'}:{position: 'fixed',bottom:'5%', right:'50%'} }>
					<button onClick= {this.props.clearBoard}></button>
				</div>
				<div className= "backpress"   style={isMobile ? {position: 'fixed',bottom:'5%',left: '10%',}:{position: 'fixed',bottom:'5%',left: '34%',}}>
				    <button onClick= {this.props.clearOneLine}>{this.props.admin}</button>
				
				</div>
				
				<div className='settingpress' style={isMobile ? {position: 'fixed',bottom:'5%',right: '10%',}:{position: 'fixed',bottom:'5%',right: '36%',}}>
					<button onClick = {this.toggler_setting} ></button>
				</div>
				
				
				
			</div>
			
			</Container>
			{
				toggle_set && <Setting  
				{...this.props}
				currentColor={this.props.currentColor}
				selectColor={this.props.selectColor}
				selectBoardColor = {this.props.selectBoardColor}
				currentBoardColor = {this.props.currentBoardColor}
				currentSize = {this.props.currentSize}
				selectPen = {this.props.selectPen}
				toggler_setting = {this.toggler_setting}
				copy_to_clipboard = {this.copyCodeToClipboard}
				logout = {this.props.logout}
				onRefresh =  {this.props.onRefresh}
				/>
			}
			</>
		);
	}
}
