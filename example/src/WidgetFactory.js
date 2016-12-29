import WidgetFactory from 'react-photo-widget-factory';
import {Bar, Pie, Tree, SmoothLine, StockLine, Scatterplot, Radar} from 'react-pathjs-chart';

import BackgroundContainer from './containers/BackgroundContainer';
import Grid from './containers/GridWrapper';
import Cell from './containers/CellWrapper';
import InputRange from './widgets/InputRange';

export default {

	"BackgroundContainer":BackgroundContainer,
	"Grid":Grid,
	"Cell":Cell,

	"Core.TextContent":WidgetFactory.TextContent,
	"Core.RichTextContent":WidgetFactory.RichTextContent,
	"Core.HtmlContent": WidgetFactory.HtmlContent,
	"Core.JsxContent": WidgetFactory.JsxContent,
	"Core.ArticleContent": WidgetFactory.ArticleContent,
	"Core.ListItemContent": WidgetFactory.ListItemContent,
	"Core.ImageBox": WidgetFactory.ImageBox,
	"Core.SmartImageBox": WidgetFactory.SmartImageBox,
	"Core.ATvImageBox":WidgetFactory.ATvImageBox,

	"Core.BackgroundBox": WidgetFactory.BackgroundBox,
	"Core.HtmlBox": WidgetFactory.HtmlBox,
	"Core.HtmlImageBox": WidgetFactory.HtmlImageBox,

	"Core.ImageFlexBox":WidgetFactory.ImageFlexBox,

	"Core.TextBoxInput":WidgetFactory.TextBoxInput,
	
	"Core.Icon":WidgetFactory.Icon,
	"Core.IconMorph":WidgetFactory.IconMorph,
	//deprecated name
	"Core.IconMorphTransition":WidgetFactory.IconMorph,

	"Chart.Bar":Bar,
	"Chart.Pie":Pie,
	"Chart.Tree":Tree,
	"Chart.SmoothLine":SmoothLine,
	"Chart.StockLine":StockLine,
	"Chart.Scatterplot":Scatterplot,
	"Chart.Radar":Radar,

	'react-input-range.InputRange':InputRange,
};
