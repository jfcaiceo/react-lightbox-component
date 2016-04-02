'use strict';

(function () {
  hljs.initHighlightingOnLoad();
  var images = [{
    src: 'https://upload.wikimedia.org/wikipedia/commons/8/89/Ropy_pahoehoe.jpg',
    title: 'Ropy pahoehoe',
    description: 'By Tari Noelani Mattox. Licensed under Public Domain via Commons'
  }, {
    src: 'https://upload.wikimedia.org/wikipedia/commons/7/73/Pyroclastic_flows_at_Mayon_Volcano.jpg',
    title: 'Pyroclastic flows at Mayon Volcano',
    description: 'By C.G. Newhall. Licensed under Public Domain via Commons'
  }, {
    src: 'https://upload.wikimedia.org/wikipedia/commons/f/f3/Okataina.jpg',
    title: 'Okataina',
    description: 'By Richard Waitt. Licensed under Public Domain via Commons'
  }];

  // Simple basic example
  ReactDOM.render(React.createElement(ReactLightbox.Lightbox, { images: images }), document.getElementById('basic-example'));
  // Hide image modifiers, and show only the image gallery
  ReactDOM.render(React.createElement(ReactLightbox.Lightbox, { images: images, showImageModifiers: false }), document.getElementById('image-gallery'));
  // Set custom thumbnail sizes
  ReactDOM.render(React.createElement(ReactLightbox.Lightbox, { images: images, thumbnailWidth: '150px', thumbnailHeight: '150px' }), document.getElementById('thumbnails-size'));
  // Set custom thumbnail build function
  ReactDOM.render(React.createElement(ReactLightbox.Lightbox, {
    images: images,
    renderImageFunc: function renderImageFunc(idx, image, toggleLightbox, width, height) {
      return React.createElement('img', { key: idx, src: image.src, className: 'img-circle', style: { width: width, height: height }, onClick: toggleLightbox.bind(null, idx) });
    }
  }), document.getElementById('custom-thumbnails'));
  // Set custom description
  ReactDOM.render(React.createElement(ReactLightbox.Lightbox, {
    images: images,
    renderDescriptionFunc: function renderDescriptionFunc(image) {
      return React.createElement(
        'div',
        null,
        React.createElement(
          'p',
          { style: { color: 'red' } },
          image.description + ' (' + image.src + ')'
        )
      );
    }
  }), document.getElementById('custom-descriptions'));
})();