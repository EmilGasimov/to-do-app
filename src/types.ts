export interface Todo {
  _id: string;
  text: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

export type FilterType = "all" | "active" | "completed";

export type SortType = "alphabetical" | "status";
