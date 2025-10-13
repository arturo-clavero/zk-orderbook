import Balance from "./balance/Balance.jsx";
import QuickPairs from "./trade/QuickPairs.jsx";
import Orders from "./Orders.jsx";
import { Box } from "@mui/material";

export default function Dashboard() {
  return (
    <>
      <Box
        sx={{
          // bgcolor: "orange",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <Balance />
        <QuickPairs />
        <Orders />
      </Box>
    </>
  );
}
