import { BrowserRouter, Routes, Route } from 'react-router-dom';
import DepositForm from './Dummy';
import OrderForm from './Order';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DepositForm />} />
        <Route path="/order" element={<OrderForm />} />
      </Routes>
    </BrowserRouter>
  );
}
