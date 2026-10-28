import { DepartmentPage, departmentMetadata } from "@/components/department/DepartmentPage";

export const metadata = departmentMetadata("uomo");

export default function Page() {
  return <DepartmentPage k="uomo" />;
}
