import { ContextProvider } from "./components/utils/context.jsx";
import { Routes, Route } from "react-router-dom";
import NavBar from "./components/navbar/NavBar.jsx";
import Footer from "./components/footer/Footer.jsx";
import Dashboard from "./components/pages/dashboard/Dashboard.jsx";
import OrdersPage from "./components/pages/orders/OrdersPage.jsx";
import ActivityPage from "./components/pages/activity/ActivityPage.jsx";

export default function App() {
  return (
    <ContextProvider>
      <NavBar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/activity" element={<ActivityPage />} />
      </Routes>
      <Footer />
    </ContextProvider>
  );
}
