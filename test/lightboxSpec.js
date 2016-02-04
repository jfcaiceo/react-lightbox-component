'use strict';

var React = require('react');
var TestUtils = require('react-addons-test-utils');
var Lightbox = require('../src/Lightbox');
var Container = require('../src/Container');
var Utils = require('./utils/defaultImageData');

describe("Lightbox component", function() {
  var imagesData, lightbox;
  beforeEach(function() {
    imagesData = Utils.generateImageArray();
    lightbox = TestUtils.renderIntoDocument(
      <Lightbox  images={imagesData}/>
    );
  });

  it("renders and shows image thumbnails", function() {
    var images = TestUtils.scryRenderedDOMComponentsWithClass(lightbox, 'img-thumbnail');
    expect(images.length).toEqual(imagesData.length);
    expect(TestUtils.isDOMComponent(images[0]));
  });

  it("renders container on image click", function() {
    var container = TestUtils.scryRenderedDOMComponentsWithClass(lightbox, 'lightbox-backdrop')
    expect(container.length).toEqual(0);
    var image = TestUtils.scryRenderedDOMComponentsWithClass(lightbox, 'img-thumbnail')[0];
    TestUtils.Simulate.click(image)
    
    container = TestUtils.scryRenderedDOMComponentsWithClass(lightbox, 'lightbox-backdrop')
    expect(container.length).toEqual(1);
  });

  it("transfer the cliked image id to the container", function() {
    var imageIndex = 1;
    var image = TestUtils.scryRenderedDOMComponentsWithClass(lightbox, 'img-thumbnail')[imageIndex];
    TestUtils.Simulate.click(image);
    
    var container = TestUtils.findRenderedComponentWithType(lightbox, Container); 
    expect(container.props.selectedImage).toEqual(imageIndex);
  });
});