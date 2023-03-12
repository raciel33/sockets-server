import { Router } from 'express';
import { SERVER_PORT } from './classes/global/enviroments';
import Server from './classes/server';
import { router } from './routes/router';
import bodyParser from 'body-parser';
import cors from 'cors'

const server = new Server();

//BodyParser hay que ponerlo antes de server.app.use('/', router)

server.app.use(bodyParser.urlencoded({ extended:true}));
server.app.use(bodyParser.json());

server.app.use(cors({ origin: true, credentials: true }))

//Rutas
server.app.use('/', router)


server.start(()=>{
    console.log(`Servidor corriendo en el puerto ${SERVER_PORT}`);
})