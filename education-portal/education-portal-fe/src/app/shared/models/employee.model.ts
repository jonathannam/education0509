import { EMPLOYEE_STATUS } from "../consts";

export interface Employee {
  id: number;
  name: string;
  position: string;
  department: string;
  address: string;
  email: string;
  contactNumber: string;
  status: EMPLOYEE_STATUS;
  createdAt: string;
  updatedAt: string;
}
