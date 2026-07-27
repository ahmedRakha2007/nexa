import signInService from "../services/auth/signIn.js";
import signUpService from "../services/auth/signUp.js";
export async function signUp(req, res) {
    const response = await signUpService(req.body);
    return res.status(201).json(response);
}
export async function signIn(req, res) {
    const response = await signInService(req.body);
    return res.status(201).json(response);
}
//# sourceMappingURL=auth.controller.js.map