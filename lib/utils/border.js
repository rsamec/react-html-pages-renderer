'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});
exports['default'] = styleBorder;

function styleBorder(style, border) {

	if (style === undefined) style = {};
	if (border === undefined) return style;

	if (border.width) style.borderWidth = border.width;
	if (border.radius) style.borderRadius = border.radius;
	if (border.color) style.borderColor = border.color && border.color.color;
	style.borderStyle = border.style || 'solid';
	return style;
}

module.exports = exports['default'];