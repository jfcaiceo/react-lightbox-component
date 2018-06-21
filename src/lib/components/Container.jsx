'use strict';

import React from 'react';
import { CSSTransitionGroup } from 'react-transition-group'
import PropTypes from 'prop-types';
import ImageContent from './Image';
import { addClass, removeClass, classToggle } from './utils/ClassNames';
import './Container.css'

export default class Container extends React.Component {
  constructor(props) {
    super(props);
    this.handleLeftClick = this.handleLeftClick.bind(this);
    this.handleRightClick = this.handleRightClick.bind(this);
    this.canMoveToLeft = this.canMoveToLeft.bind(this);
    this.canMoveToRight = this.canMoveToRight.bind(this);
    this.toggleControls = this.toggleControls.bind(this);
    this.state = {
      selectedImageIndex: props.selectedImage,
      direction: 'none'
    };
  }

  componentDidMount() {
    const scrollTop = document.body.scrollTop;
    addClass(document.documentElement, 'lightbox-open');
    document.documentElement.style.top = `-${scrollTop}px`;
    document.body.scroll = "no"; // ie only
  }

  componentWillUnmount() {
    const scrollTop = Math.abs(parseInt(document.documentElement.style.top))
    removeClass(document.documentElement, 'lightbox-open');
    document.documentElement.style.top = null;
    document.body.scrollTop = scrollTop
    document.body.scroll = "yes"; // ie only
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
    let description = props.renderDescriptionFunc.call(this, image);
    const transitionName = 'lightbox-transition-image';

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
        <CSSTransitionGroup transitionName={transitionName}
                                 transitionAppear={true}
                                 transitionAppearTimeout={300}
                                 transitionEnterTimeout={300}
                                 transitionLeaveTimeout={300}
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
  renderDescriptionFunc: (image) => {
    return (
      <div>
        {image.description}
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
