import Balance from "./balance/Balance.jsx";
import QuickPairs from "./trade/QuickPairs.jsx";
import Orders from "./orders/Orders.jsx";
import { Box } from "@mui/material";
import Chart from "./chart/Chart.jsx";

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
        <Chart />
        <Orders />
      </Box>
    </>
  );
}
