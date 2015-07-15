'use strict';

import React from 'react'; // eslint-disable-line no-unused-vars
import { Redirect, Route } from 'react-router';
import Application from './components/Application';
import HomePage from './components/HomePage';

export default (
  <Route component={Application}>
    <Route path="/:category" component={HomePage}/>
    <Redirect from="/" to="/all"/>
  </Route>
);
