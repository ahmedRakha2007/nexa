import signInService from "../services/auth/signIn.ts";
import  signUpService  from "../services/auth/signUp.ts";
import type { Request, Response } from 'express';

export async function signUp(req: Request, res: Response) {
    try {
         const response = await signUpService(req.body);

        return res.status(201).json(response);
    } catch (error) {
        if (error instanceof Error) {
        return res.status(400).json({ message: error.message });
        }
    }
}

export async function signIn(req: Request, res: Response) {
    try {
         const response = await signInService(req.body);

        return res.status(201).json(response);
    } catch (error) {
        if (error instanceof Error) {
        return res.status(400).json({ message: error.message });
        }
    }
}