# React lightbox component

An image lightbox component for ReactJS. A demo can be viewed [here](http://jfcaiceo.github.io/react-lightbox-component/)

## Installation

`npm install react-lightbox-component`

## Basic Usage

```
var Lightbox = require('react-lightbox-component').Lightbox;

var LightboxView = React.createClass({
  render: function() {
    var images = [
      {
        src: 'some image url',
        title: 'image title',
        description: 'image description'
      }
    ];
    return (
      <Lightbox images={images} />
    );
  },
});
```

## License

MIT