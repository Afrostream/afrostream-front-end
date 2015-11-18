'use strict';

import { index as index } from './index.controller';
import { index as sitemap } from './sitemap.controller';
import blogRouter from './blog';

export default function (app) {
  // blog
  app.use('/blog', blogRouter);

  // others
  app.get('/sitemap.xml', sitemap);
  app.get('/*', index);
}

