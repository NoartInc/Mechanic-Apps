import Swal from "sweetalert2";

const Toast = Swal.mixin({
  toast: true,
  position: "bottom-right",
  showConfirmButton: false,
  timerProgressBar: true,
  timer: 2000,
});

export { Toast };
