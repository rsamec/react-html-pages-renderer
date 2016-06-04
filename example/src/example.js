import React from 'react'
import ReactDOM from 'react-dom';
import Binder from 'react-binding';

import HtmlPagesRenderer,{HtmlRenderer} from 'react-html-pages-renderer';
import Widgets from './WidgetFactory';
import { Router, Route, Link, IndexRoute, hashHistory } from 'react-router';
import Joyride from 'react-joyride';
import {Menu, MainButton, ChildButton} from 'react-mfb';
import Loader from 'react-loader';
//import SwipeViews from 'react-swipe-views';
import SwipeViews from 'react-swipe';
import Helmet from "react-helmet";

//var Frame = require('react-frame-component');

const SERVICE_URL = 'http://www.paperify.io/api';
//const SERVICE_URL = 'http://photo-papermill.rhcloud.com';
//const SERVICE_URL = "http://localhost:8080";

class HtmlBook extends React.Component {
	render(){return <HtmlView {...this.props} type="book" />}
}

class HtmlView extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			loaded: false
		};
	}
	getUrl(){
		return SERVICE_URL + "/docs/" + this.props.params.id;
	}
	componentDidMount() {
		var url = this.getUrl();
		var me = this;
		$.ajax({
			type: "GET",
			url:url,
			dataType: 'json',
			success: function (data) {
				var schema = JSON.parse(data.schemaTemplate);
				var data = data.data || (schema.props && schema.props.defaultData) || {};
				me.setState({
					loaded: true,
					schema: schema,
					data: data,
					pageOptions: schema.props.pageOptions, //(data.customData && data.customData.pageOptions) ,
					error: {hasError: false},
					steps:data.tour
				});
				if (data.tour !== undefined) me.refs.joyride.start(false);
			},
			error: function (xhr, ajaxOptions, thrownError) {
				me.setState({
					loaded: true,
					error: {
						hasError: true, errorMessage: xhr.responseText
					}
				});
			}
		})
	}
	pinInterest(){
		var PININTEREST_API_KEY = 'https://assets.pinterest.com/sdk/sdk.js';
	}

	generate(type) {
		var contentType = 'image/' + type;
		if (type === "pdf") contentType = 'application/pdf';
	

		var xmlhttp = new XMLHttpRequest();   // new HttpRequest instance
		xmlhttp.open("POST", SERVICE_URL + '/' + type);

		xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
		xmlhttp.responseType = 'arraybuffer';

		xmlhttp.onreadystatechange = function () {
			if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
				var blob = new Blob([xmlhttp.response], {type: contentType});
				var fileURL = URL.createObjectURL(blob);
				window.open(fileURL);
			}
		};
		
		//console.log(pageOptions);
		xmlhttp.send(JSON.stringify(_.extend(this.state.schema, {
			pageOptions: this.state.pageOptions,
			data:this.state.data
		})));
		//xmlhttp.send(JSON.stringify(this.state.schema));
	}
	render() {
		if (!this.state.loaded) return <Loader loaded={this.state.loaded}><div>Please, wait. Just loading your document...</div></Loader>;
		if (this.state.error !== undefined && this.state.error.hasError) return <div><h3>
			Oooops...</h3> {this.state.error.errorMessage}</div>;

		
		var schema = this.state.schema;
		var dataContext = Binder.bindToState(this, 'data');

		var url = this.getUrl();
		var twitterShare =`http://twitter.com/share?text=${schema.name}&url=${url}&hashtags=photo,album`;
		//console.log(twitterShare);
		var meta = [
			{"name": "description", "content": "Paperify application"},
			{"property": "og:type", "content": "article"}
		];

		var isResponsive = schema.containers[0] && schema.containers[0].elementName === "Grid";
		if (isResponsive) meta.push({"name": "viewport", "content": "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0"});
		
		return (<div>
			<Helmet title={schema.name}  meta={meta} />
			{this.props.type === "book"?
			<HtmlPagesRenderer widgets={Widgets} schema={schema} dataContext={dataContext} pageOptions={this.state.pageOptions} />:
			<HtmlRenderer widgets={Widgets} schema={schema} dataContext={dataContext} pageOptions={this.state.pageOptions} />}

			<Joyride className="hidden-print" ref="joyride" steps={this.state.steps} debug={true}   showSkipButton={true} type="continuous" />
			<Menu className="hidden-print" effect='zoomin' method='hover' position='bl'>
				<MainButton iconResting="ion-plus-round" iconActive="ion-close-round" />
				<ChildButton
					onClick={(e) => { e.preventDefault(); this.generate('jpg') }}
					icon="ion-images"
					label="Create image"
				/>
				<ChildButton
					onClick={(e) => { e.preventDefault(); this.generate('pdf') }}
					icon="ion-printer"
					label="Generate PDF"
				/>
				<ChildButton
					icon="ion-social-twitter"
					label="Share on Twitter"
					target="_blank"
					href={twitterShare} />
				{this.state.steps!==undefined?<ChildButton
					onClick={(e) => { e.preventDefault(); this.refs.joyride.reset(true) }}
					icon="ion-refresh"
					label="Restart guide"/>:
					<ChildButton
					icon="ion-social-pinterest-outline"
					label="Share on PinInterest"
					onClick={(e) => { alert('Sorry, not implemented yet.'); }}
					 />
				}
				</Menu>
		</div>)
	}
}
class SwipeView extends React.Component{
	constructor(props) {
		super(props);
		this.state = {
			loaded: false
		};
	}
	getUrl(){
		return SERVICE_URL + "/docs/" + this.props.params.id;
	}
	componentDidMount() {
		var url = this.getUrl();
		var me = this;
		$.ajax({
			type: "GET",
			url:url,
			dataType: 'json',
			success: function (data) {
				var schema = JSON.parse(data.schemaTemplate);
				var data = data.data || (schema.props && schema.props.defaultData) || {};
				me.setState({
					loaded: true,
					schema: schema,
					data: data,
					pageOptions: schema.props.pageOptions, //(data.customData && data.customData.pageOptions) ,
					error: {hasError: false},
					steps:data.tour
				});
				if (data.tour !== undefined) me.refs.joyride.start(false);
			},
			error: function (xhr, ajaxOptions, thrownError) {
				me.setState({
					loaded: true,
					error: {
						hasError: true, errorMessage: xhr.responseText
					}
				});
			}
		})
	}
	render(){
		if (!this.state.loaded) return <Loader loaded={this.state.loaded}><div>Please, wait. Just loading your document...</div></Loader>;
		if (this.state.error !== undefined && this.state.error.hasError) return <div><h3>
			Oooops...</h3> {this.state.error.errorMessage}</div>;


		var schema = this.state.schema;
		var dataContext = Binder.bindToState(this, 'data');

		//var swipeViews = <SwipeViews swipeOptions={{continuous: false}}/>;
		//return  <Frame initialContent="<!DOCTYPE html><html><head><meta name='viewport' content='width=device-width'><link type='text/css' rel='stylesheet' href='example.css' /></head><body><div style='width:100%;height:100%;'></div></body></html>"><HtmlPagesRenderer pagesRoot={SwipeViews} widgets={Widgets} schema={schema} dataContext={dataContext} pageOptions={this.state.pageOptions} /></Frame>
		return <HtmlPagesRenderer pagesRoot={SwipeViews} widgets={Widgets} schema={schema} dataContext={dataContext} pageOptions={this.state.pageOptions} /> 
	}
}
class App extends React.Component {
	render() {
		return (
			<div>
				{this.props.children}
			</div>
		);
	}
};

class Welcome extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			loaded: false
		};
	}
	load(searchText){
		var me = this;
		var url = SERVICE_URL + "/docs/?limit=50";
		if (!!searchText) url +="&name__regex=/^" + searchText + "/i";
		//console.log(url);
		$.ajax({
			type: "GET",
			url: url,
			dataType: 'json',
			success: function (data) {
				//console.log(data);
				me.setState({
					loaded: true,
					items: data,
					error: {hasError: false}
				});
			},
			error: function (xhr, ajaxOptions, thrownError) {
				me.setState({
					loaded: true,
					error: {
						hasError: true, errorMessage: xhr.responseText
					}
				});
			}
		})
	}
	componentDidMount() {
		this.load();
	}

	render() {
		
		var flexItemStyle = {backgroundColor:'lavender',margin:5, padding:10}
		if (!this.state.loaded) return <div>Loading...</div>;
		if (this.state.error !== undefined && this.state.error.hasError) return <div><h3>
			Oooops...</h3> {this.state.error.errorMessage}</div>;
		return (
			<div>
				<div style={{width:'100%'}}>
					<input style={{fontSize:35}} type="search" onChange={(e)=>{this.load(e.target.value)}}/>
				</div>
				<div style={{display:'flex',flexWrap:'wrap'}}>
					{this.state.items.map(function (item, index) {
						return <div  key={index} style={flexItemStyle}><Link to={"/" + item._id}>{item.name}</Link></div>
					})}
				</div>
			</div>
		);
	}
};




ReactDOM.render((
	// Render the main component into the dom
	<Router history={hashHistory}>
		<Route path="/" component={App}>
			<IndexRoute component={Welcome}/>
			<Route path="/:id" component={HtmlView}/>
			<Route path="/swipe/:id" component={SwipeView}/>
			<Route path="/book/:id" component={HtmlBook}/>
		</Route>
	</Router>
), document.getElementById('app'));
