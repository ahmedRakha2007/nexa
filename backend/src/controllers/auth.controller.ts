import signInService from "../services/auth/signIn.ts";
import  signUpService  from "../services/auth/signUp.ts";
import type { Request, Response } from 'express';

export async function signUp(req: Request, res: Response) {

         const response = await signUpService(req.body);

        return res.status(201).json(response);
}

export async function signIn(req: Request, res: Response) {

         const response = await signInService(req.body);

        return res.status(201).json(response);
}