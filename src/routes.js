import React from 'react';
import { Route, IndexRoute } from 'react-router';


import App from './components/app';
import Counter from './components/counter';
import Quotient from './components/quotient';
import SliderPage from './components/sliderPage';


export default (
  <Route path="/" component={App}>
    <IndexRoute component={Counter}/>
    <Route path= "quotient" component = {Quotient}/>
    <Route path="slider" component = {SliderPage}/>
    </Route>
);
