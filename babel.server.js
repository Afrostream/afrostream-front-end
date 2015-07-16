require('babel/register')({
  stage: 0,
  plugins: ['typecheck']
});

if (process.env.NODE_ENV !== 'production') {
  if (!require('piping')({
      hook: true,
      ignore: /(\/\.|~$|\.json|\.scss$)/i
    })) {
    return;
  }
}

require('./lib/express');
