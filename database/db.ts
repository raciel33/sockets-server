import { connect } from 'mongoose';
import { MONGODB_URI } from './config';


export const dbConnection = async() => {

    try {
        await connect( MONGODB_URI) ;
        console.log("db online");

    } catch (error) {
        console.log(error);
        throw new Error('Error a la hora de iniciar la BD ver logs')
    }




}