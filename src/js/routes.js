'use strict';

import React from 'react'; // eslint-disable-line no-unused-vars
import { Redirect, Route } from 'react-router';
import Application from './components/Application';
import HomePage from './components/HomePage';
import UserPage from './components/UserPage';

export default (
  <Route component={Application}>
    <Route path="/:category" component={HomePage}/>
    <Route name="tvshow_universe">
      <Route path="/user/:username" component={UserPage}/>
    </Route>
    <Redirect from="/" to="/all"/>
  </Route>
);
