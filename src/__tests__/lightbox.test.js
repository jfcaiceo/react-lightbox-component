'use strict';

import React from 'react';
import ReactTestUtils from 'react-dom/test-utils'
import Lightbox from '../lib';
import Container from '../lib/components/Container';
import { dummyData } from './utils/defaultImageData';

describe("Lightbox component", function() {
  var lightbox;
  beforeEach(function() {
    lightbox = ReactTestUtils.renderIntoDocument(
      <Lightbox  images={dummyData}/>
    );
  });

  it("renders and shows image thumbnails", function() {
    var images = ReactTestUtils.scryRenderedDOMComponentsWithClass(lightbox, 'lightbox-img-thumbnail');
    expect(images.length).toEqual(dummyData.length);
    expect(ReactTestUtils.isDOMComponent(images[0]));
  });

  it("renders container on image click", function() {
    var container = ReactTestUtils.scryRenderedDOMComponentsWithClass(lightbox, 'lightbox-backdrop')
    expect(container.length).toEqual(0);
    var image = ReactTestUtils.scryRenderedDOMComponentsWithClass(lightbox, 'lightbox-img-thumbnail')[0];
    ReactTestUtils.Simulate.click(image)
    
    container = ReactTestUtils.scryRenderedDOMComponentsWithClass(lightbox, 'lightbox-backdrop')
    expect(container.length).toEqual(1);
  });

  it("transfer the cliked image id to the container", function() {
    var imageIndex = 1;
    var image = ReactTestUtils.scryRenderedDOMComponentsWithClass(lightbox, 'lightbox-img-thumbnail')[imageIndex];
    ReactTestUtils.Simulate.click(image);
    
    var container = ReactTestUtils.findRenderedComponentWithType(lightbox, Container); 
    expect(container.props.selectedImage).toEqual(imageIndex);
  });
});