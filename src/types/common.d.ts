interface IUser {
  id: string;
  tel: string;
  name: string;
  desc?: string;
  avatar?: string;
  refetchHandler?: function;
}

interface IMedia {
  id: string;
  url: string;
  remark: string;
}
