var React = require('react');

import WidgetRenderer from './WidgetRenderer';
import ContainerRenderer from './ContainerRenderer.js';


export default class HtmlRenderer extends React.Component {
	
	render() {
		var {schema, widgets} = this.props;

		var ctx = (schema.props && schema.props.context) || {};
		
		var code = ctx['code'] && ctx['code'].compiled;
		if (!!code && this.customCode === undefined) {
			this.customCode = eval(code);			
		}
		
		var pagesRoot = this.props.pagesRoot || 'div';

		var containerRenderer = <ContainerRenderer elementName={schema.elementName}
				containers={schema.containers}
				node={schema}
				boxes={schema.boxes}
				ctx={ctx}
				customCode={this.customCode}
				widgets={widgets}
				widgetRenderer={WidgetRenderer}
			/>
				
		return React.createElement(pagesRoot, {className:'printable', id: "section-to-print", style: this.props.style}, containerRenderer);
	}
};
