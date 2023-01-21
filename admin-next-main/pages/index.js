import {
  IconClock,
  IconTool,
  IconFileCheck,
  IconReportOff,
  IconUserExclamation,
  IconArchive,
  IconArchiveOff,
} from "@tabler/icons";
import Layout from "../components/layouts/Layout";
import SummaryWidget from "../components/widgets/SummaryWidget";
import { get } from "../utils/api";
import moment from "moment";

export default function index({ data }) {
  return (
    <Layout title="Dashboard Overview">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-x-3">
        <SummaryWidget
          icon={IconClock}
          label="Menunggu"
          value={data?.awaiting}
        />
        <SummaryWidget
          icon={IconTool}
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
        <SummaryWidget
          icon={IconReportOff}
          label="Reject by LO"
          value={data?.rejected}
          type="danger"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-x-3">
        <div className="card-box mb-3">
          <h4 className="mb-4">Reject terbaru dari LO</h4>
          {data?.latestRejected?.map((item, index) => (
            <RejectedItem
              key={index}
              laporan={item?.perbaikanLo?.noLaporan}
              user={item?.loUser?.fullName}
              waktu={item?.createdAt}
            />
          ))}
        </div>
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
    <div
      key={index}
      className="flex justify-between mb-2 border-b border-b-gray-100 pb-1"
    >
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
      <div className="flex-shrink-0 w-16">
        <h6 className="text-sm text-gray-600 text-right">
          {moment(waktu).format("DD/MM/YY HH:mm")}
        </h6>
      </div>
    </div>
  );
};

const OutStockItem = ({ sparepart, stok }) => {
  return (
    <div
      key={index}
      className="flex justify-between mb-2 border-b border-b-gray-100 pb-1"
    >
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
    <div
      key={index}
      className="flex justify-between mb-2 border-b border-b-gray-100 pb-1"
    >
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
