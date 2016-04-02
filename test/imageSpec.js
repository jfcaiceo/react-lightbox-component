'use strict';

var React = require('react');
var TestUtils = require('react-addons-test-utils');
var Image = require('../src/Image');
var Utils = require('./utils/defaultImageData');

describe("Image component", function() {
  var imagesData, image;
  beforeEach(function() {
    imagesData = Utils.generateImageArray();
    image = TestUtils.renderIntoDocument(
      <Image  src={imagesData[0].src} showImageModifiers={true} />
    );
  });

  it("zoom in image on button click", function() {
    var ratio = image.state.ratio;
    var zoomIn = TestUtils.scryRenderedDOMComponentsWithClass(image, 'lightbox-btn')[0];
    TestUtils.Simulate.click(zoomIn)
    expect(image.state.ratio).not.toBeLessThan(ratio);
  });

  it("zoom out image on button click", function() {
    var ratio = image.state.ratio;
    var zoomOut = TestUtils.scryRenderedDOMComponentsWithClass(image, 'lightbox-btn')[1];
    TestUtils.Simulate.click(zoomOut)
    expect(image.state.ratio).toBeLessThan(ratio);
  });

  it("rotate counter clockwise image on button click", function() {
    var counter = TestUtils.scryRenderedDOMComponentsWithClass(image, 'lightbox-btn')[2];
    TestUtils.Simulate.click(counter)
    expect(image.state.rotate).toEqual(270);
  });

  it("rotate clockwise image on button click", function() {
    var clockwise = TestUtils.scryRenderedDOMComponentsWithClass(image, 'lightbox-btn')[3];
    TestUtils.Simulate.click(clockwise)
    expect(image.state.rotate).toEqual(90);
  });
});