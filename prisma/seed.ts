import { PrismaClient, role } from '@prisma/client'

//* Users
import { userClients, userProviders } from '../src/data/seed/users'
import { clientsSeed } from '../src/data/seed/clients';
import { providers } from '../src/data/seed/providers';

//* Services
import { tareasDestacadas, encargadoMantenimiento, serviciosDeMudanza, Montajedemuebles, Montajeeinstalacion, Limpieza, ComprasEntrega, ServiciosdeServify, Serviciosdejardineria, Vacaciones, Asistentepersonal, Preparacionparabebes, Tareasvirtualesyenlinea, Serviciosoficina, Tareassincontacto } from '../src/data/seed/services';
import { categories } from '../src/data/seed/categories';

//* Experiences
import { experiences } from '../src/data/seed/experiences';
import { bcryptAdapter } from '../src/config';

const prisma = new PrismaClient()

async function main() {
  await prisma.$connect();

  // Primero elimina los registros de las tablas que hacen referencia a `service`
  await prisma.client.deleteMany();
  await prisma.experience.deleteMany();
  await prisma.service_provider.deleteMany();
  await prisma.service_image.deleteMany();

  // Luego elimina los registros de `service`
  await prisma.service.deleteMany();

  // Finalmente, elimina los registros de las tablas restantes
  await prisma.provider.deleteMany();
  await prisma.user.deleteMany();
  await prisma.category.deleteMany();

  let idProviders = [];
  
  //* Users
  userClients.forEach(async (user, i) => {
    await prisma.user.create({
      data: {
        name: user.name,
        last_name: user.last_name,
        email: user.email,
        password: bcryptAdapter.hash(user.password),
        image: user.image,
        email_validated: user.email_validated,
        clients: {
          create: {
            phone: clientsSeed[i].phone,
            address: clientsSeed[i].address,
            zip_code: clientsSeed[i].zip_code,
          }
        }
      }
    })
  })

  idProviders = userProviders.map(async (user, i) => {
    const newUser = await prisma.user.create({
      data: {
        name: user.name,
        last_name: user.last_name,
        email: user.email,
        password: bcryptAdapter.hash(user.password),
        image: user.image,
        email_validated: user.email_validated,
        role: user.role as role,
        providers: {
          create: {
            phone: providers[i].phone,
            description: providers[i].description,
            rating: providers[i].rating
          }
        },
      },
      include: {
        providers: true
      }
    })

    return newUser.providers[0].id;
  })

  let idProviders2: string[] = await Promise.all(idProviders);

  //* Services
  categories.forEach(async (category) => {
    switch (category.name){
      case 'Tareas destacadas':
        createService(category, tareasDestacadas, idProviders2)
        break;

      case 'Encargado de mantenimiento':
        createService(category, encargadoMantenimiento, idProviders2)
        break;

      case 'Servicios de mudanza':
        createService(category, serviciosDeMudanza, idProviders2)
        break;

      case 'Montaje de muebles':
        createService(category, Montajedemuebles, idProviders2)
        break;
      
      case 'Montaje e instalación':
        createService(category, Montajeeinstalacion, idProviders2)
        break;
      
      case 'Limpieza':
        createService(category, Limpieza, idProviders2)
        break;

      case 'Compras + Entrega a domicilio':
        createService(category, ComprasEntrega, idProviders2)
        break;

      case 'Servicios de Servify':
        createService(category, ServiciosdeServify, idProviders2)
        break;
      
      case 'Servicios de jardinería':
        createService(category, Serviciosdejardineria, idProviders2)
        break;

      case 'Vacaciones':
        createService(category, Vacaciones, idProviders2)
        break;

      case 'Asistente personal':
        createService(category, Asistentepersonal, idProviders2)
        break;
      
      case 'Preparación para bebés':
        createService(category, Preparacionparabebes, idProviders2)
        break;

      case 'Tareas virtuales y en línea':
        createService(category, Tareasvirtualesyenlinea, idProviders2)
        break;
      
      case 'Servicios de oficina':
        createService(category, Serviciosoficina, idProviders2)
        break;

      case 'Tareas sin contacto':
        createService(category, Tareassincontacto, idProviders2)
        break;

      default:
        break;
    }
  })

  //* Experiences
  idProviders2.forEach(async (id, i) => {
    const index = i * 4;

    for (let j = index; j < index + 4; j++) {
      const exp = await prisma.experience.create({
        data: {
          title: experiences[j].title,
          place: experiences[j].place,
          description: experiences[j].description,
          start_time: new Date(experiences[j].start_time),
          end_time: new Date(experiences[j].end_time),
          provider_id: id
        }
      })

      // console.log( exp );
    }
  })

  console.log('Seed completed 🌱🌱🌱')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })

async function createService (category: any, services: any, idProviders: any[] = []) {
  const newCategory = await prisma.category.create({
    data: {
      name: category.name,
      description: category.description,
    }
  })
  

  services.forEach(async (service: any) => {
    await prisma.service.create({
      data: {
        name: service.name,
        description: service.description,
        content: service.content,
        price_by_hour: service.price,
        category_id: newCategory.id,
        service_images: {
          create: {
            url: service.image
          }
        },
        service_providers: {
          create: {
            provider_id: idProviders[Math.floor(Math.random() * idProviders.length)]
          }
        }
      }
    })
  })
}

