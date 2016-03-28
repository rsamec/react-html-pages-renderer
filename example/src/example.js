import React from 'react'
import ReactDOM from 'react-dom';
import Binder from 'react-binding';

import HtmlPagesRenderer from 'react-html-pages-renderer';
import Widgets from './WidgetFactory';
import { Router, Route, Link, IndexRoute, hashHistory } from 'react-router';
import Joyride from 'react-joyride';
import {Menu, MainButton, ChildButton} from 'react-mfb';

const SERVICE_URL = 'http://www.paperify.io/api';
//const SERVICE_URL = 'http://photo-papermill.rhcloud.com';
//const SERVICE_URL = "http://localhost:8080";
	

class HtmlBook extends React.Component {

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
		if (!this.state.loaded) return <div>Please, wait. Just loading your document...</div>;
		if (this.state.error !== undefined && this.state.error.hasError) return <div><h3>
			Oooops...</h3> {this.state.error.errorMessage}</div>;

		
		var schema = this.state.schema;
		var dataContext = Binder.bindToState(this, 'data');

		var url = this.getUrl();
		var twitterShare =`http://twitter.com/share?text=${schema.name}&url=${url}&hashtags=photo,album`;
		//console.log(twitterShare);
		return (<div style={{paddingTop:5,paddingBottom:10,paddingLeft:10,paddingRight:10}}>
			<HtmlPagesRenderer widgets={Widgets} schema={schema} dataContext={dataContext} pageOptions={this.state.pageOptions} />

			<Joyride ref="joyride" steps={this.state.steps} debug={true}   showSkipButton={true} type="continuous" />
			<Menu  effect='zoomin' method='hover' position='bl'>
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
		var url = SERVICE_URL + "/docs/?limit=15";
		if (!!searchText) url +="&name__regex=/^" + searchText + "/i";
		console.log(url);
		$.ajax({
			type: "GET",
			url: url,
			dataType: 'json',
			success: function (data) {
				console.log(data);
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
		if (!this.state.loaded) return <div>Loading...</div>;
		if (this.state.error !== undefined && this.state.error.hasError) return <div><h3>
			Oooops...</h3> {this.state.error.errorMessage}</div>;
		return (
			<div>
				<input type="search" onChange={(e)=>{this.load(e.target.value)}}/>
				<ul>
					{this.state.items.map(function (item, index) {
						return <li key={index}><Link to={"/" + item._id}>{item.name}</Link></li>
					})}
				</ul>
			</div>
		);
	}
};

ReactDOM.render((
	// Render the main component into the dom
	<Router history={hashHistory}>
		<Route path="/" component={App}>
			<IndexRoute component={Welcome}/>
			<Route path="/:id" component={HtmlBook}/>
		</Route>
	</Router>
), document.getElementById('app'));
