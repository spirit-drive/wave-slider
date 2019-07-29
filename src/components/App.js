import React from 'react';
import Slider from './Slider';
import './App.styl';

const App = () => (
  <div className="App">
    <Slider>
      <div
        className="slide"
        style={{
          backgroundSize: 'cover',
          backgroundImage: 'url(https://www.nastol.com.ua/pic/201404/2560x1600/nastol.com.ua-92859.jpg)',
        }}
      >
        1
      </div>
      <div
        className="slide"
        style={{
          backgroundSize: 'cover',
          backgroundImage: 'url(https://img2.goodfon.ru/original/2048x1365/2/92/priroda-nebo-oblaka-ozero.jpg)',
        }}
      >
        2
      </div>
      <div
        className="slide"
        style={{ backgroundSize: 'cover', backgroundImage: 'url(https://arte1.ru/images/detailed/4/23377.jpg)' }}
      >
        3
      </div>
      <div
        className="slide"
        style={{
          backgroundSize: 'cover',
          backgroundImage: 'url(https://oboi.ws/originals/original_7302_oboi_leto_v_derevne_2560x1600.jpg)',
        }}
      >
        4
      </div>
      <div
        className="slide"
        style={{
          backgroundSize: 'cover',
          backgroundImage:
            'url(https://dvdkng.files.wordpress.com/2017/04/cropped-yosemite-mac-x-stock-wallpaper-hd-1.jpg)',
        }}
      >
        5
      </div>
      <div
        className="slide"
        style={{
          backgroundSize: 'cover',
          backgroundImage: 'url(https://www.ejin.ru/wp-content/uploads/2019/05/rassvet-v-gorah.jpg)',
        }}
      >
        6
      </div>
    </Slider>
    {/* <Slider className="slider" withFixedWidth={false}> */}
    {/*  <div */}
    {/*    className="slide" */}
    {/*    style={{ */}
    {/*      backgroundSize: 'cover', */}
    {/*      backgroundImage: 'url(https://www.nastol.com.ua/pic/201404/2560x1600/nastol.com.ua-92859.jpg)', */}
    {/*    }} */}
    {/*  > */}
    {/*    1 */}
    {/*  </div> */}
    {/*  <div */}
    {/*    className="slide" */}
    {/*    style={{ */}
    {/*      backgroundSize: 'cover', */}
    {/*      backgroundImage: 'url(https://img2.goodfon.ru/original/2048x1365/2/92/priroda-nebo-oblaka-ozero.jpg)', */}
    {/*    }} */}
    {/*  > */}
    {/*    2 */}
    {/*  </div> */}
    {/*  <div */}
    {/*    className="slide" */}
    {/*    style={{ backgroundSize: 'cover', backgroundImage: 'url(https://arte1.ru/images/detailed/4/23377.jpg)' }} */}
    {/*  > */}
    {/*    3 */}
    {/*  </div> */}
    {/*  <div */}
    {/*    className="slide" */}
    {/*    style={{ */}
    {/*      backgroundSize: 'cover', */}
    {/*      backgroundImage: 'url(https://oboi.ws/originals/original_7302_oboi_leto_v_derevne_2560x1600.jpg)', */}
    {/*    }} */}
    {/*  > */}
    {/*    4 */}
    {/*  </div> */}
    {/*  <div */}
    {/*    className="slide" */}
    {/*    style={{ */}
    {/*      backgroundSize: 'cover', */}
    {/*      backgroundImage: */}
    {/*        'url(https://dvdkng.files.wordpress.com/2017/04/cropped-yosemite-mac-x-stock-wallpaper-hd-1.jpg)', */}
    {/*    }} */}
    {/*  > */}
    {/*    5 */}
    {/*  </div> */}
    {/*  <div */}
    {/*    className="slide" */}
    {/*    style={{ */}
    {/*      backgroundSize: 'cover', */}
    {/*      backgroundImage: 'url(https://www.ejin.ru/wp-content/uploads/2019/05/rassvet-v-gorah.jpg)', */}
    {/*    }} */}
    {/*  > */}
    {/*    6 */}
    {/*  </div> */}
    {/* </Slider> */}
    {/* <Slider className="slider" withFixedWidth={false}> */}
    {/*  <div className="slide" style={{ backgroundColor: '#fcc' }}> */}
    {/*    1 */}
    {/*  </div> */}
    {/*  <div className="slide" style={{ backgroundColor: '#cfc' }}> */}
    {/*    2 */}
    {/*  </div> */}
    {/*  <div className="slide" style={{ backgroundColor: '#ccf' }}> */}
    {/*    3 */}
    {/*  </div> */}
    {/*  <div className="slide" style={{ backgroundColor: '#fec' }}> */}
    {/*    4 */}
    {/*  </div> */}
    {/*  <div className="slide" style={{ backgroundColor: '#cfe' }}> */}
    {/*    5 */}
    {/*  </div> */}
    {/*  <div className="slide" style={{ backgroundColor: '#cef' }}> */}
    {/*    6 */}
    {/*  </div> */}
    {/* </Slider> */}
  </div>
);

export default App;
