'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _utilsBackgroundStyle = require('./utils/backgroundStyle');

var _utilsBackgroundStyle2 = _interopRequireDefault(_utilsBackgroundStyle);

var HtmlPage = (function (_React$Component) {
    _inherits(HtmlPage, _React$Component);

    function HtmlPage() {
        _classCallCheck(this, HtmlPage);

        _get(Object.getPrototypeOf(HtmlPage.prototype), 'constructor', this).apply(this, arguments);
    }

    _createClass(HtmlPage, [{
        key: 'render',
        value: function render() {
            var options = this.props.pageOptions;
            var pageSize = [options.width, options.height];

            //TODO: implement other sizes
            //else {
            //	paper.format = options.format || 'A4'
            //	paper.orientation = options.orientation || 'portrait'
            //}

            var defaultMargin = 0;

            var margins = [defaultMargin, defaultMargin, defaultMargin, defaultMargin];

            if (options !== undefined && options.margin !== undefined) {
                margins = [options.margin.top || defaultMargin, options.margin.right || defaultMargin, options.margin.bottom || defaultMargin, options.margin.left || defaultMargin];
            }
            //console.log(JSON.stringify(margins,null,2));

            //convert points to pixel
            pageSize = [pageSize[0], pageSize[1]];
            margins = [margins[0], margins[1], margins[2], margins[3]];

            //console.log(JSON.stringify(pageSize,null,2));

            //if (this.props.errorFlag) classNames += ' errorFlag';
            var pageInnerStyle = {
                overflow: 'visible',
                width: pageSize[0] - (margins[0] + margins[2]),
                height: pageSize[1] - (margins[1] + margins[3]),
                position: 'relative',
                backgroundColor: 'transparent'
            };
            var pageStyle = {
                width: pageSize[0],
                height: pageSize[1],
                paddingTop: margins[0],
                paddingRight: margins[1],
                paddingBottom: margins[2],
                paddingLeft: margins[3]
            };

            //console.log("InnerStyle: " + JSON.stringify(pageInnerStyle,null,2));
            //console.log("PageStyle: " +  JSON.stringify(pageStyle,null,2));

            var bgStyle = _lodash2['default'].clone(pageStyle);
            var bg = this.props.background;
            if (bg !== undefined) bgStyle = _lodash2['default'].extend(bgStyle, (0, _utilsBackgroundStyle2['default'])(bg, pageStyle));
            bgStyle.position = 'absolute';

            //var imgStyle = {};
            //imgStyle.height = pageStyle.height;
            //imgStyle.zIndex = this.props.position % 2 !== 0?1:2;
            //imgStyle.width = pageStyle.width * 2;
            //if (this.props.position % 2 !== 0) {
            //  imgStyle.marginLeft = -pageStyle.width;
            //}
            //imgStyle.objectFit = 'cover';

            return _react2['default'].createElement(
                'div',
                { id: 'PAGE_' + this.props.pageNumber, className: this.props.className, style: this.props.style },
                _react2['default'].createElement('div', { style: bgStyle, className: 'pageStyle' }),
                _react2['default'].createElement(
                    'div',
                    { style: pageStyle, className: 'pageStyle' },
                    _react2['default'].createElement(
                        'div',
                        { style: pageInnerStyle },
                        this.props.children
                    )
                )
            );
        }
    }]);

    return HtmlPage;
})(_react2['default'].Component);

exports['default'] = HtmlPage;
;
module.exports = exports['default'];
/*<div style={{position:'absolute',width:pageStyle.width,height:pageStyle.height}}><img src={bg.image} style={imgStyle}></img></div>*/