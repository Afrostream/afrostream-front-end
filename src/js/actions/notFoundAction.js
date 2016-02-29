export async function notFound(err) {
  if (err.status && err.status === 404) {
    return {
      body: {
        type: 'error',
        title: 'Non trouvé',
        synopsis: 'Désolé, ce contenu n’est plus disponible',
        poster: {
          imgix: 'https://afrostream.imgix.net/production/poster/2016/02/fac002d7261011bc2aea-1920x1080.jpg'
        }
      }
    };
  }
  return null;
}

export async function notFoundArray(err) {
  if (err.status && err.status === 404) {
    return {
      body: []
    }
  }
  return null;
}

export async function notFoundVideo(err) {
  if (err.status && (err.status === 404 || err.status === 500)) {
    return {
      body: {
        type: 'error',
        title: 'Non trouvé',
        synopsis: 'Désolé, ce contenu n’est plus disponible',
        poster: {
          imgix: 'https://afrostream.imgix.net/production/poster/2016/02/fac002d7261011bc2aea-1920x1080.jpg'
        }
      }
    }
  }
  return null;
}