interface Category {
  id: string;
  name: string;
  type: string;
  avatar: string;
  subCategories: string[] | null;
  userId: string;
}

interface Movement {
  id: string;
  value: number;
  date: string;
  type: string;
  category: string;
  categoryAvatar: string | undefined;
  subCategory: string;
  description: string;
  userId: string;
  createAt: string;
}

interface FilterAndSort {
  type: string;
  sortBy: string;
}

export type { Category, Movement, FilterAndSort };
