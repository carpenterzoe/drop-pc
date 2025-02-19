import { useProductTypes } from '@/services/product';
import { Select } from 'antd';

interface IProps {
  value?: string,
  onChange?: (value: string) => void,
}
/**
*  商品分类选择器
*/

// ? 如何理解 受控组件？

const TypeSelect = ({
  value, // ? 这个值怎么拿过来默认选中? - Form表单透传的
  onChange,
}: IProps) => {
  const { data } = useProductTypes();

  //  change调父组件的方法，修改value，又从父组件拿到最新的value，给<Select value={value}>赋值
  const onChangeHandler = (val: string) => {
    onChange?.(val);
  };
  return (
    <Select
      placeholder="请选择分类"
      onChange={onChangeHandler}
        // 类型要绑定父组件传过来的值，否则拿到的 value 类型不对
      value={value}
    >
      {data?.map((item) => (
        <Select.Option
          key={item.key}
          value={item.key}
        >
          {item.title}
        </Select.Option>
      ))}
    </Select>
  );
};

TypeSelect.defaultProps = {
  value: '',
  onChange: () => {},
};

export default TypeSelect;
