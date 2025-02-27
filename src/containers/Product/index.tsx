import { ActionType, PageContainer, ProTable } from '@ant-design/pro-components';
import { DEFAULT_PAGE_SIZE } from '@/utils/constants';
import { PlusOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { useRef, useState } from 'react';
import { useProducts, useDeleteProduct, useEditProductInfo } from '@/services/product';
import { getColumns } from './constant';
import EditProduct from './components/EditProduct';
import ConsumeCard from './components/ConsumeCard';

/**
*   产品信息
*/
const Product = () => {
  const { data, refetch, loading } = useProducts();
  const [del, deleteLoading] = useDeleteProduct();
  const [showInfo, setShowInfo] = useState(false);
  const [showCard, setShowCard] = useState(false);
  const [edit, editLoading] = useEditProductInfo();

  const [curId, setCurId] = useState('');
  const actionRef = useRef<ActionType>();
  const onEditHandler = (id?: string) => {
    setCurId(id || '');
    setShowInfo(true);
  };
  const onCardHandler = (id?: string) => {
    setCurId(id || '');
    setShowCard(true);
  };

  const onDeleteHandler = (id: string) => {
    del(id, () => actionRef.current?.reload());
  };

  const closeAndRefetchHandler = (isReload?: boolean) => {
    setShowInfo(false);
    setShowCard(false);
    if (isReload) {
      // antd pro 组件的，手动触发刷新方法
      actionRef.current?.reload();
    }
  };

  const onStatusChangeHandler = (id: string, status: string) => {
    edit(id, {
      status,
    }, () => actionRef.current?.reload());
  };

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
        loading={loading || deleteLoading || editLoading}
        columns={getColumns({
          onEditHandler,
          onCardHandler,
          onDeleteHandler,
          onStatusChangeHandler,
        })}
        dataSource={data}
        pagination={{
          pageSize: DEFAULT_PAGE_SIZE,
        }}
        request={refetch}
        toolBarRender={() => [
          <Button onClick={() => onEditHandler()} key="add" type="primary" icon={<PlusOutlined />}>新建</Button>,
        ]}
        actionRef={actionRef}
      />

      {showInfo && (
        <EditProduct
          id={curId}
          onClose={closeAndRefetchHandler}
        />
      )}

      { showCard && <ConsumeCard id={curId} onClose={closeAndRefetchHandler} />}

    </PageContainer>
  );
};

export default Product;
