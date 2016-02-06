import React from 'react'
import ReactDOM from 'react-dom';
import Binder from 'react-binding';

import HtmlPagesRenderer from 'react-html-pages-renderer';
import Widgets from './WidgetFactory';
import { Router, Route, Link, IndexRoute, hashHistory } from 'react-router';

//const URL = 'http://photo-papermill.rhcloud.com';
const URL = "http://localhost:8080";


class HtmlBook extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			loaded: false
		};
	}
	componentDidMount() {
		var me = this;
		$.ajax({
			type: "GET",
			url: URL + "/docs/" + this.props.params.id,
			dataType: 'json',
			success: function (data) {
				console.log(data);
				me.setState({
					loaded: true,
					schema: JSON.parse(data.schemaTemplate),
					data: data.data || {},
					pageOptions: data.customData.pageOptions || {},
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
	
	render() {
		if (!this.state.loaded) return <div>Loading...</div>;
		if (this.state.error !== undefined && this.state.error.hasError) return <div><h3>
			Oooops...</h3> {this.state.error.errorMessage}</div>;

		var schema = this.state.schema;
		var dataContext = Binder.bindToState(this, 'data');

		return (<div style={{paddingBottom:10,paddingLeft:10,paddingRight:10}}>
			<HtmlPagesRenderer widgets={Widgets} schema={schema} dataContext={dataContext} pageOptions={this.state.pageOptions} doublePage="true"/>
		</div>)
	}
}
;
class App extends React.Component {
	render() {
		return (
			<div>
				{this.props.children}
			</div>
		);
	}
}
;
class Welcome extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			loaded: false
		};
	}

	componentDidMount() {
		var me = this;
		$.ajax({
			type: "GET",
			url: URL + "/docs/?limit=5",
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

	render() {
		if (!this.state.loaded) return <div>Loading...</div>;
		if (this.state.error !== undefined && this.state.error.hasError) return <div><h3>
			Oooops...</h3> {this.state.error.errorMessage}</div>;
		return (
			<div>
				<ul>
					{this.state.items.map(function (item, index) {
						return <li key={index}><Link to={"/book/" + item._id}>{item.name}</Link></li>
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
			<Route path="book/:id" component={HtmlBook}/>
		</Route>
	</Router>
), document.getElementById('app'));
