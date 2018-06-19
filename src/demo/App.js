import React from 'react';
import Lightbox from '../lib';

const App = () => (
  <div>
    <Lightbox images={ [
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
    ] }/>
  </div>
);

export default App;
