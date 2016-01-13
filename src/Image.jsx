'use strict';

var React = require('react');
var ReactDOM = require('react-dom');
var ImageModifiers = require('./ImageModifiers');

module.exports = React.createClass({
  displayName: 'Image',
  propTypes: {
    src: React.PropTypes.string.isRequired
  },
  getInitialState: function() {
    return {
      loader: true,
      sizeX: '100%',
      sizeY: 'auto',
      positionX: 0,
      positionY: 0,
      rotate: 0,
      width: 0,
      height: 0
    };
  },
  componentWillMount: function() {
    this.resetImageInitialState(this.props);
  },
  componentWillReceiveProps: function(nextProps) {
    this.resetImageInitialState(nextProps);
  },
  componentDidMount: function() {
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
      let [sizeX, sizeY] = _this.getDefaultSize(this.width, this.height);
      _this.setState({
        loader: false,
        sizeX: sizeX,
        sizeY: sizeY,
        rotate: 0,
        width: this.width,
        height: this.height
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
    let percent = direction > 0 ? 5 : -5;
    let sizeX = parseInt(this.state.sizeX);
    let sizeY = parseInt(this.state.sizeY);
    if(!isNaN(sizeX)) {
      sizeX = `${sizeX + percent}%`;
      sizeY = 'auto';
    }
    else {
      sizeY = `${sizeY + percent}%`;
      sizeX = 'auto';
    }
    this.setState({
      sizeX: sizeX,
      sizeY: sizeY
    })
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
    if(this.isInsideImage(ev))
      this.startPoints = [ev.pageX, ev.pageY];
  },
  isInsideImage: function(ev) {
    let rect = ReactDOM.findDOMNode(this).getBoundingClientRect();
    if(ev.pageY < rect.top || ev.pageY > rect.bottom || ev.pageX < rect.left || ev.pageX > rect.right)
      return false;
    return true;
  },
  getDefaultSize: function(w, h) {
    if(h > w)
      return ['auto', '100%']
    else
      return ['100%', 'auto']
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
      backgroundSize: `${state.sizeX} ${state.sizeY}`,
      backgroundPosition: `calc(50% + ${state.positionX}px) calc(50% + ${state.positionY}px)`,
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