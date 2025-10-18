export const textFieldBase = {
  "& .MuiOutlinedInput-root": {
    color: "white",
    "& fieldset": {
      borderColor: "text.secondary",
      borderWidth: 0.5,
    },
    "&:hover fieldset": { borderColor: "text.secondary" },
    "&.Mui-focused fieldset": { borderColor: "text.secondary" },
    "&.Mui-error fieldset": { borderColor: "error.main", borderWidth: 1.5 },
    "&.Mui-focused.Mui-error fieldset": {
      borderColor: "error.main",
      borderWidth: 1.5,
    },
  },
  "& .MuiInputLabel-root": {
    color: "text.secondary",
    "&.Mui-focused": { color: "text.secondary" },
    "&.Mui-error": { color: "error.main" },
  },
};
