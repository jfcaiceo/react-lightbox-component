'use strict';

var React = require('react');
var ReactDOM = require('react-dom');

module.exports = React.createClass({
  displayName: 'Image',
  propTypes: {
    handleRotate: React.PropTypes.func.isRequired,
    handleZoom: React.PropTypes.func.isRequired
  },
  handleRotateClockwise: function() {
    this.props.handleRotate.call(this, 90);
  },
  handleRotateCounterclockwise: function() {
    this.props.handleRotate.call(this, -90);
  },
  handleZoomIn: function() {
    this.props.handleZoom.call(this, 1, 10);
  },
  handleZoomOut: function() {
    this.props.handleZoom.call(this, -1, 10);
  },
  render: function() {
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
      </div>
    )
  }
});
