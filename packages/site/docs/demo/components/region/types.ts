export interface Option {
  id?: string | number | null;
  name: React.ReactNode;
  children?: Option[];
  isLeaf?: boolean;
  type?: 'provinces' | 'cities' | 'districts';
}
