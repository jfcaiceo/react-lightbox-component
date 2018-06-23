import React from 'react';
import Lightbox from '../lib';

const App = () => {
  const images = [
    {
      src: 'https://upload.wikimedia.org/wikipedia/commons/8/89/Ropy_pahoehoe.jpg',
      title: 'Ropy pahoehoe',
      description: 'By Tari Noelani Mattox. Licensed under Public Domain via Commons'
    },
    {
      src: 'https://upload.wikimedia.org/wikipedia/commons/7/73/Pyroclastic_flows_at_Mayon_Volcano.jpg',
      title: 'Pyroclastic flows at Mayon Volcano',
      description: 'By C.G. Newhall. Licensed under Public Domain via Commons'
    },
    {
      src: 'https://upload.wikimedia.org/wikipedia/commons/f/f3/Okataina.jpg',
      title: 'Okataina',
      description: 'By Richard Waitt. Licensed under Public Domain via Commons'
    }
  ];
  return (
    <div className='container'>
      <div className='row'>
        <h3 className='page-header'>{ "React lightbox component examples" }</h3>
      </div>
      <div className="row">
        <h4>{ "Basic example" }</h4>
        <div className="col-md-6">
          <Lightbox images={ images }/>
        </div>
        <div className="col-md-6">
          <pre>
            <code className="javascript">{ `var images = {
  [
    {
      src: 'some image url',
      title: 'image title',
      description: 'image description'
    },
    ...
  ]
}` } </code>
          </pre>
          <pre>
            <code className="html">{ `<Lightbox images={images} />;` }</code>
          </pre>
        </div>
      </div>
      <div className="row">
        <h4>{ "Image gallery" }</h4>
        <div className="col-md-6">
          <Lightbox images={ images } showImageModifiers={false}/>
        </div>
        <div className="col-md-6">
          <pre>
            <code className="html">{ `<Lightbox
  images={images}
  showImageModifiers={false}/>` }
            </code>
          </pre>
        </div>
      </div>
      <div className="row">
        <h4>{ "Change thumbnails size" }</h4>
        <div className="col-md-6">
          <Lightbox images={ images }
                    thumbnailWidth='150px'
                    thumbnailHeight='150px'/>
        </div>
        <div className="col-md-6">
          <pre>
            <code className="html">{ `<Lightbox
  images={images}
  thumbnailWidth='150px'
  thumbnailHeight='150px'/>;`}
            </code>
          </pre>
        </div>
      </div>
      <div className="row">
        <h4>{ "Customize thumbnails" }</h4>
        <div className="col-md-6">
          <Lightbox images={ images }
                    renderImageFunc={(idx, image, toggleLightbox, width, height) => {
                      return (
                        <img
                          key={idx}
                          src={image.src}
                          className='img-circle'
                          style={{width: width, height: height}}
                          onClick={toggleLightbox.bind(null, idx)} />
                      )
                    }} />
        </div>
        <div className="col-md-6">
          <pre>
            <code className="html">{ `<Lightbox
  images={images}
  renderImageFunc={(idx, image, toggleLightbox, width, height) => {
    return (
      <img
        key={idx}
        src={image.src}
        className='img-circle'
        style={{width: width, height: height}}
        onClick={toggleLightbox.bind(null, idx)} />
    )
  }}/>;` }
            </code>
          </pre>
        </div>
      </div>
      <div className="row">
        <h4>{ "Customize Descriptions" }</h4>
        <div className="col-md-6">
          <Lightbox images={ images }
                    renderDescriptionFunc={(image) => {
                      return (
                        <div style={{color: 'red'}}>
                          { image.description + ' (' + image.src + ')' }
                        </div>
                      )
                    }} />
        </div>
        <div className="col-md-6">
          <pre>
            <code className="html">{ `<Lightbox
  images={images}
  renderDescriptionFunc={(image) => {
    return (
      <div style={{color: 'red'}}>
        { image.description + ' (' + image.src + ')' }
      </div>
    )
  }}/>` }
            </code>
          </pre>
        </div>
      </div>
    </div>
  )
};

export default App;
