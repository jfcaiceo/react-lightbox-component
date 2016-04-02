(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.ReactLightbox = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var React = (window.React);
var ReactDOM = (window.ReactDOM);
var Image = require('./Image');

module.exports = React.createClass({
  displayName: 'Container',
  propTypes: {
    selectedImage: React.PropTypes.number,
    images: React.PropTypes.array.isRequired,
    toggleLightbox: React.PropTypes.func.isRequired,
    showImageModifiers: React.PropTypes.bool,
    renderDescriptionFunc: React.PropTypes.func
  },
  getDefaultProps: function getDefaultProps() {
    return {
      selectedImage: 0,
      renderDescriptionFunc: function renderDescriptionFunc(image) {
        return React.createElement(
          'div',
          null,
          image.description
        );
      }
    };
  },
  getInitialState: function getInitialState() {
    return {
      selectedImageIndex: this.props.selectedImage
    };
  },
  componentWillMount: function componentWillMount() {
    document.documentElement.style.overflow = 'hidden';
    document.body.scroll = "no"; // ie only
  },
  componentWillUnmount: function componentWillUnmount() {
    document.documentElement.style.overflow = 'auto';
    document.body.scroll = "yes"; // ie only
  },
  handleLeftClick: function handleLeftClick() {
    if (this.canMoveToLeft()) {
      this.setState({
        selectedImageIndex: this.state.selectedImageIndex - 1
      });
    };
  },
  handleRightClick: function handleRightClick() {
    if (this.canMoveToRight()) {
      this.setState({
        selectedImageIndex: this.state.selectedImageIndex + 1
      });
    };
  },
  canMoveToLeft: function canMoveToLeft() {
    return this.state.selectedImageIndex > 0;
  },
  canMoveToRight: function canMoveToRight() {
    return this.state.selectedImageIndex < this.props.images.length - 1;
  },
  render: function render() {
    var props = this.props;
    var state = this.state;

    var image = props.images[state.selectedImageIndex];
    var leftButton = void 0,
        rightButton = void 0;
    var description = props.renderDescriptionFunc.call(this, image);

    if (this.canMoveToLeft()) leftButton = React.createElement(
      'div',
      { className: 'lightbox-btn-left' },
      React.createElement(
        'button',
        { className: 'lightbox-btn', onClick: this.handleLeftClick },
        React.createElement('i', { className: 'fa fa-3x fa-chevron-left' })
      )
    );
    if (this.canMoveToRight()) rightButton = React.createElement(
      'div',
      { className: 'lightbox-btn-right' },
      React.createElement(
        'button',
        { className: 'lightbox-btn', onClick: this.handleRightClick },
        React.createElement('i', { className: 'fa fa-3x fa-chevron-right' })
      )
    );
    return React.createElement(
      'div',
      { className: 'lightbox-backdrop' },
      React.createElement(
        'div',
        { className: 'lightbox-btn-close' },
        React.createElement(
          'button',
          { className: 'lightbox-btn', onClick: props.toggleLightbox },
          React.createElement('i', { className: 'fa fa-lg fa-times' })
        )
      ),
      React.createElement(
        'div',
        { className: 'lightbox-title-content' },
        React.createElement(
          'div',
          { className: 'lightbox-title' },
          image.title
        ),
        React.createElement(
          'div',
          { className: 'lightbox-description' },
          description
        )
      ),
      React.createElement(Image, { src: image.src, showImageModifiers: props.showImageModifiers }),
      leftButton,
      rightButton
    );
  }
});

},{"./Image":2}],2:[function(require,module,exports){
'use strict';

var React = (window.React);
var ReactDOM = (window.ReactDOM);
var ImageModifiers = require('./ImageModifiers');
var ZOOM_STEP = 1.10;
var MAX_ZOOM_SIZE = Math.pow(ZOOM_STEP, 30);
var MIN_ZOOM_SIZE = Math.pow(1 / ZOOM_STEP, 10);


module.exports = React.createClass({
  displayName: 'Image',
  propTypes: {
    src: React.PropTypes.string.isRequired,
    showImageModifiers: React.PropTypes.bool.isRequired
  },
  getInitialState: function getInitialState() {
    return {
      loader: true,
      ratio: 1,
      positionX: 0,
      positionY: 0,
      rotate: 0,
      width: 0,
      height: 0,
      boxWidth: 0,
      boxHeight: 0
    };
  },
  componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
    this.resetImageInitialState(nextProps);
  },
  componentDidMount: function componentDidMount() {
    this.resetImageInitialState(this.props);
    this.startPoints = null;
    if (this.props.showImageModifiers) {
      document.addEventListener('mousedown', this.handleMoveStart);
      document.addEventListener('mousemove', this.handleMove);
      document.addEventListener('mouseup', this.handleMoveEnd);
      document.addEventListener('touchstart', this.handleMoveStart);
      document.addEventListener('touchmove', this.handleMove);
      document.addEventListener('touchend', this.handleMoveEnd);
      document.addEventListener('wheel', this.handleWheel);
    }
  },
  componentWillUnmount: function componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleMoveStart);
    document.removeEventListener('mousemove', this.handleMove);
    document.removeEventListener('mouseup', this.handleMoveEnd);
    document.removeEventListener('touchstart', this.handleMoveStart);
    document.removeEventListener('touchmove', this.handleMove);
    document.removeEventListener('touchend', this.handleMoveEnd);
    document.removeEventListener('wheel', this.handleWheel);
  },
  resetImageInitialState: function resetImageInitialState(props) {
    var img = new Image();
    var _this = this;
    img.onload = function () {
      var width = this.width;
      var height = this.height;

      var box = ReactDOM.findDOMNode(_this.refs.container);
      var boxWidth = box.offsetWidth;
      var boxHeight = box.offsetHeight;

      var ratio = Math.min(boxWidth / width, boxHeight / height);
      _this.setState({
        loader: false,
        ratio: ratio,
        rotate: 0,
        positionX: (boxWidth - width * ratio) / 2,
        positionY: (boxHeight - height * ratio) / 2,
        width: this.width,
        height: this.height,
        boxWidth: boxWidth,
        boxHeight: boxHeight,
        moving: false
      });
    };
    img.src = props.src;
  },
  handleRotate: function handleRotate(angle) {
    this.setState({
      rotate: (360 + this.state.rotate + angle) % 360
    });
  },
  handleZoom: function handleZoom(direction) {
    var scale = arguments.length <= 1 || arguments[1] === undefined ? 1 : arguments[1];

    var percent = direction > 0 ? Math.pow(ZOOM_STEP, scale) : Math.pow(1 / ZOOM_STEP, scale);
    var ratio = this.setZoomLimits(this.state.ratio * percent);
    var state = this.state;
    var delta = 0.05;
    var newPositionX = void 0,
        newPositionY = void 0;

    if (Math.min(state.boxWidth / state.width, state.boxHeight / state.height) >= ratio - delta) {
      newPositionX = (state.boxWidth - state.width * ratio) / 2;
      newPositionY = (state.boxHeight - state.height * ratio) / 2;
    } else {
      // Center image from container's center
      var offsetX = state.boxWidth / 2;
      var offsetY = state.boxHeight / 2;

      var bgCursorX = offsetX - state.positionX;
      var bgCursorY = offsetY - state.positionY;

      var bgRatioX = bgCursorX / (state.width * state.ratio);
      var bgRatioY = bgCursorY / (state.height * state.ratio);

      newPositionX = offsetX - state.width * ratio * bgRatioX;
      newPositionY = offsetY - state.height * ratio * bgRatioY;
    }

    this.setState({
      ratio: ratio,
      positionX: newPositionX,
      positionY: newPositionY
    });
  },
  setZoomLimits: function setZoomLimits(size) {
    var state = this.state;
    var originalRatio = Math.min(state.boxWidth / state.width, state.boxHeight / state.height);
    if (size / originalRatio > MAX_ZOOM_SIZE) return MAX_ZOOM_SIZE * originalRatio;else if (size / originalRatio < MIN_ZOOM_SIZE) return MIN_ZOOM_SIZE * originalRatio;else return size;
  },
  handleWheel: function handleWheel(ev) {
    if (this.isInsideImage(ev)) this.handleZoom(ev.deltaY);
  },
  handleMove: function handleMove(ev) {
    ev = this.getEv(ev);
    if (!this.startPoints) return;
    var state = this.state;
    var posX = void 0,
        posY = void 0;
    switch (state.rotate) {
      case 90:
        posY = this.startPoints[0] - ev.pageX;
        posX = ev.pageY - this.startPoints[1];
        break;
      case 180:
        posX = this.startPoints[0] - ev.pageX;
        posY = this.startPoints[1] - ev.pageY;
        break;
      case 270:
        posY = ev.pageX - this.startPoints[0];
        posX = this.startPoints[1] - ev.pageY;
        break;
      default:
        posX = ev.pageX - this.startPoints[0];
        posY = ev.pageY - this.startPoints[1];
    }
    this.startPoints = [ev.pageX, ev.pageY];

    if (state.positionX + posX >= 0 || state.positionX + posX <= state.boxWidth - state.width * state.ratio) posX = 0;
    if (state.positionY + posY >= 0 || state.positionY + posY <= state.boxHeight - state.height * state.ratio) posY = 0;

    this.setState({
      positionX: state.positionX + posX,
      positionY: state.positionY + posY
    });
  },
  handleMoveEnd: function handleMoveEnd(ev) {
    this.startPoints = null;
    this.setState({
      moving: false
    });
  },
  handleMoveStart: function handleMoveStart(ev) {
    ev = this.getEv(ev);
    if (!this.isInsideImage(ev) || ev.which != 1) return;
    this.startPoints = [ev.pageX, ev.pageY];
    this.setState({
      moving: true
    });
  },
  isInsideImage: function isInsideImage(ev) {
    var rect = ReactDOM.findDOMNode(this.refs.container).getBoundingClientRect();
    if (ev.pageY < rect.top || ev.pageY > rect.bottom || ev.pageX < rect.left || ev.pageX > rect.right) return false;
    return true;
  },
  getEv: function getEv(ev) {
    if (ev.type === 'touchstart' || ev.type === 'touchmove' || ev.type === 'touchend') return { pageX: ev.touches[0].pageX, pageY: ev.touches[0].pageY, which: 1 };
    return ev;
  },
  render: function render() {
    var props = this.props;
    var state = this.state;

    var background = 'url(' + props.src + ')';
    var modifiers = void 0,
        loader = void 0;
    if (props.showImageModifiers) {
      modifiers = React.createElement(ImageModifiers, {
        handleRotate: this.handleRotate,
        handleZoom: this.handleZoom,
        currentImage: props.src });
    }
    if (state.loader) {
      background = 'none';
      loader = React.createElement(
        'div',
        { className: 'lightbox-loader' },
        React.createElement('i', { className: 'fa fa-3x fa-spinner fa-spin' })
      );
    }
    var transform = 'rotate(' + state.rotate + 'deg)';
    var styles = {
      height: '100%',
      backgroundImage: background,
      backgroundRepeat: 'no-repeat',
      backgroundSize: state.width * state.ratio + 'px ' + state.height * state.ratio + 'px',
      backgroundPosition: state.positionX + 'px ' + state.positionY + 'px',
      MsTransform: transform,
      WebkitTransform: transform,
      transform: transform
    };
    return React.createElement(
      'div',
      { className: 'lightbox-content-center' },
      modifiers,
      React.createElement(
        'div',
        { className: 'lightbox-image-container', ref: 'container' },
        React.createElement(
          'div',
          { className: 'lightbox-image' + (state.moving ? ' moving' : ''), style: styles },
          loader
        )
      )
    );
  }
});

},{"./ImageModifiers":3}],3:[function(require,module,exports){
'use strict';

var React = (window.React);
var ReactDOM = (window.ReactDOM);

module.exports = React.createClass({
  displayName: 'Image',
  propTypes: {
    handleRotate: React.PropTypes.func.isRequired,
    handleZoom: React.PropTypes.func.isRequired,
    currentImage: React.PropTypes.string.isRequired
  },
  handleRotateClockwise: function handleRotateClockwise() {
    this.props.handleRotate.call(this, 90);
  },
  handleRotateCounterclockwise: function handleRotateCounterclockwise() {
    this.props.handleRotate.call(this, -90);
  },
  handleZoomIn: function handleZoomIn() {
    this.props.handleZoom.call(this, 1, 10);
  },
  handleZoomOut: function handleZoomOut() {
    this.props.handleZoom.call(this, -1, 10);
  },
  render: function render() {
    return React.createElement(
      'div',
      { className: 'lightbox-modifiers-box' },
      React.createElement(
        'button',
        { className: 'lightbox-btn', onClick: this.handleZoomIn },
        React.createElement('i', { className: 'fa fa-search-plus' })
      ),
      React.createElement(
        'button',
        { className: 'lightbox-btn', onClick: this.handleZoomOut },
        React.createElement('i', { className: 'fa fa-search-minus' })
      ),
      React.createElement(
        'button',
        { className: 'lightbox-btn', onClick: this.handleRotateCounterclockwise },
        React.createElement('i', { className: 'fa fa-rotate-left' })
      ),
      React.createElement(
        'button',
        { className: 'lightbox-btn', onClick: this.handleRotateClockwise },
        React.createElement('i', { className: 'fa fa-rotate-right' })
      ),
      React.createElement(
        'a',
        { className: 'lightbox-btn a-padding', download: true, href: this.props.currentImage },
        React.createElement('i', { className: 'fa fa-download' })
      )
    );
  }
});

},{}],4:[function(require,module,exports){
'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var React = (window.React);
var ReactDOM = (window.ReactDOM);
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
    renderImageFunc: React.PropTypes.func,
    renderDescriptionFunc: React.PropTypes.func
  },
  getDefaultProps: function getDefaultProps() {
    return {
      showImageModifiers: true,
      thumbnailWidth: '80px',
      thumbnailHeight: '80px',
      renderImageFunc: function renderImageFunc(idx, image, toggleLightbox, width, height) {
        return React.createElement('img', {
          key: idx,
          src: !!image.thumbnail ? image.thumbnail : image.src,
          className: 'lightbox-img-thumbnail',
          style: { width: width, height: height },
          alt: image.title,
          onClick: toggleLightbox.bind(null, idx) });
      }
    };
  },
  getInitialState: function getInitialState() {
    return {
      showLightbox: false,
      selectedImage: 0
    };
  },
  toggleLightbox: function toggleLightbox(idx) {
    this.setState({
      showLightbox: !this.state.showLightbox,
      selectedImage: idx
    });
  },
  render: function render() {
    var _this = this;

    var props = this.props;
    var images = props.images.map(function (image, idx) {
      return props.renderImageFunc.call(_this, idx, image, _this.toggleLightbox, props.thumbnailWidth, props.thumbnailHeight);
    });
    var container = void 0;
    if (this.state.showLightbox) container = React.createElement(Container, _extends({}, this.props, {
      toggleLightbox: this.toggleLightbox,
      selectedImage: this.state.selectedImage }));

    return React.createElement(
      'div',
      { className: 'lightbox-container' },
      images,
      container
    );
  }
});

},{"./Container":1}],5:[function(require,module,exports){
'use strict';

exports.Lightbox = require('./Lightbox');

},{"./Lightbox":4}]},{},[5])(5)
});