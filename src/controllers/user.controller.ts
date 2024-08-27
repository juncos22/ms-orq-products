import { NextFunction, Request, Response } from 'express';
import getUser from '../database/gets/user.get';
import { postNewUser } from '../database/post/user.post';

export default class UserController {
  static userController = (
    req: Request,
    res: Response,
    _next: NextFunction,
  ) => {
    const { id } = req.params;
    const user = getUser(id);
    res
      .status(200)
      .json({ succes: true, response: user, error: null, stack: null });
  };
}

export class NewUser {
  static postUser = (req: Request, res: Response, _next: NextFunction) => {
    const { name } = req.body;
    const createUser = postNewUser(name);
    res
      .status(200)
      .json({ succes: true, response: createUser, error: null, stack: null });
  };
}
