'use strict';

import React from 'react';
import ReactTestUtils from 'react-dom/test-utils'
import ImageContent from '../lib/components/Image';
import { dummyData } from './utils/defaultImageData';

describe("Image component", () => {
  let image;
  beforeEach(() => {
    image = ReactTestUtils.renderIntoDocument(
      <ImageContent  src={dummyData[0].src} showImageModifiers={true} />
    );
  });

  it("zoom in image on button click", () => {
    var ratio = image.state.ratio;
    var zoomIn = ReactTestUtils.scryRenderedDOMComponentsWithClass(image, 'lightbox-btn')[0];
    ReactTestUtils.Simulate.click(zoomIn)
    expect(image.state.ratio).not.toBeLessThan(ratio);
  });

  it("zoom out image on button click", () => {
    var ratio = image.state.ratio;
    var zoomOut = ReactTestUtils.scryRenderedDOMComponentsWithClass(image, 'lightbox-btn')[1];
    ReactTestUtils.Simulate.click(zoomOut)
    expect(image.state.ratio).toBeLessThan(ratio);
  });

  it("rotate counter clockwise image on button click", () => {
    var counter = ReactTestUtils.scryRenderedDOMComponentsWithClass(image, 'lightbox-btn')[2];
    ReactTestUtils.Simulate.click(counter)
    expect(image.state.rotate).toEqual(270);
  });

  it("rotate clockwise image on button click", () => {
    var clockwise = ReactTestUtils.scryRenderedDOMComponentsWithClass(image, 'lightbox-btn')[3];
    ReactTestUtils.Simulate.click(clockwise)
    expect(image.state.rotate).toEqual(90);
  });
});