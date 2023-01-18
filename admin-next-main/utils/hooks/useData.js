import { useEffect, useState } from "react";
import { destroy, get } from "../api";
import { Toast } from "../swal";
import Swal from "sweetalert2";

export const useData = (url = "/", initFilter = {}) => {
  const [list, setList] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(15);
  const [total, setTotal] = useState(0);
  const [lastPage, setLastPage] = useState(0);
  const [orderBy, setOrderBy] = useState("id");
  const [orderDir, setOrderDir] = useState("desc");
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState(initFilter);
  const [loading, setLoading] = useState(true);

  const onPageChange = (pageNum) => {
    setPage(pageNum);
  };

  const onSortChange = (orderColumn) => {
    setOrderBy(orderColumn);
    setOrderDir((prevState) => (prevState === "desc" ? "asc" : "desc"));
  };

  const onSearchChange = (searchText) => {
    setPage(1);
    setSearch(searchText);
  };

  const onLimitChange = (limitNum) => {
    setLimit(limitNum);
  };

  const applyFilter = () => {
    setPage(1);
    getList();
  };

  const setFilter = (filter) => {
    setFilters((prevState) => ({
      ...prevState,
      ...filter,
    }));
  };

  const getList = () => {
    get(url, {
      page,
      limit,
      search: search,
      filters,
      orderby: orderBy,
      orderdir: orderDir,
    })
      .then((result) => {
        setList(result.rows);
        setLastPage(result.pageCount);
        setTotal(result.count);
      })
      .catch((error) => {
        Toast.fire({
          text: error?.error ?? error,
          icon: "error",
          timer: 5000,
        });
      })
      .finally(() => {
        setTimeout(() => {
          setLoading(false);
        }, 500);
      });
  };

  const deleteItem = (item) => {
    Swal.fire({
      title: "Konfirmasi!",
      text: "Anda yakin akan menghapus data ini?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yakin!",
      cancelButtonText: "Batal!",
    }).then((result) => {
      if (result.isConfirmed) {
        destroy(`${url}/${item?.id}`)
          .then((res) => {
            if (res?.message) {
              Toast.fire({
                icon: "info",
                text: res?.message,
              });
              getList();
            }
          })
          .catch((error) => {
            Toast.fire({
              icon: "error",
              text: error,
              timer: 5000,
            });
          });
      }
    });
  };

  useEffect(() => {
    getList();
    // eslint-disable-next-line
  }, [page, limit, search, orderBy, orderDir, page]);

  return {
    list,
    page,
    limit,
    total,
    orderBy,
    orderDir,
    search,
    lastPage,
    setFilter,
    setList,
    onLimitChange,
    onPageChange,
    onSearchChange,
    onSortChange,
    deleteItem,
    getList,
    loading,
    filters,
    applyFilter,
  };
};
