import data from "../../content/departments.json";

export type Category = {
  id: string;
  label: string;
  text: string[];
  images: string[];
  message: string;
  sizes?: { from: string; to: string };
  /** Text-only categories: what you find in the shop, set as a list. */
  items?: string[];
};

export type Department = {
  slug: string;
  title: string;
  seo: { title: string; description: string };
  intro: string;
  sizes: { from: string; to: string; text: string; unit?: string };
  heroImage: string;
  brands?: string;
  categories: Category[];
  videos?: { src: string; poster: string; title: string; ratio: string }[];
  youtube?: { href: string; label: string };
};

export const DEPARTMENTS = data as unknown as Record<"donna" | "uomo", Department>;
export type DepartmentKey = keyof typeof DEPARTMENTS;
