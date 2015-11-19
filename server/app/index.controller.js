'use strict';

import fs from 'fs';
import path from 'path';

import config from '../../config';

import render from '../../lib/render';

export function index(req, res) {
  const layout = 'layouts/main';
  const payload = {
    jsPaths: req.app.get('jsPaths'),
    cssPaths: req.app.get('cssPaths'),
    initialState: {},
    body: ''
  };

  render(req, res, layout, {
    payload
  });
}