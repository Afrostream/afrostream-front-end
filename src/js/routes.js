'use strict';

import React from 'react'; // eslint-disable-line no-unused-vars
import {Route } from 'react-router';
import Application from './components/Application';
import HomePage from './components/HomePage';
import NoMatch from './components/NoMatch';

export default (
  <Route path="/" component={Application}>
    <Route path="/:category" component={HomePage} ignoreScrollBehavior={true}/>
    <Route path="*" component={NoMatch}/>
  </Route>
);
