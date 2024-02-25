import { NextFunction, Request, Response } from "express";
import { JwtAdapter } from "../../config";
import { prisma } from "../../data/postgres";
import { UserEntity } from "../../domain";

export class AuthMiddleware {
  static async validateJWT(req: Request, res: Response, next: NextFunction) {
    // Se obtiene el token de la cabecera de la petición (header) con el nombre 'Authorization'
    const authorization = req.header('Authorization');

    // Se comprueba si el token existe
    if (!authorization) return res.status(401).json({ error: 'No token provided'});

    // Se comprueba si el token es válido (tiene la estructura correcta) que empieza por 'Bearer'
    if( !authorization.startsWith('Bearer') ) {
      return res.status(401).json({ error: 'Invalid Bearer token'});
    }

    // Se obtiene el token sin la palabra 'Bearer' y si no existe se asigna un string vacío
    const token = authorization.split(' ').at(1) || '';

    try {
      // Se valida el token y se obtiene el payload
      const payload = await JwtAdapter.validateToken<{id: string}>(token);
      // console.log({payload});

      // Se comprueba si el payload es null
      if (!payload) return res.status(401).json({ error: 'Invalid token' });

      // Se comprueba si el id del usuario existe en la base de datos de postgres
      const user = await prisma.user.findUnique({ where: { id: payload.id } });

      // Se comprueba si el usuario existe
      if (!user) return res.status(401).json({ error: 'Invalid token - user does not exist' });

      // Validar si el usuario esta activo 
      if (!user.is_active) return res.status(401).json({ error: 'Invalid token - user is not active' });

      // **** Se agrega el usuario a la petición (req) para que pueda ser utilizado en los controladores que lo necesiten, primero se convierte el objeto a un UserEntity y luego se asigna a la propiedad user de la petición
      req.body.user = UserEntity.fromObject(user);

      // Se llama a la función next() para que la petición pueda continuar
      next();
      
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}