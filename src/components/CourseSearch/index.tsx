import { useCoursesForSimple } from '@/services/course';
import { Select } from 'antd';
import { debounce } from 'lodash';
import style from './index.module.less';

interface IProps {
  onSelected: (val: string) => void;
}

const CourseSearch = ({
  onSelected,
}: IProps) => {
  const { loading, data, search } = useCoursesForSimple();

  const onSearchHandler = debounce((name: string) => {
    search(name);
  }, 500);

  const onChangeHandler = (courseId: string) => {
    onSelected(courseId);
  };

  return (
    <Select
      className={style.select}
      showSearch
      placeholder="请搜索课程"
      onSearch={onSearchHandler}
      onChange={onChangeHandler}
      filterOption={false}
      loading={loading}
    >
      {
        data?.map((item) => (
          <Select.Option key={item.id} value={item.id}>
            {item.name}
          </Select.Option>
        ))
      }
    </Select>
  );
};

export default CourseSearch;
