'use strict';

var React = require('react');
var ReactDOM = require('react-dom');
var Portal = require('./Portal');
var Container = require('./Container');

module.exports = React.createClass({
  displayName: 'Lightbox',
  propTypes: {
    images: React.PropTypes.arrayOf(React.PropTypes.shape({
      src: React.PropTypes.string.isRequired,
      title: React.PropTypes.string,
      description: React.PropTypes.string,
      thumbnail: React.PropTypes.string
    })).isRequired,
    showImageModifiers: React.PropTypes.bool,
    thumbnailWidth: React.PropTypes.string,
    thumbnailHeight: React.PropTypes.string,
    renderImageFunc: React.PropTypes.func
  },
  getDefaultProps: function() {
    return {
      showImageModifiers: true,
      thumbnailWidth: '80px',
      thumbnailHeight: '80px',
      renderImageFunc: (idx, image, toggleLightbox, width, height) => { 
        return (
          <img
            key={image.src}
            src={ !!image.thumbnail ? image.thumbnail : image.src  }
            className='img-responsive img-thumbnail'
            style={{width: width, height: height}}
            alt={image.title}
            onClick={toggleLightbox.bind(null, idx)} />
        )
      }
    };
  },
  getInitialState: function() {
    return {
      showLightbox: false,
      selectedImage: 0
    };
  },
  toggleLightbox: function(idx) {
    this.setState({
      showLightbox: !this.state.showLightbox,
      selectedImage: idx
    });
  },
  render: function() {
    let props = this.props;
    let images = props.images.map((image, idx) => {
      return props.renderImageFunc.call(
        this,
        idx,
        image,
        this.toggleLightbox,
        props.thumbnailWidth,
        props.thumbnailHeight
      );
    });
    let container;
    if (this.state.showLightbox)
      container = (
        <Container
          {...this.props} 
          toggleLightbox={this.toggleLightbox}
          selectedImage={this.state.selectedImage} />
      )

    return (
      <div className='lightbox-container'>
        {images}
        {container}
      </div>
    )
  }
});