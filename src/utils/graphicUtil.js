import standardPageSizes from './standardPageSizes';

export default class GraphicPrimitive {

	static get DPI() {return 96;}

	static pointToPixel (point) {
		if (point === undefined) return;
		var convertedPoint =(point / 72) * GraphicPrimitive.DPI;
		return Math.round(convertedPoint,3);
		//return parseFloat(convertedPoint.toFixed(3));
	};
  static pixelToPoint (point) {
    if (point === undefined) return;
    var convertedPoint =(point / GraphicPrimitive.DPI) * 72;
    return Math.round(convertedPoint,3);
    //return parseFloat(convertedPoint.toFixed(3));
  };

	//default margin for A4 format
	static get DefaultMargin() {return 21.6;}

	//get page size for A4 format in points
	static get DefaultPageSize() {return [GraphicPrimitive.pointToPixel(standardPageSizes.A4[0]),GraphicPrimitive.pointToPixel(standardPageSizes.A4[1])];}

	//get page size for A4 format in pixels
	static get DefaultPageSizeInPx() { return [GraphicPrimitive.pointToPixel(standardPageSizes.A4[0]), GraphicPrimitive.pointToPixel(standardPageSizes.A4[1])];}

	static get PageSizes() {return standardPageSizes;}
};
