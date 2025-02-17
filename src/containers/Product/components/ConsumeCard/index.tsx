import { Modal, Row } from 'antd';
import { useProductInfo } from '@/services/product';
import { useState } from 'react';
import { CheckCard } from '@ant-design/pro-components';
import CourseSearch from '@/components/CourseSearch';
import style from './index.module.less';

const ConsumeCard = ({
  onClose,
  id,
}: IProps) => {
  const [selectedCards, setSelectedCards] = useState<string[]>([]); // 选中的消费卡id数组
  const { data: product, loading: getProductLoading } = useProductInfo(id || '');
  console.log('product: ', product);
  const onOkHandler = async () => {};

  const onSelectedHandler = (val) => {
    console.log('val: ', val);
  };

  return (
    <Modal
      title="绑定消费卡"
      width={800}
      open
      onCancel={() => onClose()}
      onOk={onOkHandler}
    >
      <Row justify="end">
        <CourseSearch onSelected={onSelectedHandler} />
      </Row>

      <Row justify="center" className={style.content}>
        <CheckCard.Group
          loading={getProductLoading}
          multiple
          onChange={(value) => {
            setSelectedCards(value as string[]);
          }}
          value={selectedCards}
        >
          <CheckCard />
        </CheckCard.Group>
      </Row>
    </Modal>
  );
};

// 可选属性，必须指定默认值
ConsumeCard.defaultProps = {
  id: '',
};

export default ConsumeCard;
