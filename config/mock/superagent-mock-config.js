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
    pattern: `${config.apiServer.urlPrefix}/movie/([\\w-]+)/season`,

    fixtures: Fixtures.SeasonMock,
    callback: function (match, data) {
      //var list = Fixtures.CategoryMock;
      //console.log(list.length);
      //
      //var final = _.forEach(data, function (n) {
      //  n.episodes = _.shuffle(list).slice(0, _.random(Fixtures.MovieMock.length - 1));
      //});

      let movie = _.find(Fixtures.MovieMock(), function (item) {
        return item._id === match[1];
      });

      if (movie.type !== 'serie') {
        data = [];
      }

      return {
        body: data
      };
    }
  },
  {
    pattern: `${config.apiServer.urlPrefix}/movie/([\\w]+)`,

    fixtures: Fixtures.MovieMock,
    callback: function (match, data) {
      return {
        body: _.find(data, function (item) {
          return item._id === match[1];
        })
      };
    }
  },
  {
    pattern: `${config.apiServer.urlPrefix}/movie/([\\w]+)/([\\w-]+)`,

    fixtures: Fixtures.MovieMock,
    callback: function (match, data) {
      return {
        body: _.find(data, function (item) {
          return item._id === match[1] || item.slug === match[2];
        })
      };
    }
  },
  {
    pattern: `${config.apiServer.urlPrefix}/category/top`,

    fixtures: Fixtures.CategoryMock,
    callback: function (match, data) {
      var datasPaginated = getPaginatedItems(data, 1, 5).data;
      return {
        body: _.shuffle(datasPaginated)
      };
    }
  },
  {
    pattern: `${config.apiServer.urlPrefix}/category/menu`,

    fixtures: Fixtures.CategoryMenu,
    callback: function (match, data) {
      return {
        body: data
      };
    }
  },
  {
    pattern: `${config.apiServer.urlPrefix}/category/([\\w-]+)`,

    fixtures: Fixtures.CategoryMock,
    callback: function (match, data) {
      return {
        body: _.shuffle(data)
      };
    }
  },
  {
    pattern: `${config.apiServer.urlPrefix}/asset/([\\w-]+)`,

    fixtures: Fixtures.AssetMock,
    callback: function (match, data) {
      return {
        body: data
      };
    }
  }
];

export default superAgentConfig;
