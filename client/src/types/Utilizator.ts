export enum RolUtilizator {
  CLIENT = 'client',
  ADMIN = 'admin',
}

export interface Utilizator {
  email: string,
  avatar: string,
  rol: RolUtilizator
}