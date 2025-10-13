import { ContextProvider } from "./components/utils/context.jsx";
import { Routes, Route } from "react-router-dom";
import NavBar from "./components/navbar/NavBar.jsx";
import Footer from "./components/footer/Footer.jsx";
import Dashboard from "./components/pages/dashboard/Dashboard.jsx";
import OrdersPage from "./components/pages/orders/OrdersPage.jsx";
import ActivityPage from "./components/pages/activity/ActivityPage.jsx";
import { Box } from "@mui/material";
import HideScrollbarsGlobal from "./components/utils/HideScrollBar.jsx";
export default function App() {
  return (
    <ContextProvider>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
        }}
      >
        <HideScrollbarsGlobal />
        <NavBar />
        <Box
          component="main"
          sx={{
            flex: 1,
            mt: { xs: 10, sm: 12 },
            mb: { xs: 6, sm: 8 },
            px: { xs: 2, sm: 3, md: 4 },
            width: "100%",
            maxWidth: 1000,
            mx: "auto",
          }}
        >
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/activity" element={<ActivityPage />} />
          </Routes>
        </Box>
        <Footer />
      </Box>
    </ContextProvider>
  );
}
