export async function notFound (err) {
  if (err.status && err.status === 404 || err.status === 500) {
    return {
      body: {
        type: 'error',
        title: 'Non trouvé',
        synopsis: 'Désolé, ce contenu n’est plus disponible',
        poster: {
          path: '/production/poster/2016/02/fac002d7261011bc2aea-1920x1080.jpg'
        }
      }
    }
  }
  return null
}

export async function notFoundArray (err) {
  if (err.status && err.status === 404 || err.status === 500) {
    return {
      body: []
    }
  }
  return null
}

export async function notFoundVideo (err) {
  if (err.status && (err.status === 404 || err.status === 500)) {
    return {
      body: {
        type: 'error',
        title: 'Non trouvé',
        synopsis: 'Désolé, ce contenu n’est plus disponible',
        poster: {
          imgix: '/production/poster/2016/02/fac002d7261011bc2aea-1920x1080.jpg'
        }
      }
    }
  }
  return null
}

export async function notFoundPost (err) {
  if (err.status && (err.status === 404 || err.status === 500)) {
    return {
      body: {
        type: 'error',
        title: 'Post non trouvé',
        description: 'Désolé, ce contenu n’est plus disponible',
        body: 'Désolé, ce contenu n’est plus disponible',
        poster: {
          imgix: '/production/poster/2016/02/fac002d7261011bc2aea-1920x1080.jpg'
        }
      }
    }
  }
  return null
}

export async function notFoundCategory (err) {
  if (err.status && (err.status === 404 || err.status === 500)) {
    return {
      body: {
        type: 'error',
        label: 'Désolé, ce contenu n’est plus disponible',
        adSpots: [],
        movies: [],
        poster: {
          imgix: '/production/poster/2016/02/fac002d7261011bc2aea-1920x1080.jpg'
        }
      }
    }
  }
  return null
}
