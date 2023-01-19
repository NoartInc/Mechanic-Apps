import { useState } from "react";
import { baseUrl, get } from "../api";
import { Toast } from "../swal";

const useExport = (exportUrl) => {
  const [filters, setFilters] = useState({
    filters: {},
  });

  const onFilterChange = (filter) => {
    setFilters((prevState) => ({
      ...prevState,
      ...filter,
    }));
  };

  const downloadData = () => {
    get(`${exportUrl}`, {
      filters,
    })
      .then((result) => {
        if (result?.path) {
          window.open(
            `${baseUrl}/${result?.path?.replace("./public", "")}`,
            "_blank"
          );
        }
      })
      .catch((error) => {
        Toast.fire({
          icon: "error",
          text: error?.error ?? "Gagal mengunduh data",
        });
      });
  };
  return {
    filters,
    onFilterChange,
    downloadData,
  };
};

export default useExport;
