import { z } from 'zod'
import { tool } from '@langchain/core/tools'
// import dataSource from '@/database/database'
// import { Products } from '@/database/entity/products.entity'
// import { Like } from 'typeorm'

export const checkProducts = tool(
  async ({ name, accounts, categories, subCategories, brands }) => {
    try {
      console.dir([name, accounts, categories, subCategories, brands])
      // const productRepository = dataSource.getRepository(Products)
      // const productOne = await productRepository.findOne({
      //   where: { account: { name: Like('%comayagua%') } },
      //   relations: ['account', 'brand', 'category', 'subCategory', 'vendor'],
      // })
      // return { message: productOne }
    } catch (error) {
      console.dir(error)
      // return { message: error }
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
          'Lista de IDs de las tiendas que deduces que el cliente quiere utilizar segun la conversacion, basate en los campos proporcionados en el prompt',
        ),
      categories: z
        .array(z.number().int())
        .optional()
        .nullable()
        .describe(
          'Lista de IDs de las categorias que deduces que el cliente quiere utilizar segun la conversacion, basate en los campos proporcionados en el prompt',
        ),
      subCategories: z
        .array(z.number().int())
        .optional()
        .nullable()
        .describe(
          'Lista de IDs de las sub categorias (modelos) que deduces que el cliente quiere utilizar segun la conversacion, basate en los campos proporcionados en el prompt',
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
