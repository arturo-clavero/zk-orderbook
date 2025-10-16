import Balance from "./balance/Balance.jsx";
import Chart from "./chart/Chart.jsx";
import Trade from "./trade/TradeForm.jsx";
import Orders from "./orders/Orders.jsx";
import { Box, Stack } from "@mui/material";

export default function Dashboard() {
  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          width: "100%",
          height: "100%",
        }}
      >
        <Stack
          display="flex"
          direction="row"
          spacing={4}
          alignItems="end"
          height="100%"
        >
          <Balance />
          <Chart width="100%" height={500} />
          <Trade />
        </Stack>
        <Orders />
      </Box>
    </>
  );
}
