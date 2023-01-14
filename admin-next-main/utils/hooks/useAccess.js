import { useSelector } from "react-redux";

const useAccess = (currentPath) => {
  const {
    user: {
      userRole: { roleAccess },
    },
  } = useSelector((state) => state.auth);

  const canAccess = (permission) => {
    return roleAccess?.some((item) => {
      if (currentPath === "/perbaikan/form") {
        return item?.path === currentPath && item[permission];
      } else {
        return currentPath.includes(item?.path) && item[permission];
      }
    });
  };

  return { canAccess };
};

export { useAccess };
