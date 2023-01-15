import { useSelector } from "react-redux";

const useAccess = (currentPath) => {
  const { user } = useSelector((state) => state.auth);

  const canAccess = (permission) => {
    return user?.userRole?.roleAccess?.some((item) => {
      if (currentPath === "/perbaikan/form") {
        return item?.path === currentPath && item[permission];
      } else {
        return currentPath.includes(item?.path) && item[permission];
      }
    });
  };

  const showMenu = (path, children = null, permission) => {
    if (path === "#" && children) {
      const childPaths = children.map((child) => child?.path);
      return user?.userRole?.roleAccess?.some((item) => {
        return childPaths.includes(item?.path) && item[permission];
      });
    } else {
      return user?.userRole?.roleAccess?.some(
        (item) => item?.path === path && item[permission]
      );
    }
  };

  return { canAccess, showMenu };
};

export { useAccess };
