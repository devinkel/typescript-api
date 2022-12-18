import mongoose, { Document, Model } from 'mongoose';

export enum BeachPosition {
    S = 'S',
    E = 'E',
    W = 'W',
    N = 'N'
}

export interface IBeach {
    _id?: string,
    name: string;
    position: BeachPosition;
    lat: number;
    lng: number;
}

//criando o formato do documento a ser salvo
const schema = new mongoose.Schema(
    {
        lat: { type: Number, required: true },
        lng: { type: Number, required: true },
        name: { type: String, required: true },
        position: { type: String, required: true },
    },
    {
        toJSON: {
            transform: function(doc, ret, options) {
                ret.id = ret._id;
                delete ret._id;
                delete ret.__v;
            }
        }
    }
);
// criando uma interface do model para ter acesso aos typos e também aos metódos do moongose. EX save()/find()
export interface IBeachModel extends Omit<IBeach, '_id'>, Document { }
export const Beach: Model<IBeachModel> = mongoose.model<IBeachModel>('Beach', schema);