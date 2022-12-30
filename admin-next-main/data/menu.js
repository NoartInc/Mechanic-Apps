import { IconDashboard, IconArchive, IconFileAnalytics, IconAxe } from "@tabler/icons";

const menu = [
  {
    path: "/",
    title: "Overview",
    icon: IconDashboard,
  },
  {
    path: "#",
    title: "Perbaikan",
    icon: IconAxe,
    children: [
      {
        path: "/perbaikan/tambahPerbaikan",
        title: "Tambah Perbaikan",
      },
      {
        path: "/perbaikan/listPerbaikan",
        title: "List Perbaikan",
      },
    ],
  },
  {
    path: "#",
    title: "Data Master",
    icon: IconArchive,
    children: [
      {
        path: "/master/mekanik",
        title: "Mekanik",
      },
      {
        path: "/master/mesin",
        title: "Mesin",
      },
      {
        path: "/master/sparepart",
        title: "Sparepart",
      },
      {
        path: "/master/pengguna",
        title: "Pengguna",
      },
      {
        path: "/master/kerusakan",
        title: "Kerusakan",
      },
    ],
  },
  {
    path: "#",
    title: "Data Transaksi",
    icon: IconFileAnalytics,
    children: [
      {
        path: "/transaksi/transaksiSparepart",
        title: "Transaksi Sparepart",
      },
      {
        path: "/transaksi/gudangMekanik",
        title: "Gudang Mekanik",
      },
    ],
  },
];

export default menu;
