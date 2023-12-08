import fastify from "fastify";

const app = fastify()

app.get('/ping', () => {
  return 'pong'
})

app.listen({
  port: 3333
}).then(() => {
console.log('HTTP Server Running!');
})