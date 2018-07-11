import React from 'react';
import { CSSTransitionGroup } from 'react-transition-group'
import PropTypes from 'prop-types';
import ImageContent from './Image';
import Button from './Button';
import { addClass, removeClass, classToggle } from './utils/classNames';
import './Container.css'

const transitionTime = 300;
const transitionDelta = 50;
export default class Container extends React.Component {
  constructor(props) {
    super(props);
    this.handleLeftClick = this.handleLeftClick.bind(this);
    this.handleRightClick = this.handleRightClick.bind(this);
    this.canMoveToLeft = this.canMoveToLeft.bind(this);
    this.canMoveToRight = this.canMoveToRight.bind(this);
    this.toggleControls = this.toggleControls.bind(this);
    this.handleKeyboard = this.handleKeyboard.bind(this);
    this.getDescriptions = this.getDescriptions.bind(this);
    this.state = {
      selectedImageIndex: props.selectedImage,
      direction: 'none',
      imagesDescriptions: {}
    };
  }

  getDescriptions(){
    let images = this.state.imagesDescriptions;
    this.props.images.forEach((image, index) => {
      if(!image.description) return;
      if(image.description.then){ //if promise
        image.description.then((data) => {
          images[index] = data;
          this.setState({imagesDescriptions: images});
        });
        return;
      }
      images[index] = image.description;
      this.setState({imagesDescriptions: images});
    });
  }

  componentDidMount() {
    this.getDescriptions();
    document.addEventListener('keydown', this.handleKeyboard);
    const scrollTop = document.body.scrollTop;
    addClass(document.documentElement, 'lightbox-open');
    document.documentElement.style.top = `-${scrollTop}px`;
    document.body.scroll = "no"; // ie only
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyboard);
    const scrollTop = Math.abs(parseInt(document.documentElement.style.top, 10))
    removeClass(document.documentElement, 'lightbox-open');
    document.documentElement.style.top = null;
    document.body.scrollTop = scrollTop
    document.body.scroll = "yes"; // ie only
  }

  handleKeyboard(ev) {
    const key = ev.keyCode ? ev.keyCode : ev.which;
    if(this.timeLastTransition &&
      ((new Date()) - this.timeLastTransition) < transitionTime + transitionDelta) {
      return;
    }
    this.timeLastTransition = new Date();
    switch(key){
      case 37:
        return this.handleLeftClick();
      case 39:
        return this.handleRightClick();
      case 27:
        return this.props.toggleLightbox();
      default:
        break;
    }
  }

  handleLeftClick(){
    if (this.canMoveToLeft()) {
      this.setState({
        selectedImageIndex: (this.state.selectedImageIndex - 1),
        direction: 'left'
      });
    };
  }

  handleRightClick(){
    if (this.canMoveToRight()) {
      this.setState({
        selectedImageIndex: (this.state.selectedImageIndex + 1),
        direction: 'right'
      });
    };
  }

  canMoveToLeft() {
    return (this.state.selectedImageIndex > 0)
  }

  canMoveToRight() {
    return (this.state.selectedImageIndex < (this.props.images.length - 1))
  }

  toggleControls() {
    classToggle(this.refs.container, 'hide-controls')
  }

  render() {
    let [props, state] = [this.props, this.state];
    let image = props.images[state.selectedImageIndex];
    let leftButton, rightButton;
    let descriptionText = state.imagesDescriptions[state.selectedImageIndex];
    let description = props.renderDescriptionFunc.call(this, descriptionText);
    const transitionName = 'lightbox-transition-image';

    if(this.canMoveToLeft())
      leftButton = (
        <div className='lightbox-btn-left'>
          <Button icon="left-arrow" onClick={this.handleLeftClick} size={ 56 } hasRipple={ true } />
        </div>
      )
    if(this.canMoveToRight())
      rightButton = (
        <div className='lightbox-btn-right'>
          <Button icon="right-arrow" onClick={this.handleRightClick} size={ 56 } hasRipple={ true } />
        </div>
      )
    return (
      <div className='lightbox-backdrop' ref='container'>
        <div className='lightbox-btn-close'>
          <Button icon="back-arrow" onClick={props.toggleLightbox} size={ 34 } hasRipple={ true } />
        </div>
        <div className='lightbox-title-content'>
          <div className='lightbox-title'>
            {image.title}
          </div>
          <div className='lightbox-description'>
            {description}
          </div>
        </div>
        <CSSTransitionGroup transitionAppear={true}
                            transitionAppearTimeout={transitionTime}
                            transitionEnterTimeout={transitionTime}
                            transitionLeaveTimeout={transitionTime}
                            transitionName={ {
                              enter: `${transitionName}-enter-${state.direction}`,
                              enterActive: `${transitionName}-enter-${state.direction}-active`,
                              leave: `${transitionName}-leave-${state.direction}`,
                              leaveActive: `${transitionName}-leave-${state.direction}-active`,
                              appear: `${transitionName}-appear`,
                              appearActive: `${transitionName}-appear-active`
                            } }>
          <ImageContent key={image.src}
                        src={image.src}
                        showImageModifiers={props.showImageModifiers}
                        toggleControls={this.toggleControls} />
        </CSSTransitionGroup>
        {leftButton}
        {rightButton}
      </div>
    )
  }
}

Container.defaultProps = {
  selectedImage: 0,
  renderDescriptionFunc: (descriptionText) => {
    return (
      <div>
        {String(descriptionText)}
      </div>
    )
  }
}

Container.propTypes = {
  selectedImage: PropTypes.number,
  images: PropTypes.array.isRequired,
  toggleLightbox: PropTypes.func.isRequired,
  showImageModifiers: PropTypes.bool,
  renderDescriptionFunc: PropTypes.func
}
