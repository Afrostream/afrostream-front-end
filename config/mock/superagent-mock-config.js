// ./superagent-mock-config.js file
import _ from 'lodash';
import *  as Fixtures from './fixtures';
import config from '../index';

const getPaginatedItems = function (items, page, per_page) {
  var page = page || 1,
    per_page = per_page || 3,
    offset = (page - 1) * per_page,
    paginatedItems = _.rest(items, offset).slice(0, per_page);
  return {
    page: page,
    per_page: per_page,
    total: items.length,
    total_pages: Math.ceil(items.length / per_page),
    data: paginatedItems
  };
};

const superAgentConfig = [,

  {
    pattern: `${config.apiServer.urlPrefix}/category/([a-z-]+)/top`,

    fixtures: Fixtures.CategoryMock,
    callback: function (match, data) {
      var datasPaginated = getPaginatedItems(data, 1, 5).data;
      return {
        body: datasPaginated
      };
    }
  },
  {
    pattern: `${config.apiServer.urlPrefix}/category/([a-z-]+)`,

    fixtures: Fixtures.CategoryMock,
    callback: function (match, data) {
      return {
        body: data
      };
    }
  },
  {
    pattern: `${config.apiServer.urlPrefix}/category`,

    fixtures: Fixtures.CategoryMenu,
    callback: function (match, data) {
      return {
        body: data
      };
    }
  }
];

export default superAgentConfig;
