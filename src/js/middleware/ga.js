import {canUseDOM} from 'react/lib/ExecutionEnvironment'
import Immutable, { Map, List } from 'immutable';
import config from '../../../config/';
import ActionTypes from '../consts/ActionTypes';

if (canUseDOM) {
  var ga = require('react-ga');
}

export default function ({ getState }) {
  return (next) => (action) => {
    let actions = Immutable.fromJS(ActionTypes);
    let actionKey;
    actions.map(function (obj, key) {
      if (obj.get(action.type) !== undefined) {
        actionKey = key;
      }
    });
    //const map = actions.find(function (obj, key) {
    //  return obj.get(action.type) !== undefined ? key : false;
    //});
    if (canUseDOM) {
      ga.event({
        category: 'ActionDispatched',
        action: actionKey || 'undefined',
        label: action.type || 'undefined'
      });
    }

    return next(action);
  };
}

/*
 'use strict';
 if (typeof window !== 'undefined' && typeof GA_TRACKING_CODE !== 'undefined') {
 (function (window, document, script, url, r, tag, firstScriptTag) {
 window['GoogleAnalyticsObject'] = r;
 window[r] = window[r] || function () {
 (window[r].q = window[r].q || []).push(arguments)
 };
 window[r].l = 1 * new Date();
 tag = document.createElement(script),
 firstScriptTag = document.getElementsByTagName(script)[0];
 tag.async = 1;
 tag.src = url;
 firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
 })(
 window,
 document,
 'script',
 '//www.google-analytics.com/analytics.js',
 'ga'
 );

 var ga = window.ga;

 ga('create', GA_TRACKING_CODE, 'auto');

 module.exports = function () {
 return window.ga.apply(window.ga, arguments);
 };
 } else {
 module.exports = function () {
 console.log(arguments)
 };
 }
 */
