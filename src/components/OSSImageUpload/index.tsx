import type { UploadProps } from 'antd';
import type { UploadFile } from 'antd/es/upload/interface';
import ImgCrop from 'antd-img-crop';
import { Upload } from 'antd';
import { GET_OSS_INFO } from '@/graphql/oss';
import { useQuery } from '@apollo/client';

interface OSSDataType {
  dir: string;
  expire: string;
  host: string;
  accessId: string;
  policy: string;
  signature: string;
}

// value & onChange 是为了让外层的 FormItem 监听到
interface OSSUploadProps {
  value?: UploadFile;
  onChange?: (file?: UploadFile) => void;
}

const OSSImageUpload = ({ value, onChange }: OSSUploadProps) => {
  const { data, refetch } = useQuery<{ getOSSInfo: OSSDataType }>(GET_OSS_INFO);
  const OSSData = data?.getOSSInfo;

  // 指定上传到哪个服务器地址的哪个桶里
  const getKey = (file: UploadFile) => {
    const suffix = file.name.slice(file.name.lastIndexOf('.'));
    const key = `${OSSData?.dir}${file.uid}${suffix}`;
    const url = `${OSSData?.host}/${key}`;
    return { key, url };
  };

  const handleChange: UploadProps['onChange'] = ({ file }) => {
    if (file.status === 'removed') {
      onChange?.();
      return;
    }
    const newFile = {
      ...file,
      url: file.url || getKey(file).url,
    };
    onChange?.(newFile);
  };

  // 上传所需额外参数 或返回上传额外参数的方法
  // 这里是指定oss上传需要的额外参数
  const getExtraData: UploadProps['data'] = (file) => ({
    key: getKey(file).key,
    OSSAccessKeyId: OSSData?.accessId,
    policy: OSSData?.policy,
    Signature: OSSData?.signature,
  });

  const beforeUpload: UploadProps['beforeUpload'] = async (file) => {
    if (!OSSData) return false;

    const expire = Number(OSSData.expire) * 1000;
    if (expire < Date.now()) {
      await refetch();
    }
    return file;
  };

  return (
    <ImgCrop rotate>
      <Upload
        name="file"
        listType="picture-card"
        fileList={value ? [value] : []}
        action={OSSData?.host}
        onChange={handleChange}
        data={getExtraData}
        beforeUpload={beforeUpload}
      >
        上传
      </Upload>
    </ImgCrop>
  );
};

OSSImageUpload.defaultProps = {
  value: null,
  onChange: () => {},
};

export default OSSImageUpload;
