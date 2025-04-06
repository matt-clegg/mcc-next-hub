export type AdminNavItem = {
  id: string;
  name: string;
  parent: string | null;
  order: number;
  children?: AdminNavItem[];
};
