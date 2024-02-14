import { genSaltSync, hashSync, compareSync } from 'bcryptjs';

export const bcryptAdapter = {
  // *Funcion que recibe un password y devuelve un hash
  hash: (password: string) => {
    const salt = genSaltSync(); // Genera un salt de 10 rondas
    return hashSync(password, salt); // Devuelve el hash del password
  },

  // *Funcion que recibe un password y un hash y devuelve true si coinciden
  // password: password que se quiere comparar y que se trae del body
  // hash: hash que se quiere comparar traido de la base de datos
  compare: (password: string, hash: string) => {
    return compareSync(password, hash); // Devuelve true si el password y el hash coinciden
  },
};
