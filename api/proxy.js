// const { createProxyMiddleware } = require('http-proxy-middleware')

// module.exports = (req, res) => {
//   let target = ''

//   if (req.url.startsWith('/ache')) {
//     target = 'https://zhang.beer'
//   }

//   createProxyMiddleware({
//     target,
//     changeOrigin: true,
//     pathRewrite: {
//       // 通过路径重写，去除请求路径中的 `/ache`
//       // 例如 /ache/login 将被转发到 https://zhang.beer/login
//       // '^/ache/': '/'
//     },
//   })(req, res)
// }

const { createProxyMiddleware } = require('http-proxy-middleware')

module.exports = (req, res) => {
  let target = ''

  if (req.url.startsWith('/ache')) {
    target = 'https://zhang.beer'
  }

  // 获取客户端真实 IP 地址
  const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress

  createProxyMiddleware({
    target,
    changeOrigin: true,
    onProxyReq(proxyReq) {
      // 在请求头中添加 X-Forwarded-For 字段
      proxyReq.setHeader('X-Forwarded-For', clientIp)
    },
  })(req, res)
}
