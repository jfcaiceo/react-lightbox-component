# React lightbox component

An image lightbox component for ReactJS. A demo can be viewed [here](http://jfcaiceo.github.io/react-lightbox-component/)

Features:
 * Zoom control
 * Rotate control
 * Smooth animations
 * Customizable thumbnails

## Demo

![Demo](https://cloud.githubusercontent.com/assets/1148446/14229009/47b39356-f8fe-11e5-8f70-87690242ddcc.gif)

## Installation

`npm install react-lightbox-component`

## Basic Usage

```
import Lightbox from 'react-lightbox-component';

const App = () => (
  <div>
    <Lightbox images={
      [
        {
          src: 'some image url',
          title: 'image title',
          description: 'image description'
        }
      ]
    }/>
  </div>
);
```

## License

MIT