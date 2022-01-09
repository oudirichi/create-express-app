const app = require('./src/index.js');

const PORT = process.env.PORT || 3000;
app.listen({ port: PORT }, () =>
  console.log(`🚀 Server ready at http://localhost:${PORT}, env: ${process.env.NODE_ENV}`)
);
