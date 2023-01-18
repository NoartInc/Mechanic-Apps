import React from 'react'
import { IconChevronLeft, IconChevronRight, IconChevronsRight, IconChevronsLeft, IconSortAscending, IconSortDescending, IconSettings, IconEdit, IconTrash, IconCircleDashed } from "@tabler/icons";
import SearchBox from './SearchBox';
import AddButton from './AddButton';
import { idrNumber } from '../../utils/helper';
import { useRouter } from 'next/router';
import { useAccess } from '../../utils/hooks/useAccess';
import { useSelector } from 'react-redux';

const DataTable = (props) => {
  const { title, list, columns, limit, page, lastPage, total, onSortChange, deleteItem, loading, filterData = null } = props;
  const { orderBy, orderDir, onLimitChange, onSearchChange, onPageChange, pageUrl, action = true, dataHeader = null, footer = true } = props;
  const limits = [5, 10, 15, 25, 50, 100];
  const router = useRouter();
  const { user } = useSelector(state => state.auth)
  const { canAccess } = useAccess(router.pathname);

  const paginate = (option) => {
    let currentPage = page;
    switch (option) {
      case "first":
        currentPage = 1;
        break;
      case "last":
        currentPage = lastPage;
        break;
      case "prev":
        if (page > 1) {
          currentPage -= 1;
        }
        break;
      case "next":
        if (page < lastPage) {
          currentPage += 1;
        }
        break;
    }
    onPageChange(currentPage);
  }

  const getFirstOffset = () => {
    return ((page - 1) * limit) + 1;
  }

  const getLimitOffset = () => {
    return ((page - 1) * limit) + limit;
  }

  return (
    <div className="card-page">
      {!loading ? (
        <>
          {/* Data Table Header */}
          {dataHeader ? (
            <div>{dataHeader}</div>
          ) : (
            <div className="flex flex-row justify-between items-center mb-3">
              <div className="flex-shrink-0">
                <h5 className="text-xl font-semibold">{title}</h5>
              </div>
              <div className="flex-grow"></div>
              <div className="flex-shrink-0">
                <div className="flex flex-row items-center gap-x-2">
                  <SearchBox onChange={onSearchChange} />
                  {filterData}
                  {action && canAccess("create") && (
                    <AddButton onClick={() => router.push(`${pageUrl}/form`)} />
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Data Body Table */}
          <div className="data-table-body data-table-content overflow-x-auto overflow-y-auto">
            <table className="table-auto w-full">
              {/* Table Head Data */}
              <thead>
                <tr className="sticky top-0" style={{ zIndex: 2 }}>
                  {columns?.map((col, colIndex) => (
                    <th
                      key={colIndex}
                      className={`th-table text-left ${col?.sortable !== false ? 'cursor-pointer' : ''} ${col?.className ?? ""}`.trim(' ')}
                      style={col?.style}
                      onClick={() => col?.sortable !== false ? onSortChange(col?.name) : null}
                    >
                      {col?.title}
                      {col?.sortable !== false && col?.name === orderBy ? (
                        <span className="absolute right-2 top-1/2 -translate-y-1/2">
                          {orderDir === "desc" ? (
                            <IconSortDescending />
                          ) : (
                            <IconSortAscending />
                          )}
                        </span>
                      ) : null}
                    </th>
                  ))}
                  {action && (canAccess("update") || canAccess("delete")) && (
                    <th className="th-table" style={{ width: "80px" }}>
                      <IconSettings className="block mx-auto" />
                    </th>
                  )}
                </tr>
              </thead>
              {/* Table Row Data */}
              <tbody>
                {list?.length ? list?.map((item, index) => ( // If Data exists
                  <tr key={index} className="tr-table">
                    {columns?.map((col, colIndex) => (
                      <td
                        key={colIndex}
                        className={`td-table ${col?.className ?? ""}`.trim(' ')}
                        style={col?.style}
                      >
                        {col?.render ? col.render({ item, value: item[col?.name] }) : item[col?.name]}
                      </td>
                    ))}
                    {action && (canAccess("update") || canAccess("delete")) && (
                      <td className="td-table td-table-action">
                        <div className="flex justify-center items-center gap-x-2">
                          {canAccess("delete") && (
                            <button
                              type="button"
                              className="button button-outline-danger"
                              onClick={() => deleteItem(item)}
                            >
                              <IconTrash size={18} />
                            </button>
                          )}
                          {canAccess("update") && user?.userRole?.roleName !== "LO" && (
                            <button
                              type="button"
                              className="button button-outline-primary"
                              onClick={() => router.push(`${pageUrl}/form/${item?.id}`)}
                            >
                              <IconEdit size={18} />
                            </button>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                )) : ( // If Data Not Found
                  <tr>
                    <td colSpan="100%" className="text-center py-3 border">
                      <h5 className="text-lg text-gray-600">No Data Found</h5>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {/* Data Footer Table */}
          {footer && (
            <div className="flex flex-row items-center justify-center gap-x-3">
              {list?.length ? (
                <>
                  <div className="flex-row gap-x-2 items-center hidden md:flex">
                    <span>Rows</span>
                    <select className="input" value={limit} onChange={(event) => onLimitChange(Number(event.target.value))}>
                      {limits.map((item, index) => (
                        <option key={index} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex-shrink hidden md:block">
                    {getFirstOffset()} - {getLimitOffset()} dari {idrNumber(total)}
                  </div>
                </>
              ) : null}
              <div className="flex-shrink flex flex-row gap-x-1 items-center justify-end">
                <button
                  type="button"
                  className="icon-button"
                  onClick={() => paginate("first")}
                  disabled={page === 1}
                >
                  <IconChevronsLeft />
                </button>
                <button
                  type="button"
                  className="icon-button"
                  onClick={() => paginate("prev")}
                  disabled={page === 1}
                >
                  <IconChevronLeft />
                </button>
                <button
                  type="button"
                  className="icon-button"
                  onClick={() => paginate("next")}
                  disabled={Number(page) === Number(lastPage) || !lastPage}
                >
                  <IconChevronRight />
                </button>
                <button
                  type="button"
                  className="icon-button"
                  onClick={() => paginate("last")}
                  disabled={Number(page) === Number(lastPage) || !lastPage}
                >
                  <IconChevronsRight />
                </button>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="flex justify-center items-center gap-x-2 my-2 rounded-md py-8 border border-gray-200">
          <IconCircleDashed className="animate-spin" />
          <h4 className="text-center">Loading...</h4>
        </div>
      )}

    </div>
  )
}

export default DataTable