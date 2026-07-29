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

export const ProductService = {
  createProduct,
  getProducts,
  getProductById,
};
