import React from 'react';
import _ from 'lodash';
import backgroundStyle from './utils/backgroundStyle';

export default class HtmlPage extends React.Component
{
    render() {
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
        margins = [margins[0],margins[1],margins[2],margins[3]];

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
            paddingLeft: margins[3],
        };
		
        console.log("InnerStyle: " + JSON.stringify(pageInnerStyle,null,2));
        console.log("PageStyle: " +  JSON.stringify(pageStyle,null,2));

      var bgStyle = _.clone(pageStyle);
      var bg = this.props.background;
      if (bg !== undefined) bgStyle = _.extend(bgStyle,backgroundStyle(bg,pageStyle));
      bgStyle.position = 'absolute';



      //var imgStyle = {};
      //imgStyle.height = pageStyle.height;
      //imgStyle.zIndex = this.props.position % 2 !== 0?1:2;
      //imgStyle.width = pageStyle.width * 2;
      //if (this.props.position % 2 !== 0) {
      //  imgStyle.marginLeft = -pageStyle.width;
      //}
      //imgStyle.objectFit = 'cover';

        return (
            <div id={'PAGE_' + this.props.pageNumber} className={this.props.className} style={this.props.style}>
              {/*<div style={{position:'absolute',width:pageStyle.width,height:pageStyle.height}}><img src={bg.image} style={imgStyle}></img></div>*/}
                <div style={bgStyle} className="pageStyle" />
                <div style={pageStyle} className="pageStyle">
                    <div  style={pageInnerStyle}>
                        {this.props.children}
                    </div>
                </div>
            </div>
        );
    }
};
