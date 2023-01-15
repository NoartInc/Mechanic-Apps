import {
  IconDashboard,
  IconFileAnalytics,
  IconAxe,
  IconUsers,
  IconBrandAirtable,
} from "@tabler/icons";

const fullPermissions = ["view", "create", "update", "delete", "export"];

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
        permissions: fullPermissions,
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
        permissions: fullPermissions,
      },
      {
        path: "/master/mesin",
        title: "Mesin",
        permissions: fullPermissions,
      },
      {
        path: "/master/sparepart",
        title: "Sparepart",
        permissions: fullPermissions,
      },
      {
        path: "/master/kerusakan",
        title: "Kerusakan",
        permissions: fullPermissions,
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
        permissions: fullPermissions,
      },
      {
        path: "/transaksi/gudangMekanik",
        title: "Gudang Mekanik",
        permissions: fullPermissions,
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
        permissions: fullPermissions,
      },
      {
        path: "/user/role",
        title: "Role",
        permissions: fullPermissions,
      },
    ],
  },
];

export default menu;
