import { API_ENDPOINTS } from "@/config/routes/endpoints";
import { BrandModel } from "@/config/models/brand";
import { IResponseWithData } from "@/config/types";
import { swrFetcher } from "@/utils/swr-fetcher";
import { FormikProps } from "formik";
import useSWR from "swr";
import FormikSelect from "./FormikSelect";

interface BrandSelectProps {
  name?: string;
  label?: string;
  formik: FormikProps<any>;
  placeholder?: string;
}

export default function BrandSelect({
  name = "brandId",
  label = "Thương hiệu",
  formik,
  placeholder = "Chọn thương hiệu",
  ...props
}: BrandSelectProps) {
  const { data, isLoading } = useSWR<IResponseWithData<BrandModel[]>>(
    API_ENDPOINTS.BRAND.INDEX,
    swrFetcher
  );

  const brands = data?.content || [];

  if (isLoading) return null;

  const options = brands.map((brand) => ({
    value: brand.brandId,
    label: brand.name,
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
