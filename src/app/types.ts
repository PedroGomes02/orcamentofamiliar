interface Category {
  id: string;
  name: string;
  type: string;
  avatar: String;
  subCategories: string[];
  userId: string;
}

interface Movement {
  id: string;
  value: number;
  date: string;
  type: string;
  category: string;
  subCategory: string;
  description: string;
  userId: string;
}

interface FilterAndSort {
  type: string;
  sortBy: string;
}

export type { Category, Movement, FilterAndSort };
