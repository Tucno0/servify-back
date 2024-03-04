import { UuidAdapter } from "../../config";
import { prisma } from '../../data/postgres/index';
import { ClientEntity, CustomError } from '../../domain';

export class ClientsService {
  
  public getAllClients = async () => {
    const clients = await prisma.client.findMany({
      include: { user: true }
    });

    return clients.map( client => {
      const { user: { password, ...userEntity}, ...clientEntity} = ClientEntity.fromObject(client);
      return { ...clientEntity, user: userEntity};
    });
  }

  public getClientById = async (id: string) => {
    if (!UuidAdapter.validate(id)) throw CustomError.badRequest('Invalid id');

    const client = await prisma.client.findUnique({
      where: { id },
      include: {
        user: true
      },
    });

    if (!client) throw CustomError.notFound('Client not found');

    const { user: { password, ...userEntity}, ...clientEntity} = ClientEntity.fromObject(client);
    return { ...clientEntity, user: userEntity};
  }

  public getClientByUserId = async (userId: string) => {
    if (!UuidAdapter.validate(userId)) throw CustomError.badRequest('Invalid id');

    const client = await prisma.client.findMany({
      where: { user_id: userId },
      include: {
        user: true
      },
    });

    if (!client[0]) throw CustomError.notFound('Client not found');

    const { user: { password, ...userEntity}, ...clientEntity} = ClientEntity.fromObject(client[0]);
    return { ...clientEntity, user: userEntity};
  }

  public createClient = async (client: any) => {
    return {
      msg: 'Client created'
    };
  }

  public updateClient = async (id: string, client: any) => {
    return {
      msg: 'Client updated'
    };
  }

  public deleteClient = async (id: string) => {
    return {
      msg: 'Client deleted'
    };
  }
}