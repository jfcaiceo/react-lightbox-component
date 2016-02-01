'use strict';

var React = require('react');
var ReactDOM = require('react-dom');
var ImageModifiers = require('./ImageModifiers');
const ZOOM_STEP = 1.05;
const [MAX_ZOOM_SIZE, MIN_ZOOM_SIZE] = [Math.pow(ZOOM_STEP, 40), Math.pow(1 / ZOOM_STEP, 10)];

module.exports = React.createClass({
  displayName: 'Image',
  propTypes: {
    src: React.PropTypes.string.isRequired
  },
  getInitialState: function() {
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
  componentWillMount: function() {
    //this.resetImageInitialState(this.props);
  },
  componentWillReceiveProps: function(nextProps) {
    this.resetImageInitialState(nextProps);
  },
  componentDidMount: function() {
    this.resetImageInitialState(this.props);
    this.startPoints = null;
    document.addEventListener('mousedown', this.handleMouseDown);
    document.addEventListener('mousemove', this.handleMouseMove);
    document.addEventListener('mouseup', this.handleMouseUp);
    document.addEventListener('wheel', this.handleWheel);
  },
  componentWillUnmount: function() {
    document.removeEventListener('mousedown', this.handleMouseDown);
    document.removeEventListener('mousemove', this.handleMouseMove);
    document.removeEventListener('mouseup', this.handleMouseUp);
    document.removeEventListener('wheel', this.handleWheel);
  },
  resetImageInitialState: function(props) {
    let img = new Image();
    let _this = this;
    img.onload = function(){
      let [width, height] = [this.width, this.height];
      let box = ReactDOM.findDOMNode(_this);
      let [boxWidth, boxHeight] = [box.offsetWidth, box.offsetHeight]
      let ratio = Math.min(boxWidth / width, boxHeight / height);
      _this.setState({
        loader: false,
        ratio: ratio,
        rotate: 0,
        positionX: (boxWidth - width * ratio) / 2,
        positionY: (boxHeight - height * ratio) / 2,
        width: this.width,
        height: this.height,
        boxWidth: boxWidth,
        boxHeight: boxHeight
      })
    };
    img.src = props.src;
  },
  handleRotate: function(angle) {
    this.setState({
      rotate: (360 + this.state.rotate + angle) % 360
    })
  },
  handleZoom: function(direction) {
    let percent = direction > 0 ? ZOOM_STEP : 1 / ZOOM_STEP;
    let ratio = this.setZoomLimits(this.state.ratio * percent);
    let state = this. state;

    // Center image from container's center
    let offsetX = state.boxWidth / 2;
    let offsetY = state.boxHeight / 2;

    let bgCursorX = offsetX - state.positionX;
    let bgCursorY = offsetY - state.positionY;

    let bgRatioX = bgCursorX/(state.width * state.ratio);
    let bgRatioY = bgCursorY/(state.height * state.ratio);

    this.setState({
      ratio: ratio,
      positionX: offsetX - (state.width * ratio * bgRatioX),
      positionY: offsetY - (state.height * ratio * bgRatioY)
    })
  },
  setZoomLimits: function(size) {
    let state = this.state;
    let originalRatio = Math.min(state.boxWidth / state.width, state.boxHeight / state.height);
    if((size / originalRatio) > MAX_ZOOM_SIZE)
      return MAX_ZOOM_SIZE * originalRatio;
    else if((size / originalRatio) < MIN_ZOOM_SIZE)
      return MIN_ZOOM_SIZE * originalRatio;
    else
      return size;
  },
  handleWheel: function(ev) {
    if(this.isInsideImage(ev))
      this.handleZoom(ev.deltaY);
  },
  handleMouseMove: function(ev) {
    if(!this.startPoints)
      return;
    let state = this.state;
    let posX = ev.pageX - this.startPoints[0];
    let posY = ev.pageY - this.startPoints[1];
    this.startPoints = [ev.pageX, ev.pageY]
    this.setState({
      positionX: state.positionX + posX,
      positionY: state.positionY + posY
    });
  },
  handleMouseUp: function(ev) {
    this.startPoints = null;
  },
  handleMouseDown: function(ev) {
    if(!this.isInsideImage(ev) || ev.which != 1)
      return;
    this.startPoints = [ev.pageX, ev.pageY];
  },
  isInsideImage: function(ev) {
    let rect = ReactDOM.findDOMNode(this).getBoundingClientRect();
    if(ev.pageY < rect.top || ev.pageY > rect.bottom || ev.pageX < rect.left || ev.pageX > rect.right)
      return false;
    return true;
  },
  render: function() {
    let [props, state] = [this.props, this.state];
    let background = `url(${props.src})`;
    let loader;
    if(state.loader){
      background = 'none';
      loader = (
        <div className='lightbox-loader'>
          <i className="fa fa-3x fa-spinner fa-spin" />
        </div>
      )
    }
    let transform = `rotate(${state.rotate}deg)`;
    let styles = {
      height: '100%',
      backgroundImage: background,
      backgroundRepeat: 'no-repeat',
      backgroundSize: `${state.width * state.ratio}px ${state.height * state.ratio}px`,
      backgroundPosition: `${state.positionX}px ${state.positionY}px`,
      MsTransform: transform,
      WebkitTransform: transform,
      transform: transform
    }
    return (
      <div className='lightbox-content-center'>
        <div className='lightbox-image-container' style={styles}>
          {loader}
        </div>
        <ImageModifiers
          handleRotate={this.handleRotate}
          handleZoom={this.handleZoom}/>
      </div>
    )
  }
});