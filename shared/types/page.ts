export type Page = {
  id: string;
  title: string;
  content: string;
  slug: string;
  url: string;
  status: "draft" | "published";
  parent: string | undefined | null;
  createdAt: Date;
  updatedAt: Date;
};

export type AdminPage = {
  id: string;
  title: string;
  content: string;
  slug: string;
  url: string;
  status: "draft" | "published";
  parent?: AdminPage | null;
  children?: AdminPage[] | null;
  createdAt: Date;
  updatedAt: Date;
};
