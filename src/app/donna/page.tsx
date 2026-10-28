import { DepartmentPage, departmentMetadata } from "@/components/department/DepartmentPage";

export const metadata = departmentMetadata("donna");

export default function Page() {
  return <DepartmentPage k="donna" />;
}
