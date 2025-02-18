import {
  Modal, Result, Row, Space, Typography,
} from 'antd';
import { useEditProductInfo, useProductInfo } from '@/services/product';
import { useEffect, useMemo, useState } from 'react';
import { CheckCard } from '@ant-design/pro-components';
import CourseSearch from '@/components/CourseSearch';
import { useLazyCards } from '@/services/card';
import { unionBy } from 'lodash';
import { CreditCardOutlined } from '@ant-design/icons';
import { getCardName } from '@/utils/constants';
import style from './index.module.less';

const ConsumeCard = ({
  onClose,
  id,
}: IProps) => {
  const [selectedCards, setSelectedCards] = useState<string[]>([]); // 选中的消费卡id数组
  const { data: product, loading: getProductLoading } = useProductInfo(id || '');
  const { data: cards, loading: getCardsLoading, getCards } = useLazyCards();
  const [edit, editLoading] = useEditProductInfo();

  // 商品已有关联消费卡时，查回来默认选中
  useEffect(() => {
    setSelectedCards(product?.cards?.map((item) => item.id) || []);
  }, [product?.cards]);

  const onOkHandler = async () => {
    edit(
      product?.id as string,
      { cards: selectedCards },
      () => onClose(),
    );
  };

  // 当前商品已经关联的cards，和搜索结果 去重合并
  const newCards = useMemo(
    () => unionBy(product?.cards || [], cards, 'id'),
    [product?.cards, cards],
  );

  const onSelectedHandler = (courseId: string) => {
    getCards(courseId);
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
        {newCards.length === 0
          && (
          <Result
            status="warning"
            title="请搜索课程并选择对应的消费卡"
          />
          )}
        <CheckCard.Group
          loading={getProductLoading || getCardsLoading || editLoading}
          multiple
          onChange={(value) => {
            setSelectedCards(value as string[]);
          }}
          value={selectedCards}
        >
          {
            newCards.map((item) => (
              <CheckCard
                className={style['ant-pro-checkcard-title']}
                key={item.id}
                value={item.id}
                size="small"
                avatar={<CreditCardOutlined />}
                title={(
                  <>
                    <Space>
                      <Typography.Text
                        ellipsis
                        className={style.name}
                      >
                        {/*
                          product card course 是三层关联关系
                          1. product & card ManyToMany
                          2. card & course ManyToOne

                          这里接口查询product时，只关联了cards，没有关联course，所以一开始查不到课程名称
                         */}
                        {item.course?.name}
                      </Typography.Text>
                    </Space>
                    <div>
                      {item.name}
                      {getCardName(item.type)}
                    </div>
                  </>
                )}
                description={(
                  <Space>
                    <span>
                      次数：
                      {item.time}
                    </span>
                    <span>
                      有效期：
                      {item.validityDay}
                    </span>
                  </Space>
                )}
              />
            ))
          }
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
