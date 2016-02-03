'use strict';

var React = require('react');
var TestUtils = require('react-addons-test-utils');
var Lightbox = require('../src/Lightbox');
var Utils = require('./utils/defaultImageData');

describe("Lightbox component", function() {
  it("renders and shows image thumbnails", function() {
    var imagesData = Utils.generateImageArray();
    var lightbox = TestUtils.renderIntoDocument(
      <Lightbox  images={imagesData}/>
    );
    var images = TestUtils.scryRenderedDOMComponentsWithClass(lightbox, 'img-thumbnail');
    expect(images.length).toEqual(imagesData.length);
    expect(TestUtils.isDOMComponent(images[0]));
  });

  
});