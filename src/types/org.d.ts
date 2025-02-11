/**
 * 门店
 */
interface IOrganization {
  id: string;
  orgFrontImg?: IMedia[];
  orgRoomImg?: IMedia[];
  orgOtherImg?: IMedia[];
  name: string;
  logo: string;
  tags?: string;
  description?: string;
  address?: string;
  tel?: string;
  longitude?: string;
  latitude?: string;
  identityCardBackImg:string
  identityCardFrontImg:string
  businessLicense:string
}

// xx.d.ts 不能写 import / export，否则此文件被识别为了模块，其他地方未引入会标红
type TOrgsQuery = { [key: string]: { __typename?: 'Query', data: IOrganization[], page: IPage } };

type TBaseOrganization = Partial<IOrganization>;

type TOrgQuery = { [key: string]: { __typename?: 'Query', data: IOrganization } };
