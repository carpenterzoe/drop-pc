type TBaseQuery<T = null> = { [key: string]: { __typename?: 'Query', data: T, page: IPage, code: number, message: string } };
