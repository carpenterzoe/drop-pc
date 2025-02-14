import { ActionType, PageContainer, ProTable } from '@ant-design/pro-components';
import { DEFAULT_PAGE_SIZE } from '@/utils/constants';
import { PlusOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { useRef, useState } from 'react';
import { useProducts } from '@/services/product';
import { getColumns } from './constant';

/**
*   产品信息
*/
const Product = () => {
  const { data, refetch, loading } = useProducts();
  const [showInfo, setShowInfo] = useState(false);
  const [curId, setCurId] = useState('');
  console.log(showInfo, curId);
  const actionRef = useRef<ActionType>();
  const onEditHandler = (id: string) => {
    setCurId(id);
    setShowInfo(true);
  };
  const onCardHandler = () => {};

  const onDeleteHandler = () => {};

  return (
    <PageContainer
      header={{
        title: '当前门店下的商品',
      }}
    >
      <ProTable<IProduct>
        rowKey="id"
        form={{
          ignoreRules: false,
        }}
        loading={loading}
        columns={getColumns({
          onEditHandler,
          onCardHandler,
          onDeleteHandler,
        })}
        dataSource={data}
        pagination={{
          pageSize: DEFAULT_PAGE_SIZE,
        }}
        request={refetch}
        toolBarRender={() => [
          // onClick={() => onEditHandler()}
          <Button key="add" type="primary" icon={<PlusOutlined />}>新建</Button>,
        ]}
        actionRef={actionRef}
      />
    </PageContainer>
  );
};

export default Product;
