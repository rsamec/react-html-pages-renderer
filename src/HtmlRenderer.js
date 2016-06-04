var React = require('react');
import ReactDOM from 'react-dom';
import _ from 'lodash';

import WidgetRenderer from './WidgetRenderer';
import bindToSchema from './utils/bindToSchema';
import ContainerRenderer from './ContainerRenderer.js';

export default class HtmlRenderer extends React.Component {
	
	render() {
		var schema = _.cloneDeep(this.props.schema);
		var dataContext = this.props.dataContext;
		var widgets = this.props.widgets;
		
		var bindSchema = bindToSchema(schema,dataContext);

		var isGrid = schema.containers[0] && schema.containers[0].elementName === "Grid";


		var ctx = (schema.props && schema.props.context) || {};
		var customStyles = ctx['styles'] || {};

		var code = ctx['code'] && ctx['code'].compiled;
		if (!!code && this.customCode === undefined) {
			this.customCode = eval(code);
		}
		//append shared code to data context
		if (dataContext !== undefined) dataContext.customCode = this.customCode;


		var pageBackground = (schema.props && schema.props.background) || {};
		
		var pagesRoot = this.props.pagesRoot || 'div';

		var containerRenderer = <ContainerRenderer elementName={bindSchema.elementName}
				containers={bindSchema.containers}
				node={bindSchema}
				boxes={bindSchema.boxes}
				dataBinder={dataContext}
				ctx={ctx}
				widgets={widgets}
				widgetRenderer={WidgetRenderer}
			/>
				
		return React.createElement(pagesRoot, {className:'printable', id: "section-to-print", style: this.props.style}, containerRenderer);
	}
};
