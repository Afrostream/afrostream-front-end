import request from 'superagent'
import Promise from 'bluebird'
import qs from 'qs'
import _ from 'lodash'

const HOST = 'https://www.omdbapi.com/',
  TYPES = ['movie', 'series', 'episode']

// Series have a different format to describe years, so account for that when we
/// format it. For example,
// "1989" == 1998
// "1989-" == { from: 1989, to: undefined }
// "1989-2014" == { from: 1989, to: 2014 }
function formatYear (year) {
  let from, to

  year = year.split('–')

  if (year.length === 2) {
    from = +year[0]

    if (year[1]) {
      to = +year[1]
    }

    return {from: from, to: to}
  }

  return +year
}

// Format strings of hours & minutes into minutes. For example,
// "1 h 30 min" == 90.
function formatRuntime (raw) {
  let hours, minutes

  if (!raw) {
    return null
  }

  hours = raw.match(/(\d+) h/)
  minutes = raw.match(/(\d+) min/)

  hours = hours ? hours[1] : 0
  minutes = minutes ? +minutes[1] : 0

  return (hours * 60) + minutes
}

// Convert votes from a US formatted string of a number to a Number.
function formatVotes (raw) {
  return raw ? +raw.match(/\d/g).join('') : null
}

// Remove all the strings found within brackets and split by comma.
function formatList (raw) {
  let list

  if (!raw) {
    return []
  }

  list = raw.replace(/\(.+?\)/g, '').split(', ')
  list = list.map(function (item) {
    return item.trim()
  })

  return list
}

// Try to find the win and nomination count, but also keep raw just in case.
function formatAwards (raw) {
  let wins, nominations

  if (!raw) {
    return {wins: 0, nominations: 0, text: ''}
  }

  wins = raw.match(/(\d+) wins?/i)
  nominations = raw.match(/(\d+) nominations?/i)

  return {
    wins: wins ? +wins[1] : 0,
    nominations: nominations ? +nominations[1] : 0,
    text: raw
  }
}

// Search for movies by titles.
export async function search ({value, year = '', type = '', r = 'json', method = 'GET'}) {
  let query = {}, body = {}

  query.s = value
  query.y = year
  query.type = type
  query.r = r

  return await new Promise((resolve, reject) => {
    if (!query.s) {
      return reject('No search terms specified.')
    }

    if (query.type) {
      if (TYPES.indexOf(query.type) < 0) {
        return reject('Invalid type specified. Valid types are: ' +
          TYPES.join(', ') + '.')
      }
    }

    if (query.y) {
      query.y = parseInt(query.y, 10)

      if (isNaN(query.y)) {
        return reject('Year is not an integer.')
      }
    }

    request(method, HOST)
      .query(qs.stringify(query))
      .send(body)
      .set('Content-Type', 'application/json')
      .end((err, res) => {
        if (err) {
          console.log(err)
          return reject(err)
        }
        let results = res.body.Search
        results = _.uniqBy(results, 'Title')
        results = _.filter(results, (item)=> {
          return item.Poster && item.Poster != 'N/A'
        })

        return resolve(results)
      })
  })

  //needle.request('get', HOST, query, function (err, res, movies) {
  //  if (err) {
  //    return done(err)
  //  }
  //
  //  if (res.statusCode !== 200) {
  //    return done(new Error('status code: ' + res.statusCode))
  //  }
  //
  //  // If no movies are found, the API returns
  //  // "{"Response":"False","Error":"Movie not found!"}" instead of an
  //  // empty array. So in this case, return an empty array to be consistent.
  //  if (movies.Response === 'False') {
  //    return done(null, [])
  //  }
  //  //
  //  // Fix the ugly capitalized naming and cast the year as a Number.
  //  done(null, movies.Search.map(function (movie) {
  //    return {
  //      title: movie.Title,
  //      year: formatYear(movie.Year),
  //      imdb: movie.imdbID,
  //      type: movie.Type,
  //      poster: movie.Poster
  //    }
  //  }))
  //})
}
