'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import ReactTestUtils from 'react-dom/test-utils'
import Lightbox from '../lib/';
import Container from '../lib/components/Container';
import { dummyData } from './utils/defaultImageData';

describe("Lightbox container component", () => {
  it("changes selectedImageIndex on right/left button click", () => {
    var container = ReactTestUtils.renderIntoDocument(
      <Container  images={ dummyData } toggleLightbox={function(){}} showImageModifiers={true}/>
    );

    expect(container.state.selectedImageIndex).toEqual(0);

    var rightButtonContainer = ReactTestUtils.findRenderedDOMComponentWithClass(container, 'lightbox-btn-right');

    var rightButton = rightButtonContainer.children[0];
    ReactTestUtils.Simulate.click(rightButton);

    expect(container.state.selectedImageIndex).toEqual(1);

    var leftButtonContainer = ReactTestUtils.findRenderedDOMComponentWithClass(container, 'lightbox-btn-left');
    var leftButton = leftButtonContainer.children[0];
    ReactTestUtils.Simulate.click(leftButton);

    expect(container.state.selectedImageIndex).toEqual(0);
  });

  it("close container on close button click", () => {
    var lightbox = ReactTestUtils.renderIntoDocument(
      <Lightbox  images={ dummyData }/>
    );

    var image = ReactTestUtils.scryRenderedDOMComponentsWithClass(lightbox, 'lightbox-img-thumbnail')[0];
    ReactTestUtils.Simulate.click(image)
    
    var closeButtonContainer = ReactTestUtils.findRenderedDOMComponentWithClass(lightbox, 'lightbox-btn-close');
    var closeButton = closeButtonContainer.children[0];
    ReactTestUtils.Simulate.click(closeButton);

    var container = ReactTestUtils.scryRenderedDOMComponentsWithClass(lightbox, 'lightbox-backdrop')
    expect(container.length).toEqual(0);
  });
});