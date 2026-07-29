import AppError from '../../errors/AppError';
import prisma from '../../lib/prisma';

const getStockStatus = (stock: number) => {
  if (stock === 0) return 'out_of_stock';
  if (stock <= 5) return 'low_stock';
  return 'in_stock';
};

const createProduct = async (payload: {
  name: string;
  slug: string;
  sku: string;
  shortDescription?: string;
  longDescription?: string;
  hasVariants?: boolean;
  price: number;
  salePrice?: number;
  stock: number;
  weight?: number;
  active?: boolean;
  featured?: boolean;
  sortOrder?: number;
  brandId?: string;
  categoryIds: string[];
}) => {
  // Only simple products
  if (payload.hasVariants) {
    throw new AppError(
      400,
      'This endpoint only supports products without variants',
    );
  }

  const existingProduct = await prisma.product.findFirst({
    where: {
      OR: [{ slug: payload.slug }, { sku: payload.sku }],
    },
  });

  if (existingProduct) {
    throw new AppError(409, 'Product already exists');
  }

  if (payload.brandId) {
    const brand = await prisma.brand.findUnique({
      where: {
        id: payload.brandId,
      },
    });

    if (!brand) {
      throw new AppError(404, 'Brand not found');
    }
  }

  if (payload.categoryIds.length) {
    const categories = await prisma.category.findMany({
      where: {
        id: {
          in: payload.categoryIds,
        },
      },
      select: {
        id: true,
      },
    });

    if (categories.length !== payload.categoryIds.length) {
      throw new AppError(404, 'One or more categories not found');
    }
  }

  const product = await prisma.product.create({
    data: {
      name: payload.name,
      slug: payload.slug,
      sku: payload.sku,
      shortDescription: payload.shortDescription,
      longDescription: payload.longDescription,
      hasVariants: false,
      price: payload.price,
      salePrice: payload.salePrice,
      stock: payload.stock,
      stockStatus: getStockStatus(payload.stock),
      weight: payload.weight,
      active: payload.active,
      featured: payload.featured,
      sortOrder: payload.sortOrder,

      brand: payload.brandId
        ? {
            connect: {
              id: payload.brandId,
            },
          }
        : undefined,

      categories: {
        connect: payload.categoryIds.map((id) => ({
          id,
        })),
      },
    },
    include: {
      brand: true,
      categories: true,
    },
  });

  return product;
};

const getProducts = async (query: Record<string, unknown>) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;

  const where: any = {};

  if (query.search) {
    where.OR = [
      {
        name: {
          contains: String(query.search),
          mode: 'insensitive',
        },
      },
      {
        slug: {
          contains: String(query.search),
          mode: 'insensitive',
        },
      },
      {
        sku: {
          contains: String(query.search),
          mode: 'insensitive',
        },
      },
    ];
  }

  if (query.brandId) {
    where.brandId = String(query.brandId);
  }

  if (query.categoryId) {
    where.categories = {
      some: {
        id: String(query.categoryId),
      },
    };
  }

  if (query.active !== undefined) {
    where.active = query.active === 'true';
  }

  if (query.featured !== undefined) {
    where.featured = query.featured === 'true';
  }

  if (query.stockStatus) {
    where.stockStatus = String(query.stockStatus);
  }

  const [items, total] = await prisma.$transaction([
    prisma.product.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        brand: true,
        categories: true,
        _count: {
          select: {
            variants: true,
          },
        },
      },
    }),

    prisma.product.count({
      where,
    }),
  ]);

  return {
    items,
    total,
    page,
    limit,
  };
};

const getProductById = async (id: string) => {
  const product = await prisma.product.findUnique({
    where: {
      id,
    },
    include: {
      brand: true,

      categories: true,

      mediaAttachments: {
        include: {
          media: true,
        },
        orderBy: {
          sortOrder: 'asc',
        },
      },

      variants: {
        include: {
          attributeValues: {
            include: {
              attribute: true,
            },
          },

          mediaAttachments: {
            include: {
              media: true,
            },
            orderBy: {
              sortOrder: 'asc',
            },
          },
        },
      },
    },
  });

  if (!product) {
    throw new AppError(404, 'Product not found');
  }

  return product;
};

const updateProduct = async (
  id: string,
  payload: {
    name?: string;
    slug?: string;
    sku?: string;
    shortDescription?: string;
    longDescription?: string;
    price?: number;
    salePrice?: number;
    stock?: number;
    weight?: number;
    active?: boolean;
    featured?: boolean;
    sortOrder?: number;
    brandId?: string | null;
    categoryIds?: string[];
  },
) => {
  const product = await prisma.product.findUnique({
    where: { id },
  });

  if (!product) {
    throw new AppError(404, 'Product not found');
  }

  if (product.hasVariants) {
    throw new AppError(400, 'Use the variant endpoints for variable products');
  }

  if (payload.slug || payload.sku) {
    const exists = await prisma.product.findFirst({
      where: {
        id: {
          not: id,
        },
        OR: [
          ...(payload.slug ? [{ slug: payload.slug }] : []),
          ...(payload.sku ? [{ sku: payload.sku }] : []),
        ],
      },
    });

    if (exists) {
      throw new AppError(409, 'Slug or SKU already exists');
    }
  }

  if (payload.brandId) {
    const brand = await prisma.brand.findUnique({
      where: {
        id: payload.brandId,
      },
    });

    if (!brand) {
      throw new AppError(404, 'Brand not found');
    }
  }

  if (payload.categoryIds) {
    const categories = await prisma.category.findMany({
      where: {
        id: {
          in: payload.categoryIds,
        },
      },
      select: {
        id: true,
      },
    });

    if (categories.length !== payload.categoryIds.length) {
      throw new AppError(404, 'One or more categories not found');
    }
  }

  return await prisma.product.update({
    where: {
      id,
    },
    data: {
      name: payload.name,
      slug: payload.slug,
      sku: payload.sku,
      shortDescription: payload.shortDescription,
      longDescription: payload.longDescription,
      price: payload.price,
      salePrice: payload.salePrice,
      stock: payload.stock,
      stockStatus:
        payload.stock !== undefined ? getStockStatus(payload.stock) : undefined,
      weight: payload.weight,
      active: payload.active,
      featured: payload.featured,
      sortOrder: payload.sortOrder,

      brand:
        payload.brandId === undefined
          ? undefined
          : payload.brandId === null
            ? {
                disconnect: true,
              }
            : {
                connect: {
                  id: payload.brandId,
                },
              },

      categories: payload.categoryIds
        ? {
            set: payload.categoryIds.map((id) => ({
              id,
            })),
          }
        : undefined,
    },
    include: {
      brand: true,
      categories: true,
    },
  });
};

const deleteProduct = async (id: string) => {
  const product = await prisma.product.findUnique({
    where: {
      id,
    },
  });

  if (!product) {
    throw new AppError(404, 'Product not found');
  }

  await prisma.product.delete({
    where: {
      id,
    },
  });

  // ProductVariants and ProductMedia are deleted automatically
  // because of `onDelete: Cascade`.
  // Media records remain untouched.

  return null;
};

const createVariableProduct = async (payload: {
  name: string;
  slug: string;
  hasVariants: true;
  shortDescription?: string;
  longDescription?: string;
  weight?: number;
  active?: boolean;
  featured?: boolean;
  sortOrder?: number;
  brandId?: string;
  categoryIds: string[];
  variants: {
    sku: string;
    price: number;
    salePrice?: number;
    stock: number;
    lowStockThreshold?: number;
    weight?: number;
    active?: boolean;
    attributeValueIds: string[];
  }[];
}) => {
  return await prisma.$transaction(async (tx) => {
    // Check duplicate product slug
    const existingProduct = await tx.product.findUnique({
      where: {
        slug: payload.slug,
      },
    });

    if (existingProduct) {
      throw new AppError(409, 'Product slug already exists');
    }

    // Check duplicate SKUs inside request
    const skuSet = new Set<string>();

    for (const variant of payload.variants) {
      if (skuSet.has(variant.sku)) {
        throw new AppError(409, `Duplicate SKU: ${variant.sku}`);
      }

      skuSet.add(variant.sku);
    }

    // Check existing SKUs in database
    const existingSkus = await tx.productVariant.findMany({
      where: {
        sku: {
          in: payload.variants.map((v) => v.sku),
        },
      },
      select: {
        sku: true,
      },
    });

    if (existingSkus.length) {
      throw new AppError(409, `SKU already exists: ${existingSkus[0].sku}`);
    }

    // Validate brand
    if (payload.brandId) {
      const brand = await tx.brand.findUnique({
        where: {
          id: payload.brandId,
        },
      });

      if (!brand) {
        throw new AppError(404, 'Brand not found');
      }
    }

    // Validate categories
    if (payload.categoryIds.length) {
      const categories = await tx.category.findMany({
        where: {
          id: {
            in: payload.categoryIds,
          },
        },
      });

      if (categories.length !== payload.categoryIds.length) {
        throw new AppError(404, 'One or more categories not found');
      }
    }

    // Create product
    const product = await tx.product.create({
      data: {
        name: payload.name,
        slug: payload.slug,
        hasVariants: true,
        shortDescription: payload.shortDescription,
        longDescription: payload.longDescription,
        weight: payload.weight,
        active: payload.active,
        featured: payload.featured,
        sortOrder: payload.sortOrder,

        brand: payload.brandId
          ? {
              connect: {
                id: payload.brandId,
              },
            }
          : undefined,

        categories: {
          connect: payload.categoryIds.map((id) => ({
            id,
          })),
        },
      },
    });

    // Create variants
    for (const variant of payload.variants) {
      // Validate attribute values
      const attributeValues = await tx.attributeValue.findMany({
        where: {
          id: {
            in: variant.attributeValueIds,
          },
        },
      });

      if (attributeValues.length !== variant.attributeValueIds.length) {
        throw new AppError(404, 'One or more attribute values not found');
      }

      await tx.productVariant.create({
        data: {
          productId: product.id,
          sku: variant.sku,
          price: variant.price,
          salePrice: variant.salePrice,
          stock: variant.stock,
          stockStatus: getStockStatus(variant.stock),
          lowStockThreshold: variant.lowStockThreshold,
          weight: variant.weight,
          active: variant.active,

          attributeValues: {
            connect: variant.attributeValueIds.map((id) => ({
              id,
            })),
          },
        },
      });
    }

    return await tx.product.findUnique({
      where: {
        id: product.id,
      },
      include: {
        brand: true,
        categories: true,
        variants: {
          include: {
            attributeValues: {
              include: {
                attribute: true,
              },
            },
          },
        },
      },
    });
  });
};

const updateVariant = async (
  variantId: string,
  payload: {
    sku?: string;
    price?: number;
    salePrice?: number;
    stock?: number;
    lowStockThreshold?: number;
    weight?: number;
    active?: boolean;
    attributeValueIds?: string[];
  },
) => {
  const variant = await prisma.productVariant.findUnique({
    where: {
      id: variantId,
    },
  });

  if (!variant) {
    throw new AppError(404, 'Variant not found');
  }

  if (payload.sku) {
    const existingSku = await prisma.productVariant.findFirst({
      where: {
        sku: payload.sku,
        id: {
          not: variantId,
        },
      },
    });

    if (existingSku) {
      throw new AppError(409, 'SKU already exists');
    }
  }

  if (payload.attributeValueIds) {
    const values = await prisma.attributeValue.findMany({
      where: {
        id: {
          in: payload.attributeValueIds,
        },
      },
    });

    if (values.length !== payload.attributeValueIds.length) {
      throw new AppError(404, 'One or more attribute values not found');
    }
  }

  return await prisma.productVariant.update({
    where: {
      id: variantId,
    },
    data: {
      sku: payload.sku,
      price: payload.price,
      salePrice: payload.salePrice,
      stock: payload.stock,
      stockStatus:
        payload.stock !== undefined ? getStockStatus(payload.stock) : undefined,
      lowStockThreshold: payload.lowStockThreshold,
      weight: payload.weight,
      active: payload.active,

      attributeValues: payload.attributeValueIds
        ? {
            set: payload.attributeValueIds.map((id) => ({
              id,
            })),
          }
        : undefined,
    },
    include: {
      attributeValues: {
        include: {
          attribute: true,
        },
      },
    },
  });
};

const deleteVariant = async (variantId: string) => {
  const variant = await prisma.productVariant.findUnique({
    where: {
      id: variantId,
    },
  });

  if (!variant) {
    throw new AppError(404, 'Variant not found');
  }

  await prisma.productVariant.delete({
    where: {
      id: variantId,
    },
  });

  return null;
};

const generateVariants = async (payload: {
  attributes: {
    attributeId: string;
    attributeValueIds: string[];
  }[];
}) => {
  const groupedAttributes: {
    attributeId: string;
    attributeName: string;
    values: {
      id: string;
      value: string;
    }[];
  }[] = [];

  // Validate and prepare data
  for (const attribute of payload.attributes) {
    const dbAttribute = await prisma.attribute.findUnique({
      where: {
        id: attribute.attributeId,
      },
      select: {
        id: true,
        name: true,
      },
    });

    if (!dbAttribute) {
      throw new AppError(404, 'Attribute not found');
    }

    const values = await prisma.attributeValue.findMany({
      where: {
        id: {
          in: attribute.attributeValueIds,
        },
      },
      select: {
        id: true,
        value: true,
        attributeId: true,
      },
    });

    if (values.length !== attribute.attributeValueIds.length) {
      throw new AppError(404, 'One or more attribute values not found');
    }

    if (values.some((v) => v.attributeId !== attribute.attributeId)) {
      throw new AppError(
        400,
        'Attribute values do not belong to the specified attribute',
      );
    }

    groupedAttributes.push({
      attributeId: dbAttribute.id,
      attributeName: dbAttribute.name,
      values,
    });
  }

  // Generate combinations
  let combinations: {
    attributeValueIds: string[];
    attributes: {
      attributeId: string;
      attributeName: string;
      attributeValueId: string;
      value: string;
    }[];
  }[] = [
    {
      attributeValueIds: [],
      attributes: [],
    },
  ];

  for (const attribute of groupedAttributes) {
    const temp: typeof combinations = [];

    for (const combination of combinations) {
      for (const value of attribute.values) {
        temp.push({
          attributeValueIds: [...combination.attributeValueIds, value.id],
          attributes: [
            ...combination.attributes,
            {
              attributeId: attribute.attributeId,
              attributeName: attribute.attributeName,
              attributeValueId: value.id,
              value: value.value,
            },
          ],
        });
      }
    }

    combinations = temp;
  }

  return {
    total: combinations.length,
    combinations,
  };
};

export const ProductService = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  createVariableProduct,
  updateVariant,
  deleteVariant,
  generateVariants,
};
