import React from 'react';
import PropTypes from 'prop-types';

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
          <i className='fa fa-search-plus'/>
        </button>
        <button className='lightbox-btn' onClick={this.handleZoomOut}>
          <i className='fa fa-search-minus' />
        </button>
        <button className='lightbox-btn' onClick={this.handleRotateCounterclockwise}>
          <i className='fa fa-rotate-left'/>
        </button>
        <button className='lightbox-btn' onClick={this.handleRotateClockwise}>
          <i className='fa fa-rotate-right' />
        </button>
        <a className='lightbox-btn' target="_blank" download href={this.props.currentImage} >
          <i className='fa fa-download' />
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