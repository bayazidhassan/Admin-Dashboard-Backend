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

const getCategories = async (query: Record<string, unknown>) => {
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
        description: {
          contains: String(query.search),
          mode: 'insensitive',
        },
      },
    ];
  }

  if (query.active !== undefined) {
    where.active = query.active === 'true';
  }

  if (query.parentId) {
    where.parentId = String(query.parentId);
  }

  const [items, total] = await prisma.$transaction([
    prisma.category.findMany({
      where,
      skip,
      take: limit,
      orderBy: [
        {
          sortOrder: 'asc',
        },
        {
          createdAt: 'desc',
        },
      ],
      include: {
        parent: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        _count: {
          select: {
            children: true,
          },
        },
      },
    }),

    prisma.category.count({
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

const getCategoryById = async (id: string) => {
  const category = await prisma.category.findUnique({
    where: {
      id,
    },
    include: {
      parent: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
      children: {
        select: {
          id: true,
          name: true,
          slug: true,
          active: true,
          sortOrder: true,
        },
        orderBy: {
          sortOrder: 'asc',
        },
      },
    },
  });

  if (!category) {
    throw new AppError(404, 'Category not found');
  }

  return category;
};

const updateCategory = async (
  id: string,
  payload: {
    name?: string;
    slug?: string;
    description?: string;
    image?: string;
    parentId?: string;
    active?: boolean;
    sortOrder?: number;
  },
) => {
  const category = await prisma.category.findUnique({
    where: {
      id,
    },
  });

  if (!category) {
    throw new AppError(404, 'Category not found');
  }

  // Cannot be its own parent
  if (payload.parentId === id) {
    throw new AppError(400, 'Category cannot be its own parent');
  }

  // Cycle detection
  if (payload.parentId) {
    let currentParentId: string | null = payload.parentId;

    while (currentParentId) {
      if (currentParentId === id) {
        throw new AppError(400, 'Invalid parent category. Cycle detected.');
      }

      const parent: { parentId: string | null } | null =
        await prisma.category.findUnique({
          where: {
            id: currentParentId,
          },
          select: {
            parentId: true,
          },
        });

      currentParentId = parent?.parentId ?? null;
    }
  }

  return await prisma.category.update({
    where: {
      id,
    },
    data: payload,
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
};

export const CategoryService = {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
};
