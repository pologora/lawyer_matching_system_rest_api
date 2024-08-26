export type CreateProps = {
  query: string;
  values: (string | number | Date)[];
};

export type GetOneProps = {
  query: string;
  id: number;
};

export type GetManyProps = {
  query: string;
  values: (string | number)[];
};

export type UpdateProps = {
  query: string;
  values: (string | number | Date)[];
  id: number;
};

export type DeleteProps = {
  query: string;
  id: number;
};
