import { ExtraValue, ExtraValueView } from './extra_value';

export interface Product {
  id: number;
  name: string;
  description: string;
  stock: number;
  status: 'active' | 'inactive';
  id_category_pulpo: number;
  id_pulpo_user: number;
  marketplaces: Array<Marketplace>;
}

export interface ProductView {
  id: number;
  name: string;
  stock: number;
  status: 'active' | 'inactive';
  marketplaces: string[];
  extra_values: Array<ExtraValueView>;
}

export interface Marketplace {
  id: number;
  name: string;
  extra_values: Array<ExtraValue>;
}
