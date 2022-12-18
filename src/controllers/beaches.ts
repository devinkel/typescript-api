import { Controller, Post } from '@overnightjs/core';
import { Beach } from '@src/models/beach';
import { Request, Response } from 'express';
import mongoose from 'mongoose';

@Controller('beaches')
export class BeachesController {
    @Post('')
    public async create(req: Request, res: Response): Promise<void> {
        // passando os dados enviados na requisição para criar uma praia.
        try {
            const beach = new Beach(req.body);
            // aguardando o resultado e salvando no banco de dados.
            const result = await beach.save();
            // enviando a resposta para o usuário.
            res.status(201).send(result);
        } catch (error:any) {
            if (error instanceof mongoose.Error.ValidationError){
                res.status(422).send({error: error.message});
            } else {
                res.status(500).send({error: 'Internal Server Error.'});    
            }
        }
    }
}
