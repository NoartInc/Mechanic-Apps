import {
  IconClock,
  IconTool,
  IconFileCheck,
  IconReportOff,
  IconUserExclamation,
  IconArchive,
  IconArchiveOff,
  IconChevronRight,
  IconChevronLeft,
  IconClockEdit,
} from "@tabler/icons";
import React from "react";
import Layout from "../components/layouts/Layout";
import SummaryWidget from "../components/widgets/SummaryWidget";
import { get } from "../utils/api";
import moment from "moment";
import { useData } from "../utils/hooks/useData";
import DataFilter from "../components/widgets/DataFilter";
import DateRangeFilter from "../components/widgets/DateRangeFilter";
import { useSelector } from "react-redux";
import DataLoader from "../components/widgets/DataLoader";

export default function Dashboard({ data }) {
  const { user } = useSelector((state) => state.auth);
  const loCounter = useData("/lo", {
    dateRange: {
      startDate: moment().subtract(1, "months").format("YYYY-MM-DD"),
      endDate: moment().format("YYYY-MM-DD"),
    },
  });

  const permittedAccess = () => {
    const allowedAccess = ["LO", "MANAGER", "ADMINISTRATOR"];
    return allowedAccess.includes(user?.userRole?.roleName);
  };

  const loCounterPaginate = (type) => {
    let currentPage = loCounter.page;
    if (type === "prev") {
      if (loCounter.page > 1) {
        currentPage -= 1;
      }
    } else if (type === "next") {
      if (loCounter.page < loCounter.lastPage) {
        currentPage += 1;
      }
    }
    loCounter.onPageChange(currentPage);
  };

  const summaryWidgetClass = `grid grid-cols-2 ${
    permittedAccess() ? "md:grid-cols-5" : "md:grid-cols-4"
  } gap-x-3`;
  const overviewSummaryClass = `grid grid-cols-1 ${
    permittedAccess() ? "md:grid-cols-3" : "md:grid-cols-2"
  } gap-x-3`;

  return (
    <Layout title="Dashboard Overview">
      <div className={summaryWidgetClass}>
        <SummaryWidget
          icon={IconTool}
          label="Proses"
          value={data?.proses}
        />
        <SummaryWidget
          icon={IconClock}
          label="Menunggu"
          value={data?.awaiting}
        />
        <SummaryWidget
          icon={IconClockEdit}
          label="Revisi"
          value={data?.revision}
          type="warning"
        />
        <SummaryWidget
          icon={IconFileCheck}
          label="Selesai"
          value={data?.accepted}
          type="primary"
        />
        {permittedAccess() && (
          <SummaryWidget
            icon={IconReportOff}
            label="Reject by LO"
            value={loCounter?.total}
            type="danger"
          />
        )}
      </div>
      <div className={overviewSummaryClass}>
        {permittedAccess() && (
          <div className="card-box mb-3">
            <div className="flex justify-between items-center mb-4">
              <h4 className="flex-grow">Reject terbaru dari LO</h4>
              <div className="flex-shrink-0">
                <DataFilter onApply={() => loCounter.applyFilter()} smallButton>
                  <DateRangeFilter
                    onChange={(filter) => loCounter.setFilter(filter)}
                    value={loCounter.filters?.dateRange}
                  />
                </DataFilter>
              </div>
            </div>
            <div className="overflow-y-auto max-h-64 lo-counter-list">
              {loCounter?.loading ? (
                <DataLoader />
              ) : (
                loCounter?.list?.map((item, index) => (
                  <RejectedItem
                    key={index}
                    laporan={item?.perbaikanLo?.noLaporan}
                    user={item?.loUser?.fullName}
                    waktu={item?.createdAt}
                  />
                ))
              )}
            </div>
            {loCounter.lastPage > 1 && (
              <div className="flex justify-center gap-x-3 items-center">
                <button
                  type="button"
                  className="button button-outline-primary button-xsmall"
                  disabled={loCounter.page === 1}
                  onClick={() => loCounterPaginate("prev")}
                >
                  <IconChevronLeft />
                </button>
                <button
                  type="button"
                  className="button button-outline-primary button-xsmall"
                  disabled={loCounter.page === loCounter.lastPage}
                  onClick={() => loCounterPaginate("next")}
                >
                  <IconChevronRight />
                </button>
              </div>
            )}
          </div>
        )}
        <div className="card-box mb-3">
          <h4 className="mb-4">Sparepart yang akan habis</h4>
          {data?.almostOutOfStock?.map((item, index) => (
            <OutStockItem {...item} key={index} />
          ))}
        </div>
        <div className="card-box mb-3">
          <h4 className="mb-4">Sparepart paling banyak digunakan</h4>
          {data?.mostUsedSparepart?.map((item, index) => (
            <MostSparepart
              sparepart={item?.gudangMekanikSparepart?.sparepart}
              count={item?.usedCount}
              key={index}
            />
          ))}
        </div>
      </div>
    </Layout>
  );
}

const RejectedItem = ({ laporan, user, waktu }) => {
  return (
    <div className="flex justify-between mb-2 border-b border-b-gray-100 pb-1">
      <div className="flex-grow">
        <div className="flex gap-x-2">
          <div className="p-1 rounded-lg bg-gray-50 self-start mt-px">
            <IconUserExclamation size={18} />
          </div>
          <div>
            <h4 className="text-gray-700 text-sm">{laporan}</h4>
            <h5 className="text-gray-800 font-semibold text-sm">User {user}</h5>
          </div>
        </div>
      </div>
      <div className="flex-shrink-0 w-16 pr-1">
        <h6 className="text-sm text-gray-600 text-right">
          {moment(waktu).format("DD/MM/YY HH:mm")}
        </h6>
      </div>
    </div>
  );
};

const OutStockItem = ({ sparepart, stok }) => {
  return (
    <div className="flex justify-between mb-2 border-b border-b-gray-100 pb-1">
      <div className="flex-grow">
        <div className="flex gap-x-2">
          <div className="p-1 rounded-lg bg-gray-50 self-start mt-px">
            <IconArchiveOff size={18} />
          </div>
          <div>
            <h4 className="text-gray-700 text-sm">{sparepart}</h4>
          </div>
        </div>
      </div>
      <div className="flex-shrink-0 w-16">
        <h6 className="text-sm text-gray-600 text-right">
          <CountBadge count={stok} className="bg-orange-500 text-white" />
        </h6>
      </div>
    </div>
  );
};

const MostSparepart = ({ sparepart, count }) => {
  return (
    <div className="flex justify-between mb-2 border-b border-b-gray-100 pb-1">
      <div className="flex-grow">
        <div className="flex gap-x-2">
          <div className="p-1 rounded-lg bg-gray-50 self-start mt-px">
            <IconArchive size={18} />
          </div>
          <div>
            <h4 className="text-gray-700 text-sm">{sparepart}</h4>
          </div>
        </div>
      </div>
      <div className="flex-shrink-0 w-16">
        <h6 className="text-sm text-gray-600 text-right">
          <CountBadge count={count} className="bg-green-600 text-white" />
        </h6>
      </div>
    </div>
  );
};

const CountBadge = ({ count, className }) => (
  <span className={`p-1 px-2 rounded-lg ${className}`} style={{ fontSize: 12 }}>
    {count}
  </span>
);

export async function getStaticProps() {
  const data = await get(`/dashboard/summary`);
  return {
    props: {
      data,
    },
  };
}
