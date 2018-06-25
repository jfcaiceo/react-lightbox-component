import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import ImageModifiers from './ImageModifiers';
import Icon from './Icon';
import { containsClass } from './utils/classNames';
import './Image.css'

const ZOOM_STEP = 1.10;
const [MAX_ZOOM_SIZE, MIN_ZOOM_SIZE] = [Math.pow(ZOOM_STEP, 30), Math.pow(1 / ZOOM_STEP, 10)];

export default class ImageContent extends React.Component {
  constructor(props) {
    super(props);
    this.resetImageInitialState = this.resetImageInitialState.bind(this);
    this.handleWindowResize = this.handleWindowResize.bind(this);
    this.handleRotate = this.handleRotate.bind(this);
    this.handleZoom = this.handleZoom.bind(this);
    this.setZoomLimits = this.setZoomLimits.bind(this);
    this.handleWheel = this.handleWheel.bind(this);
    this.handleMove = this.handleMove.bind(this);
    this.handleMoveEnd = this.handleMoveEnd.bind(this);
    this.handleMoveStart = this.handleMoveStart.bind(this);
    this.isInsideImage = this.isInsideImage.bind(this);
    this.state = {
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
  }

  componentDidMount() {
    this.resetImageInitialState(this.props);
    this.startPoints = null;
    window.addEventListener('resize', this.handleWindowResize);
    document.addEventListener('mousedown', this.handleMoveStart);
    document.addEventListener('mouseup', this.handleMoveEnd);
    document.addEventListener('touchstart', this.handleMoveStart);
    document.addEventListener('touchend', this.handleMoveEnd);
    window.setTimeout(this.props.toggleControls, 500);
    if(this.props.showImageModifiers) {
      document.addEventListener('mousemove', this.handleMove);
      document.addEventListener('touchmove', this.handleMove);
      document.addEventListener('wheel', this.handleWheel);
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleWindowResize);
    document.removeEventListener('mousedown', this.handleMoveStart);
    document.removeEventListener('mousemove', this.handleMove);
    document.removeEventListener('mouseup', this.handleMoveEnd);
    document.removeEventListener('touchstart', this.handleMoveStart);
    document.removeEventListener('touchmove', this.handleMove);
    document.removeEventListener('touchend', this.handleMoveEnd);
    document.removeEventListener('wheel', this.handleWheel);
  }

  resetImageInitialState(props) {
    let img = new Image();
    let _this = this;
    img.onload = function(){
      let [width, height] = [this.width, this.height];
      let box = ReactDOM.findDOMNode(_this.refs.container);
      let [boxWidth, boxHeight] = [box.offsetWidth, box.offsetHeight]
      let ratio = Math.min(boxWidth / width, boxHeight / height);
      if(isNaN(ratio))
        ratio = 1;
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
      })
    };
    img.src = props.src;
  }

  handleWindowResize() {
    this.resetImageInitialState(this.props);
  }

  handleRotate(angle) {
    this.setState({
      rotate: (360 + this.state.rotate + angle) % 360
    })
  }

  handleZoom(direction, scale) {
    if(!scale)
      scale = 1;
    let percent = direction > 0 ? Math.pow(ZOOM_STEP, scale) : Math.pow(1 / ZOOM_STEP, scale);
    let ratio = this.setZoomLimits(this.state.ratio * percent);
    let state = this.state;
    let delta = 0.05;
    let newPositionX, newPositionY

    if(Math.min(state.boxWidth / state.width, state.boxHeight / state.height) >= (ratio - delta) ){
      newPositionX = (state.boxWidth - state.width * ratio) / 2;
      newPositionY = (state.boxHeight - state.height * ratio) / 2;
    }
    else {
      // Center image from container's center
      let offsetX = state.boxWidth / 2;
      let offsetY = state.boxHeight / 2;

      let bgCursorX = offsetX - state.positionX;
      let bgCursorY = offsetY - state.positionY;

      let bgRatioX = bgCursorX/(state.width * state.ratio);
      let bgRatioY = bgCursorY/(state.height * state.ratio);

      newPositionX = offsetX - (state.width * ratio * bgRatioX);
      newPositionY = offsetY - (state.height * ratio * bgRatioY);
    }

    this.setState({
      ratio: ratio,
      positionX: newPositionX,
      positionY: newPositionY
    })
  }

  setZoomLimits(size) {
    let state = this.state;
    let originalRatio = Math.min(state.boxWidth / state.width, state.boxHeight / state.height);
    if((size / originalRatio) > MAX_ZOOM_SIZE)
      return MAX_ZOOM_SIZE * originalRatio;
    else if((size / originalRatio) < MIN_ZOOM_SIZE)
      return MIN_ZOOM_SIZE * originalRatio;
    else
      return size;
  }

  handleWheel(ev) {
    if(this.isInsideImage(ev))
      this.handleZoom(ev.deltaY);
  }

  handleMove(ev) {
    ev = this.getEv(ev);
    let state = this.state;
    if(!state.moving)
      return;
    let posX, posY;
    switch(state.rotate) {
      case 90:
        posY = this.startPoints[0] - ev.pageX;
        posX = ev.pageY - this.startPoints[1];
        break;
      case 180:
        posX = this.startPoints[0] - ev.pageX
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
    this.startPoints = [ev.pageX, ev.pageY]

    if(state.positionX + posX >= 0 || state.positionX + posX <= (state.boxWidth - state.width * state.ratio))
      posX = 0;
    if(state.positionY + posY >= 0 || state.positionY + posY <= (state.boxHeight - state.height * state.ratio))
      posY = 0;

    this.setState({
      positionX: state.positionX + posX,
      positionY: state.positionY + posY
    });
  }

  handleMoveEnd(ev) {
    this.setState({
      moving: false
    })
  }

  handleMoveStart(ev) {
    ev = this.getEv(ev);
    if(!this.isInsideImage(ev) || ev.which !== 1)
      return;
    this.startPoints = [ev.pageX, ev.pageY];
    this.setState({
      moving: true
    })
    const _this = this;

    // check if touch was a tap
    window.setTimeout(function () {
      if (!_this.state.moving && _this.startPoints
        && _this.startPoints[0] === ev.pageX
        && _this.startPoints[1] === ev.pageY
        && containsClass(ev.target, ['lightbox-backdrop', 'lightbox-image'])) {
        _this.props.toggleControls();
      }
    }, 200);
  }

  isInsideImage(ev) {
    let rect = ReactDOM.findDOMNode(this.refs.container).getBoundingClientRect();
    if(ev.pageY < rect.top || ev.pageY > rect.bottom || ev.pageX < rect.left || ev.pageX > rect.right)
      return false;
    return true;
  }

  getEv(ev) {
    if(ev.type === 'touchstart' || ev.type === 'touchmove' || ev.type === 'touchend')
      return {pageX: ev.touches[0].pageX, pageY: ev.touches[0].pageY, which: 1, target: ev.target}
    return ev
  }

  render() {
    let [props, state] = [this.props, this.state];
    let background = `url(${props.src})`;
    let modifiers, loader;
    if(props.showImageModifiers) {
      modifiers = (
        <ImageModifiers
          handleRotate={this.handleRotate}
          handleZoom={this.handleZoom}
          currentImage={props.src}/>
      )
    }
    if(state.loader){
      background = 'none';
      loader = (
        <div className='lightbox-loader'>
          <Icon icon="spinner" size={ 58 } />
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
        {modifiers}
        <div className='lightbox-image-container' ref='container'>
          <div className={'lightbox-image' + (state.moving ? ' moving' : '')} style={styles}>
            {loader}
          </div>
        </div>
      </div>
    )
  }
}

Image.propTypes = {
  src: PropTypes.string.isRequired,
  showImageModifiers: PropTypes.bool.isRequired
}
