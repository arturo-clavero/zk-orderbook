import { Snackbar, Alert } from "@mui/material";

export default function ToastAlert({ toast, setToast }) {
  return (
    <Snackbar
      open={toast.open}
      autoHideDuration={2500}
      onClose={() => setToast({ ...toast, open: false })}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
    >
      <Alert
        severity={toast.type}
        variant="filled"
        sx={{
          width: "100%",
          fontWeight: 600,
          fontSize: "1rem",
          display: "flex",
          alignItems: "center",
          gap: 1,
        }}
      >
        {toast.msg}
      </Alert>
    </Snackbar>
  );
}
