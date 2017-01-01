'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _standardPageSizes = require('./standardPageSizes');

var _standardPageSizes2 = _interopRequireDefault(_standardPageSizes);

var GraphicPrimitive = (function () {
	function GraphicPrimitive() {
		_classCallCheck(this, GraphicPrimitive);
	}

	_createClass(GraphicPrimitive, null, [{
		key: 'pointToPixel',
		value: function pointToPixel(point) {
			if (point === undefined) return;
			var convertedPoint = point / 72 * GraphicPrimitive.DPI;
			return Math.round(convertedPoint, 3);
			//return parseFloat(convertedPoint.toFixed(3));
		}
	}, {
		key: 'pixelToPoint',
		value: function pixelToPoint(point) {
			if (point === undefined) return;
			var convertedPoint = point / GraphicPrimitive.DPI * 72;
			return Math.round(convertedPoint, 3);
			//return parseFloat(convertedPoint.toFixed(3));
		}
	}, {
		key: 'DPI',
		get: function get() {
			return 96;
		}
	}, {
		key: 'DefaultMargin',

		//default margin for A4 format
		get: function get() {
			return 21.6;
		}

		//get page size for A4 format in points
	}, {
		key: 'DefaultPageSize',
		get: function get() {
			return [GraphicPrimitive.pointToPixel(_standardPageSizes2['default'].A4[0]), GraphicPrimitive.pointToPixel(_standardPageSizes2['default'].A4[1])];
		}

		//get page size for A4 format in pixels
	}, {
		key: 'DefaultPageSizeInPx',
		get: function get() {
			return [GraphicPrimitive.pointToPixel(_standardPageSizes2['default'].A4[0]), GraphicPrimitive.pointToPixel(_standardPageSizes2['default'].A4[1])];
		}
	}, {
		key: 'PageSizes',
		get: function get() {
			return _standardPageSizes2['default'];
		}
	}]);

	return GraphicPrimitive;
})();

exports['default'] = GraphicPrimitive;
;
module.exports = exports['default'];