import { Controller, Post } from "@overnightjs/core";
import { User } from "@src/models/user";
import { Request, Response } from 'express';
import mongoose from "mongoose";

@Controller('users')
export class UsersController {
    @Post('')
    public async create(req: Request, res: Response): Promise<void>{
        try {
            const user = new User(req.body);
            const newUser = await user.save()
            res.status(201).send(newUser);
        } catch (error:any) {
            res.status(500).send({error: 'Internal Server Error.'});    
        }
    }
}