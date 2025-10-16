import { ContextProvider } from "./components/utils/context.jsx";
import { Routes, Route } from "react-router-dom";
import NavBar from "./components/navbar/NavBar.jsx";
import Footer from "./components/footer/Footer.jsx";
import Dashboard from "./components/dashboard/Dashboard.jsx";
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
          width: "100%",
        }}
      >
        <HideScrollbarsGlobal />
        <NavBar />
        <Box
          component="main"
          sx={{
            flex: 1,
            mt: { xs: 10, sm: 12 },
            mb: { xs: 5, sm: 7 },
            px: { xs: 1, sm: 1, md: 5 }, //LAYOUT TODO
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignContent: "center",
            margin: "auto",
          }}
        >
          <Routes>
            <Route path="/" element={<Dashboard />} />
            {/* <Route path="/orders" element={<OrdersPage />} />
            <Route path="/activity" element={<ActivityPage />} /> */}
          </Routes>
        </Box>
        <Footer />
      </Box>
    </ContextProvider>
  );
}
