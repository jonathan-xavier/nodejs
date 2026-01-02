import http from 'node:http'
import { json } from './middlewares/json.js'
import { routes } from './routes.js'
import { extractQueryParams } from './utils/extract-query-params.js'

// UUID = unique universal ID
//query parameters: URL Statefull => filtros, paginacao, nao-brigatorias
//route parameters: Identificação de recurso ex: .../user/1
//request body: envio de informaçôes de um formulário (HTTPS)

// http://localhost:3333/users?userId=1

const server = http.createServer(async (req, res) => {
    const { method, url } = req
    
    await json(req, res)

    const route = routes.find(route =>  {
        return route.method === method && route.path.test(url)
    })
    
    if(route){
        const routeParams = req.url.match(route.path)
        req.params = {...routeParams.groups}
        // console.log(extractQueryParams(routeParams.groups.query));
        const { query, ...params } = routeParams.groups
        req.params = params
        req.query = query ? extractQueryParams(query) : {}
        
        return route.handler(req, res)
    }

    return res.writeHead(404).end()
})

server.listen(3333)