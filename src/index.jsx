console.log("Hello World!");

import React from 'react';
import ReactDOM from 'react-dom';
import HiMom from './components/Hi-Mom';

let expectedProps = {
    className: 'hi-mom',
    text : 'Momma, look what I can do!!!!!'
};



ReactDOM.render(
  <HiMom {...expectedProps}/>,
  document.getElementById('app')
);
