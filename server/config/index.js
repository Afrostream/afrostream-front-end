module.exports = {
  host: '0.0.0.0',
  ip: process.env.IP || undefined,
  port: process.env.PORT ||
        process.env.USER === 'marc' && 80 || // (to bind 80: sudo setcap cap_net_bind_service=+ep `which node`)
        3000
};
