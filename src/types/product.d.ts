/**
 * 商品
 */
interface IProduct {
  id: string;
  limitBuyNumber: number;
  name: string;
  coverUrl?: string;
  bannerUrl?: string;
  desc: string;
  originalPrice: number;
  stock: number;
  status: string;
  type: string;
  preferentialPrice: number;
  cards: ICard[];
}

type TBaseProduct = Partial<IProduct>;

interface ICardInput {
  cards: string[];
}
type TBaseProductInput = Partial<IProduct | ICardInput>;

type TProductsQuery = { [key: string]: { __typename?: 'Query', data: IProduct[], page: IPage } };

type TProductQuery = { [key: string]: { __typename?: 'Query', data: IProduct } };

// 商品分类
interface IProductType {
  key: string;
  title: string;
}

type TProductTypeQuery = TBaseQuery<IProductType[]>;
