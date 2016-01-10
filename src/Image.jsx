'use strict';

var React = require('react');
var ReactDOM = require('react-dom');

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
      positionX: 'center',
      positionY: ''
    };
  },
  componentWillMount: function() {
    this.updateImageInitialSize(this.props);
  },
  componentWillReceiveProps: function(nextProps) {
    this.updateImageInitialSize(nextProps);
  },
  updateImageInitialSize: function(props) {
    let img = new Image();
    let _this = this;
    img.onload = function(){
      console.log(this.width);
      console.log(this.height);
      if(this.height > this.width)
        _this.setState({
          loader: false,
          sizeX: 'auto',
          sizeY: '100%'
        })
      else
        _this.setState({
          loader: false,
          sizeX: '100%',
          sizeY: 'auto'
        })
    };
    img.src = props.src;
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
    let styles = {
      height: '100%',
      backgroundImage: background,
      backgroundRepeat: 'no-repeat',
      backgroundSize: `${state.sizeX} ${state.sizeY}`,
      backgroundPosition: `${state.positionX} ${state.positionY}`
    }
    return (
      <div className='lightbox-content-center'>
        <div className='lightbox-image-container' style={styles}>
          {loader}
        </div>
      </div>
    )
  }
});