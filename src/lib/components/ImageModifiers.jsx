import React from 'react';
import PropTypes from 'prop-types';
import Icon from './Icon';

export default class ImageModifiers extends React.Component {
  constructor(props) {
    super(props);
    this.handleRotateClockwise = this.handleRotateClockwise.bind(this);
    this.handleRotateCounterclockwise = this.handleRotateCounterclockwise.bind(this);
    this.handleZoomIn = this.handleZoomIn.bind(this);
    this.handleZoomOut = this.handleZoomOut.bind(this);
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

  render() {
    return (
      <div className='lightbox-modifiers-box'>
        <button className='lightbox-btn' onClick={this.handleZoomIn}>
          <Icon icon="zoom-in" aditionalClass="lightbox-btn-icon" />
        </button>
        <button className='lightbox-btn' onClick={this.handleZoomOut}>
          <Icon icon="zoom-out" aditionalClass="lightbox-btn-icon" />
        </button>
        <button className='lightbox-btn' onClick={this.handleRotateCounterclockwise}>
          <Icon icon="rotate-left" aditionalClass="lightbox-btn-icon" />
        </button>
        <button className='lightbox-btn' onClick={this.handleRotateClockwise}>
          <Icon icon="rotate-right" aditionalClass="lightbox-btn-icon" />
        </button>
        <a className='lightbox-btn' target="_blank" download href={this.props.currentImage} >
          <Icon icon="download" aditionalClass="lightbox-btn-icon" />
        </a>
      </div>
    )
  }
}

ImageModifiers.propTypes = {
  handleRotate: PropTypes.func.isRequired,
  handleZoom: PropTypes.func.isRequired,
  currentImage: PropTypes.string.isRequired
}