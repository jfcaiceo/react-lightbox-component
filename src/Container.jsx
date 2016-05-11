'use strict';

var React = require('react');
var ReactDOM = require('react-dom');
var Image = require('./Image');
var classNames = require('./utils/classNames');

module.exports = React.createClass({
  displayName: 'Container',
  propTypes: {
    selectedImage: React.PropTypes.number,
    images: React.PropTypes.array.isRequired,
    toggleLightbox: React.PropTypes.func.isRequired,
    showImageModifiers: React.PropTypes.bool,
    renderDescriptionFunc: React.PropTypes.func
  },
  getDefaultProps: function() {
    return {
      selectedImage: 0,
      renderDescriptionFunc: (image) => {
        return (
            <div>
              {image.description}
            </div>
        )
      }
    }
  },
  getInitialState: function() {
    return {
      selectedImageIndex: this.props.selectedImage
    };
  },
  componentWillMount: function() {
    const scrollTop = document.body.scrollTop;
    classNames.add(document.documentElement, 'lightbox-open');
    document.documentElement.style.top = `-${scrollTop}px`;
    document.body.scroll = "no"; // ie only
  },
  componentWillUnmount: function() {
    const scrollTop = Math.abs(parseInt(document.documentElement.style.top))
    classNames.remove(document.documentElement, 'lightbox-open');
    document.documentElement.style.top = null;
    document.body.scrollTop = scrollTop
    document.body.scroll = "yes"; // ie only
  },
  handleLeftClick: function(){
    if (this.canMoveToLeft()) {
      this.setState({
        selectedImageIndex: (this.state.selectedImageIndex - 1)
      });
    };
  },
  handleRightClick: function(){
    if (this.canMoveToRight()) {
      this.setState({
        selectedImageIndex: (this.state.selectedImageIndex + 1)
      });
    };
  },
  canMoveToLeft: function() {
    return (this.state.selectedImageIndex > 0)
  },
  canMoveToRight: function() {
    return (this.state.selectedImageIndex < (this.props.images.length - 1))
  },
  toggleControls: function () {
    classNames.toggle(this.refs.container, 'hide-controls')
  },
  render: function() {
    let [props, state] = [this.props, this.state];
    let image = props.images[state.selectedImageIndex];
    let leftButton, rightButton;
    let description = props.renderDescriptionFunc.call(this, image);

    if(this.canMoveToLeft())
      leftButton = (
        <div className='lightbox-btn-left'>
          <button className='lightbox-btn' onClick={this.handleLeftClick}><i className='fa fa-3x fa-chevron-left'/></button>
        </div>
      )
    if(this.canMoveToRight())
      rightButton = (
        <div className='lightbox-btn-right'>
          <button className='lightbox-btn' onClick={this.handleRightClick}><i className='fa fa-3x fa-chevron-right'/></button>
        </div>
      )
    return (
      <div className='lightbox-backdrop' ref='container'>
        <div className='lightbox-btn-close'>
          <button className='lightbox-btn' onClick={props.toggleLightbox}><i className='fa fa-lg fa-times'/></button>
        </div>
        <div className='lightbox-title-content'>
          <div className='lightbox-title'>
            {image.title}
          </div>
          <div className='lightbox-description'>
            {description}
          </div>
        </div>
        <Image src={image.src} showImageModifiers={props.showImageModifiers}
          toggleControls={this.toggleControls} />
        {leftButton}
        {rightButton}
      </div>
    )
  }
});

