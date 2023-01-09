import { IconDashboard, IconArchive, IconFileAnalytics, IconAxe, IconUser } from "@tabler/icons";

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
  {
    path: "#",
    title: "User",
    icon: IconUser,
    children: [
      {
        path: "/user/pengguna",
        title: "Pengguna",
      },
      {
        path: "/user/role",
        title: "Role",
      },
    ]
  }
];

export default menu;
