// import React from 'react';
// import ReactDOM from 'react-dom';
// import App from './App';

// ReactDOM.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>,
//   document.getElementById('root')
// );


import App from './App';
import React from 'react';
import ReactDOM from 'react-dom/client';
import {BrowserRouter } from 'react-router-dom'
// import { render } from 'react-dom';

const root=ReactDOM.createRoot(document.getElementById('root'))


root.render(

  <BrowserRouter >
  {<App />}
  </BrowserRouter>,
  
);


// import App from './App';
// import React from 'react';
// import ReactDOM from 'react-dom';
// import {BrowserRouter } from 'react-router-dom'


// ReactDOM.render(
//     <BrowserRouter>
//         <App />
//     </BrowserRouter>,
//     document.getElementById('root')
// );
