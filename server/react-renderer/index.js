const express = require('express');

if (process.NODE_ENV === 'development') {
  require('babel-core/register');
}
const render = require('./render.js');

/*
 * This code ask react a rendering.
 */
module.exports.get = ({layout='layouts/main', payload={}}) => {
  return (req, res) => {
    render(req, res, layout, {payload})
  }
}
