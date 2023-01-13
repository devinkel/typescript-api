import mongoose, { Document, Model, Schema } from 'mongoose';

export enum GeoPosition {
    S = 'S',
    E = 'E',
    W = 'W',
    N = 'N',
}

export interface Beach {
    _id?: string;
    name: string;
    position: GeoPosition;
    lat: number;
    lng: number;
    user: string;
}

//criando o formato do documento a ser salvo
const schema = new mongoose.Schema(
    {
        lat: { type: Number, required: true },
        lng: { type: Number, required: true },
        name: { type: String, required: true },
        position: { type: String, required: true },
        user: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // criando relacionamento com usuario
    },
    {
        toJSON: {
            transform: function (doc, ret, options) {
                ret.id = ret._id;
                delete ret._id;
                delete ret.__v;
            },
        },
    }
);
// criando uma interface do model para ter acesso aos typos e também aos metódos do moongose. EX save()/find()
export interface BeachModel extends Omit<Beach, '_id'>, Document {}
export const Beach: Model<BeachModel> = mongoose.model<BeachModel>(
    'Beach',
    schema
);
