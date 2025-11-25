import { API_ENDPOINTS } from "@/config/routes/endpoints";
import { CategoryModel } from "@/config/models/category";
import { IResponseWithData } from "@/config/types";
import { swrFetcher } from "@/utils/swr-fetcher";
import { FormikProps } from "formik";
import useSWR from "swr";
import FormikSelect from "./FormikSelect";

interface CategorySelectProps {
  name?: string;
  label?: string;
  formik: FormikProps<any>;
  placeholder?: string;
}

export default function CategorySelect({
  name = "categoryId",
  label = "Danh mục",
  formik,
  placeholder = "Chọn danh mục",
  ...props
}: CategorySelectProps) {
  const { data, isLoading } = useSWR<IResponseWithData<CategoryModel[]>>(
    API_ENDPOINTS.CATEGORY.INDEX,
    swrFetcher
  );

  const categories = data?.content || [];

  if (isLoading) return null;

  const options = categories.map((category) => ({
    value: category.categoryId,
    label: category.name,
  }));

  return (
    <FormikSelect
      name={name}
      label={label}
      formik={formik}
      placeholder={placeholder}
      options={options}
      {...props}
    />
  );
}
