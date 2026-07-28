import AppError from '../../errors/AppError';
import prisma from '../../lib/prisma';

const createCategory = async (payload: {
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parentId?: string;
  active?: boolean;
  sortOrder?: number;
}) => {
  // Check parent category if provided
  if (payload.parentId) {
    const parentCategory = await prisma.category.findUnique({
      where: {
        id: payload.parentId,
      },
    });

    if (!parentCategory) {
      throw new AppError(404, 'Parent category not found');
    }
  }

  const category = await prisma.category.create({
    data: {
      name: payload.name,
      slug: payload.slug,
      description: payload.description,
      image: payload.image,
      parentId: payload.parentId,
      active: payload.active,
      sortOrder: payload.sortOrder,
    },
    include: {
      parent: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
    },
  });

  return category;
};

export const CategoryService = {
  createCategory,
};
