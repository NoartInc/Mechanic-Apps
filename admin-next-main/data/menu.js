import {
  IconDashboard,
  IconFileAnalytics,
  IconAxe,
  IconUsers,
  IconBrandAirtable,
} from "@tabler/icons";

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
        path: "/perbaikan/form",
        title: "Tambah Perbaikan",
      },
      {
        path: "/perbaikan",
        title: "List Perbaikan",
      },
    ],
  },
  {
    path: "#",
    title: "Data Master",
    icon: IconBrandAirtable,
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
    icon: IconUsers,
    children: [
      {
        path: "/user/pengguna",
        title: "Pengguna",
      },
      {
        path: "/user/role",
        title: "Role",
      },
    ],
  },
];

export default menu;
