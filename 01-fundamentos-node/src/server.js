import http from 'node:http'


const server = http.createServer((req, res) => {
    const {method, url} = req
    if (method === "GET" && url === "/users"){
        
        return res.end("Listagem de usuarios")
    }

    if(method === "POST" && url === "/users"){
        return res.end("Criacao de usuarios")
    }
    return res.end("hello")
})

server.listen(3333)