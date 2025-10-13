import Balance from "./balance/Balance.jsx";
import QuickPairs from "./trade/QuickPairs.jsx";
import Orders from "./Orders.jsx";
import { Box } from "@mui/material";

export default function Dashboard() {
  return (
    <>
      <Box sx={{ mt: 5 }}>
        <Balance />
        <QuickPairs />
        <Orders />
      </Box>
    </>
  );
}
