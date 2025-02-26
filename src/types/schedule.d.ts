interface ISchedule {
  id: string;
  schoolDay: string;
  startTime: string;
  endTime: string;
  limitNumber: number; // 限制上课人数
  course: ICourse;
  org: IOrganization;
  scheduleRecords: IScheduleRecord[];
}

type TSchedulesQuery = { [key: string]: { __typename?: 'Query', data: ISchedule[] } };

interface IScheduleRecord {
  id: string;
  status: string;
  student: IStudent;
}
