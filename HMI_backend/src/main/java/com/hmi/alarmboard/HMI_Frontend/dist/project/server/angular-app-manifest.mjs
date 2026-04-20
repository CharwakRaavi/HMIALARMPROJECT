
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: '/',
  locale: undefined,
  routes: [
  {
    "renderMode": 2,
    "route": "/"
  },
  {
    "renderMode": 2,
    "redirectTo": "/",
    "route": "/**"
  }
],
  entryPointToBrowserMapping: undefined,
  assets: {
    'index.csr.html': {size: 4972, hash: 'fbad6db96786ca6259f42e23fdfe9336234ff6287c2d42b013abd871d7a3236a', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 945, hash: 'ab671c4e3ca4f7add0ed676d8251f889a39e75ec33adcee2f27b1e677faa5e04', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'index.html': {size: 16979, hash: 'd123bee00be30fc6ae09c8fde2e7c81a7061c25dcd7086b2cb34ceef0afa503f', text: () => import('./assets-chunks/index_html.mjs').then(m => m.default)},
    'styles-JG7EAGFK.css': {size: 230853, hash: 'YlmivfEfBiI', text: () => import('./assets-chunks/styles-JG7EAGFK_css.mjs').then(m => m.default)}
  },
};
