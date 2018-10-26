const fs = require('fs')
const path = require('path')
const LRU = require('lru-cache')
const express = require('express')
const favicon = require('serve-favicon')
const compression = require('compression')
const microcache = require('route-cache')
const resolve = file => path.resolve(__dirname, file)
const { createBundleRenderer } = require('vue-server-renderer')

const isProd = process.env.NODE_ENV === 'production'
const useMicroCache = process.env.MICRO_CACHE !== 'false'
const serverInfo =
  `express/${require('express/package.json').version} ` +
  `vue-server-renderer/${require('vue-server-renderer/package.json').version}`

const app = express()

function createRenderer(bundle, options) {
  // https://github.com/vuejs/vue/blob/dev/packages/vue-server-renderer/README.md#why-use-bundlerenderer


  return createBundleRenderer(bundle, Object.assign(options, {
    // for component caching
    cache: LRU({
      max: 1000,
      maxAge: 1000 * 60 * 15
    }),
    // this is only needed when vue-server-renderer is npm-linked
    basedir: resolve('./dist'),
    // recommended for performance
    runInNewContext: false
  }))
}

let renderer = {}
let readyPromise = {}

const entryPath = require('./build/entryConfig.js')

const entry = entryPath('server')

if (isProd) {
  // In production: create server renderer using template and built server bundle.
  // The server bundle is generated by vue-ssr-webpack-plugin.

  Object.keys(entry).forEach(e => {

    const templatePath = resolve(`./src/${e}/index.template.html`)
    const template = fs.readFileSync(templatePath, 'utf-8')
    const bundle = require(`./dist/${e}-ssr-server-bundle.json`)
    // The client manifests are optional, but it allows the renderer
    // to automatically infer preload/prefetch links and directly add <script>
    // tags for any async chunks used during render, avoiding waterfall requests.
    const clientManifest = require(`./dist/${e}-ssr-client-manifest.json`)
    renderer[e]= createRenderer(bundle, {
      template,
      clientManifest
    })

  })

} else {
  // In development: setup the dev server with watch and hot-reload,
  // and create a new renderer on bundle / index template update.
  const setupDevServer = require('./build/setup-dev-server')
  
  Object.keys(entry).forEach((e, index) => {

    readyPromise[e] = setupDevServer(
      e,
      index,
      app,
      resolve(`./src/${e}/index.template.html`),
      (bundle, options) => {
        renderer[e] = createRenderer(bundle, options)
      }
    )

  })

}


const serve = (path, cache) => express.static(resolve(path), {
  maxAge: cache && isProd ? 1000 * 60 * 60 * 24 * 30 : 0
})

app.use(compression({ threshold: 0 }))
app.use(favicon('./public/logo-48.png'))
app.use('/dist', serve('./dist', true))
app.use('/public', serve('./public', true))
app.use('/manifest.json', serve('./manifest.json', true))
app.use('/service-worker.js', serve('./dist/service-worker.js'))

// since this app has no user-specific content, every page is micro-cacheable.
// if your app involves user-specific content, you need to implement custom
// logic to determine whether a request is cacheable based on its url and
// headers.
// 1-second microcache.
// https://www.nginx.com/blog/benefits-of-microcaching-nginx/
app.use(microcache.cacheSeconds(1, req => useMicroCache && req.originalUrl))

function render(req, res, module) {
  const s = Date.now()

  res.setHeader("Content-Type", "text/html")
  res.setHeader("Server", serverInfo)

  const handleError = err => {
    if (err.url) {
      res.redirect(err.url)
    } else if (err.code === 404) {
      res.status(404).send('404 | Page Not Found')
    } else {
      // Render Error Page or Redirect
      res.status(500).send('500 | Internal Server Error')
      console.error(`error during render : ${req.url}`)
      console.error(err.stack)
    }
  }
  console.log(req.url);
  const context = {
    title: 'TEST-TITLE', // default title
    url: req.url
  }

  renderer[module].renderToString(context, (err, html) => {
    if (err) {
      return handleError(err)
    }
    res.send(html)
    if (!isProd) {
      console.log(`whole request: ${Date.now() - s}ms`)
    }
  })
}


if (isProd) {
  app.get('*', (req, res) => {

    const entryArr = Object.keys(entry)

    let module

    entryArr.forEach(item => {
      if(req.url.includes(item)) {
        module = item
      }
    })

    return render(req, res, module)
   
  })
}

if (!isProd) {

  const entryArr = Object.keys(entry)

  app.get('*', (req, res) => {

    let module

    entryArr.forEach((item, i) => {
      if (req.url.includes(item)) {
        module = item
      }
    })

    console.log('module: ');
    console.log(module);

    readyPromise[module].then(r => {
      return render(req, res, module)
    })
    
  })

}


const port = process.env.PORT || 8080
app.listen(port, () => {
  console.log(`server started at localhost:${port}`)
})
