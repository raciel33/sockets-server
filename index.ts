import { Router } from 'express';
import { SERVER_PORT } from './global/enviroments';
import Server from './classes/server';
import { router } from './routes/router';
import bodyParser from 'body-parser';
import cors from 'cors'
//conexion BD
import { dbConnection } from './database/db';


const server = Server.instance;

//BodyParser hay que ponerlo antes de server.app.use('/', router)

server.app.use(bodyParser.urlencoded({ extended:true}));
server.app.use(bodyParser.json());

server.app.use(cors({ origin: true, credentials: true }))

//Rutas
server.app.use('/', router)


dbConnection();

server.start(()=>{
    console.log(`Servidor corriendo en el puerto ${SERVER_PORT}` );
})