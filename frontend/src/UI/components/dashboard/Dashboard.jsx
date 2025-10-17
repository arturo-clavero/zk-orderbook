import Balance from "./balance/Balance.jsx";
import Chart from "./chart/Chart.jsx";
import Trade from "./trade/TradeForm.jsx";
import Orders from "./orders/Orders.jsx";
import { Box, Stack } from "@mui/material";
import { useMyContext } from "../utils/context.jsx";
import ToastAlert from "../utils/ToastAlert.jsx";

export default function Dashboard() {
  const { toast, setToast } = useMyContext();
  return (
    <>
      <Box
        sx={{
          // bgcolor: "yellow",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          gap: 5,
          width: "100%",
          height: "100%",
        }}
      >
        <Stack
          // bgcolor="green"
          display="flex"
          direction="row"
          spacing={5}
          alignItems="end"
          height="100%"
          width="100%"
        >
          <Balance />
          <Chart width="100%" height={500} />
          <Trade />
        </Stack>
        <Orders />
        <ToastAlert toast={toast} setToast={setToast} />
      </Box>
    </>
  );
}
