export const PERMISSION_GROUPS = [
  {
    name: 'Dashboard',
    description: 'Dashboard permissions',
    permissions: [
      {
        name: 'dashboard:watch',
        description: 'Access dashboard',
      },
    ],
  },

  {
    name: 'Permission',
    description: 'Permission management',
    permissions: [
      { name: 'permission:watch', description: 'Access permission module' },
      { name: 'permission:create', description: 'Create permission' },
      { name: 'permission:read', description: 'Read permission' },
      { name: 'permission:update', description: 'Update permission' },
      { name: 'permission:delete', description: 'Delete permission' },
    ],
  },

  {
    name: 'Role',
    description: 'Role management',
    permissions: [
      { name: 'role:watch', description: 'Access role module' },
      { name: 'role:create', description: 'Create role' },
      { name: 'role:read', description: 'Read role' },
      { name: 'role:update', description: 'Update role' },
      { name: 'role:delete', description: 'Delete role' },
    ],
  },

  {
    name: 'User',
    description: 'User management',
    permissions: [
      { name: 'user:watch', description: 'Access user module' },
      { name: 'user:create', description: 'Create user' },
      { name: 'user:read', description: 'Read user' },
      { name: 'user:update', description: 'Update user' },
      { name: 'user:delete', description: 'Delete user' },
    ],
  },

  {
    name: 'Media',
    description: 'Media management',
    permissions: [
      { name: 'media:watch', description: 'Access media module' },
      { name: 'media:read', description: 'Read media' },
      { name: 'media:upload', description: 'Upload media' },
      { name: 'media:write', description: 'Update media' },
      { name: 'media:delete', description: 'Delete media' },
    ],
  },

  {
    name: 'Category',
    description: 'Category management',
    permissions: [
      { name: 'category:watch', description: 'Access category module' },
      { name: 'category:create', description: 'Create category' },
      { name: 'category:read', description: 'Read category' },
      { name: 'category:update', description: 'Update category' },
      { name: 'category:delete', description: 'Delete category' },
    ],
  },

  {
    name: 'Brand',
    description: 'Brand management',
    permissions: [
      { name: 'brand:watch', description: 'Access brand module' },
      { name: 'brand:create', description: 'Create brand' },
      { name: 'brand:read', description: 'Read brand' },
      { name: 'brand:update', description: 'Update brand' },
      { name: 'brand:delete', description: 'Delete brand' },
    ],
  },

  {
    name: 'Attribute',
    description: 'Attribute management',
    permissions: [
      { name: 'attribute:watch', description: 'Access attribute module' },
      { name: 'attribute:create', description: 'Create attribute' },
      { name: 'attribute:read', description: 'Read attribute' },
      { name: 'attribute:update', description: 'Update attribute' },
      { name: 'attribute:delete', description: 'Delete attribute' },
    ],
  },

  {
    name: 'Product',
    description: 'Product management',
    permissions: [
      { name: 'product:watch', description: 'Access product module' },
      { name: 'product:create', description: 'Create product' },
      { name: 'product:read', description: 'Read product' },
      { name: 'product:update', description: 'Update product' },
      { name: 'product:delete', description: 'Delete product' },
    ],
  },
] as const;
