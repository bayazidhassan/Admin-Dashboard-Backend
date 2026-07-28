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

export const ProductService = {
  createProduct,
};
