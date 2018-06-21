import React from 'react';
import { ICONS_PATHS } from './constants/IconPaths';

export default class Icon extends React.Component {
  render(){
    const paths = ICONS_PATHS[this.props.icon].map((path, index) => {
            return <path key={`${this.props.icon}-path-${index}`} d={path} />
          });
    return (
      <svg
        width={`${this.props.size}px`}
        height={`${this.props.size}px`}
        viewBox="0 0 24 24"
        className={this.props.aditionalClass}
      >
        { paths }
      </svg>
    );
  }
}

Icon.defaultProps = {
  size: 25
};