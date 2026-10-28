import { DepartmentPage, departmentMetadata } from "@/components/department/DepartmentPage";

export const metadata = departmentMetadata("bambino");

export default function Page() {
  return <DepartmentPage k="bambino" />;
}
