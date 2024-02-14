import jwt from 'jsonwebtoken';
import { envs } from './envs.adapter';

// Variable de entorno que contiene la clave secreta para generar el token
const JWT_SEED = envs.JWT_SEED;

export class JwtAdapter {

  // *Genera un token con el payload y la duracion que le pasemos
  static async generateToken(payload: any, duration: string = '2h') {
    return new Promise((resolve, reject) => {
      // sign() es una funcion de jwt que recibe el payload, la clave secreta y la duracion del token
      jwt.sign(payload, JWT_SEED, { expiresIn: duration }, (error, token) => {
        // Si hay un error se retorna null
        if (error) return resolve(null);
        // Si no hay error se retorna el token
        resolve(token);
      })
    })
  }

  // Se tiene un generico para que el token pueda ser de cualquier tipo de dato
  static validateToken<T>(token: string): Promise<T | null> {
    // *Valida el token que le pasemos

    return new Promise((resolve, reject) => {
      jwt.verify(token, JWT_SEED, (error, decoded) => {
        // Si hay un error se retorna null
        if (error) return resolve(null);
        // Si no hay error se retorna el token
        resolve(decoded as T);
      })
    });
  }
}