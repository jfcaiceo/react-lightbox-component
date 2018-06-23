import React from 'react';
import PropTypes from 'prop-types';
import Button from './Button';

export default class ImageModifiers extends React.Component {
  constructor(props) {
    super(props);
    this.handleRotateClockwise = this.handleRotateClockwise.bind(this);
    this.handleRotateCounterclockwise = this.handleRotateCounterclockwise.bind(this);
    this.handleZoomIn = this.handleZoomIn.bind(this);
    this.handleZoomOut = this.handleZoomOut.bind(this);
    this.handleDownload = this.handleDownload.bind(this);
  }

  handleRotateClockwise() {
    this.props.handleRotate.call(this, 90);
  }

  handleRotateCounterclockwise() {
    this.props.handleRotate.call(this, -90);
  }

  handleZoomIn() {
    this.props.handleZoom.call(this, 1, 10);
  }

  handleZoomOut() {
    this.props.handleZoom.call(this, -1, 10);
  }

  handleDownload() {
    console.log(this.props.currentImage);
    window.open(this.props.currentImage);
  }

  render() {
    return (
      <div className='lightbox-modifiers-box'>
        <Button icon="zoom-in" onClick={this.handleZoomIn} size={ 34 } hasRipple={ true } />
        <Button icon="zoom-out" onClick={this.handleZoomOut} size={ 34 } hasRipple={ true } />
        <Button icon="rotate-left" onClick={this.handleRotateCounterclockwise} size={ 34 } hasRipple={ true } />
        <Button icon="rotate-right" onClick={this.handleRotateClockwise} size={ 34 } hasRipple={ true } />
        <Button icon="download" onClick={this.handleDownload} size={ 34 } hasRipple={ true } />
      </div>
    )
  }
}

ImageModifiers.propTypes = {
  handleRotate: PropTypes.func.isRequired,
  handleZoom: PropTypes.func.isRequired,
  currentImage: PropTypes.string.isRequired
}