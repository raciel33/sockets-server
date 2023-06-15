import { Schema, model, Document } from 'mongoose';

interface INote extends Document {
    de: string;
    cuerpo?: string;
}

const schema: Schema = new Schema({
    de: {
        type: String,
        required: true
    },
    cuerpo: {
        type: String,
    },
    usuario:{
           type:String
    }
   
}, {
    timestamps: true
});

export default model<INote>('Note', schema);