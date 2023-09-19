const express = require("express");
const routes = require("./routes"); // Importa o módulo de rotas definido em './routes'
const cors = require("cors");

const app = express();

require("./config/dbConfig"); // Importa a configuração do banco de dados (certifique-se de que este arquivo existe)

app.use(cors()); // Habilita o CORS para permitir solicitações de diferentes origens
app.use(express.json()); // Habilita o uso de JSON no corpo das solicitações
app.use(routes); // Usa as rotas definidas no módulo de rotas importado

app.listen(333); // Inicia o servidor Express na porta 333
