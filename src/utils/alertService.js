import Swal from "sweetalert2";
import { alertMessages } from "./alertMessages";

export const showAlert = (icon="warning", title, text = "", position = "top-end", timer = 1500) => {
  Swal.fire({
    position,
    icon,
    title,
    text,
    showConfirmButton: false,
    timer,
  });
};
export const showSuccess = (action) => {
  showAlert("success", alertMessages.success[action] || "Operación exitosa");
};

export const showError = (action) => {
  showAlert("error", alertMessages.error[action] || "Error en la operación");
};

export const showWarning = async (action) => {
    return Swal.fire({
      title: alertMessages.warning[action] || "Advertencia",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, continuar",
      cancelButtonText: "Cancelar",
    });
  };

export const showInfo = (action) => {
  showAlert("info", alertMessages.info[action] || "Información");
};
