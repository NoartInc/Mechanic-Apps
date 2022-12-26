import { IconDashboard, IconArchive, IconFileAnalytics } from "@tabler/icons";

const menu = [
  {
    path: "/",
    title: "Dashboard",
    icon: IconDashboard,
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
        path: "/master/pengguna",
        title: "Pengguna",
      },
    ],
  },
  {
    path: "#",
    title: "Data Transaksi",
    icon: IconFileAnalytics,
    children: [
      {
        path: "/transaksi/transaksi1",
        title: "Transaksi 1",
      },
      {
        path: "/transaksi/transaksi2",
        title: "Transaksi 2",
      },
    ],
  },
];

export default menu;
