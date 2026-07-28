import AppError from '../../errors/AppError';
import prisma from '../../lib/prisma';

const createAttribute = async (payload: {
  name: string;
  slug: string;
  type: 'dropdown' | 'radio' | 'checkbox' | 'color_swatch' | 'image_swatch';
}) => {
  const existingAttribute = await prisma.attribute.findFirst({
    where: {
      OR: [
        {
          name: payload.name,
        },
        {
          slug: payload.slug,
        },
      ],
    },
  });

  if (existingAttribute) {
    throw new AppError(409, 'Attribute already exists');
  }

  const attribute = await prisma.attribute.create({
    data: {
      name: payload.name,
      slug: payload.slug,
      type: payload.type,
    },
  });

  return attribute;
};

const getAttributes = async (query: Record<string, unknown>) => {
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
        type: {
          contains: String(query.search),
          mode: 'insensitive',
        },
      },
    ];
  }

  const [items, total] = await prisma.$transaction([
    prisma.attribute.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        _count: {
          select: {
            values: true,
          },
        },
      },
    }),

    prisma.attribute.count({
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

const getAttributeById = async (id: string) => {
  const attribute = await prisma.attribute.findUnique({
    where: {
      id,
    },
    include: {
      values: {
        orderBy: {
          createdAt: 'asc',
        },
      },
    },
  });

  if (!attribute) {
    throw new AppError(404, 'Attribute not found');
  }

  return attribute;
};

const updateAttribute = async (
  id: string,
  payload: {
    name?: string;
    slug?: string;
    type?: 'dropdown' | 'radio' | 'checkbox' | 'color_swatch' | 'image_swatch';
  },
) => {
  const attribute = await prisma.attribute.findUnique({
    where: {
      id,
    },
  });

  if (!attribute) {
    throw new AppError(404, 'Attribute not found');
  }

  if (payload.name || payload.slug) {
    const existingAttribute = await prisma.attribute.findFirst({
      where: {
        id: {
          not: id,
        },
        OR: [
          ...(payload.name ? [{ name: payload.name }] : []),
          ...(payload.slug ? [{ slug: payload.slug }] : []),
        ],
      },
    });

    if (existingAttribute) {
      throw new AppError(409, 'Attribute name or slug already exists');
    }
  }

  return await prisma.attribute.update({
    where: {
      id,
    },
    data: payload,
  });
};

const deleteAttribute = async (id: string) => {
  const attribute = await prisma.attribute.findUnique({
    where: {
      id,
    },
  });

  if (!attribute) {
    throw new AppError(404, 'Attribute not found');
  }

  // TODO (Module 9):
  // Refuse deletion if this attribute is used by any product variant.

  await prisma.attribute.delete({
    where: {
      id,
    },
  });

  return null;
};

export const AttributeService = {
  createAttribute,
  getAttributes,
  getAttributeById,
  updateAttribute,
  deleteAttribute,
};
