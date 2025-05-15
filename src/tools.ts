import { z } from 'zod'
import { tool } from '@langchain/core/tools'
import dataSource from '@/database/database'
import { Products } from '@/database/entity/products.entity'
import { In, Like, Or } from 'typeorm'

export const checkProducts = tool(
  async ({ name, accounts, categories, subCategories, brands }) => {
    try {
      console.dir([name, accounts, categories, subCategories, brands])
      const productRepository = dataSource.getRepository(Products)
      const productOne = await productRepository.find({
        where: {
          notes:
            name.split(' ').length > 1
              ? Or(...name.split(' ').map(word => Like(`%${word}%`)))
              : Like(`%${name}%`),
          account:
            Array.isArray(accounts) && accounts.length > 0
              ? { id: In(accounts) }
              : undefined,
          category:
            Array.isArray(categories) && categories.length > 0
              ? { category_id: In(categories) }
              : undefined,
          subCategory:
            Array.isArray(subCategories) && subCategories.length > 0
              ? { id: In(subCategories) }
              : undefined,
          brand:
            Array.isArray(brands) && brands.length > 0
              ? { brand_id: In(brands) }
              : undefined,
        },
        relations: ['account', 'brand', 'category', 'subCategory', 'vendor'],
        take: 15,
      })
      return { message: productOne }
    } catch (error) {
      console.dir(error)
      return { message: error }
    }
  },
  {
    name: 'check_products',
    description: `
      Consulta los productos en stock de las tiendas, puedes usar este comando para verificar si hay productos disponibles en las tiendas que el cliente ha mencionado.
      Este comando no es obligatorio, pero puede ser útil para ayudar al cliente a encontrar el producto que busca.
      Trata de encontrar la mayor cantidad de atributos posibles para ayudar al cliente a encontrar el producto que busca.
      hala los ids de los atributos, segun a los campos proporcionados en el prompt principal.
      La propiedad accounts es obligatoria, ya que es la tienda que el cliente quiere visitar.
      Intuye las categorias similares para el parametro categories, ejemplo: (llantas, cauchos, etc) e insertalo en un array,
      Intuye las subcategorias (modelos) similares para el parametro sub_categories, ejemplo: (llantas de carretera, llantas de montana, etc) e insertalo en un array,
    `,
    schema: z.object({
      name: z
        .string()
        .describe('Nombre o descripcion del producto')
        .nonempty('Este campo es obligatorio'),
      accounts: z
        .array(z.number().int())
        .describe(
          'Lista de IDs de las tiendas que deduces que el cliente quiere utilizar segun la conversacion, basate en los campos proporcionados en el prompt, puedes segun la ubicacion del cliente pasar tiendas (accounts) que se encuentren cerca de el, ejemplo: si el cliente vive en la ciudad de comayagua, entonces puedes pasar todas las tiendas que esten cerca de comayagua',
        ),
      categories: z
        .array(z.number().int())
        .optional()
        .nullable()
        .describe(
          'Lista de IDs de las categorias que deduces que el cliente quiere utilizar segun la conversacion, basate en los campos proporcionados en el prompt, trata de buscar categorias que sean sinonimos de la que se dedujo que busca el cliente, ejemplo: si el cliente pide llanta y existe la categoria caucho, entonces puedes pasar ambas, ya que son sinonimos',
        ),
      subCategories: z
        .array(z.number().int())
        .optional()
        .nullable()
        .describe(
          'Lista de IDs de las sub categorias (modelos) que deduces que el cliente quiere utilizar segun la conversacion, basate en los campos proporcionados en el prompt, este campo no es obligatorio, necesito que intuyas el modelo (subCategoria) segun lo que pida el cliente, busca palabras claves dentro de los nombres de las subcategorias, osea, si el cliente pide una llanta 90/90-18 o 90/90/18 intuye que el tamano de la llanta es 18 o busca todos los modelos (subCategory) que en su nombre tengan el numero 18, utiliza esta logica para todos los casos, si no logras dar o intuir con el modelo (subCategory) simplemente no pases esa propiedad al la tool',
        ),
      brands: z
        .array(z.number().int())
        .optional()
        .nullable()
        .describe(
          'Lista de IDs de las marcas que deduces que el cliente quiere utilizar segun la conversacion, basate en los campos proporcionados en el prompt, este campo no es obligatorio',
        ),
    }),
  },
)
