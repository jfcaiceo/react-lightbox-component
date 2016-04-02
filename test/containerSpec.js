'use strict';

var React = require('react');
var TestUtils = require('react-addons-test-utils');
var Lightbox = require('../src/Lightbox');
var Container = require('../src/Container');
var Utils = require('./utils/defaultImageData');

describe("Lightbox container component", function() {

  it("changes selectedImageIndex on right/left button click", function() {
    var imagesData = Utils.generateImageArray();
    var container = TestUtils.renderIntoDocument(
      <Container  images={imagesData} toggleLightbox={function(){}} showImageModifiers={true}/>
    );

    expect(container.state.selectedImageIndex).toEqual(0);

    var rightButtonContainer = TestUtils.findRenderedDOMComponentWithClass(container, 'lightbox-btn-right');

    var rightButton = rightButtonContainer.children[0];
    TestUtils.Simulate.click(rightButton);

    expect(container.state.selectedImageIndex).toEqual(1);

    var leftButtonContainer = TestUtils.findRenderedDOMComponentWithClass(container, 'lightbox-btn-left');
    var leftButton = leftButtonContainer.children[0];
    TestUtils.Simulate.click(leftButton);

    expect(container.state.selectedImageIndex).toEqual(0);
  });

  it("close container on close button click", function() {
    var imagesData = Utils.generateImageArray();
    var lightbox = TestUtils.renderIntoDocument(
      <Lightbox  images={imagesData}/>
    );

    var image = TestUtils.scryRenderedDOMComponentsWithClass(lightbox, 'lightbox-img-thumbnail')[0];
    TestUtils.Simulate.click(image)
    
    var closeButtonContainer = TestUtils.findRenderedDOMComponentWithClass(lightbox, 'lightbox-btn-close');
    var closeButton = closeButtonContainer.children[0];
    TestUtils.Simulate.click(closeButton);

    var container = TestUtils.scryRenderedDOMComponentsWithClass(lightbox, 'lightbox-backdrop')
    expect(container.length).toEqual(0);
  });
});