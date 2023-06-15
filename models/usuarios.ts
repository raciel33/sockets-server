import { Schema, model, Document } from 'mongoose';


interface IUser extends Document {
        nombre :string,
        email:string,
        password:string,
        img?:string,
        lat?:string,
        lng?:string,
        uid?:string,
        notes?:string
        msgIn?: string,
        msgOut?:string,
}


    
    const Userschema: Schema = new Schema({
        nombre: {
            type: String,
            require: true
        },
        email: {
            type: String,
            require: true

        },
        password: {
            type: String,
            require: true

        },
        img:{
            type:String
        }, 
        lat:{
            type:String
        },
        lng:{
            type:String
        },
        uid:{
            type:String
        }, 
      
        notes:{
            type:Array,
            default:[]
        },
         msgIn:{
            type:String
        },
        msgOut:{
            type:String
        } 
    });
    
    export default model<IUser>('Usuario', Userschema);

