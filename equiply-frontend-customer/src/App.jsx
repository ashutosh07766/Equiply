import { BrowserRouter, Routes, Route } from "react-router-dom";
import Homepage from './homepage';
import Product from './product';
import Checkout from './Checkout';
import ProductVeiw from './Productveiw';
import Signup from './Signup';
import History from "./History";
import Payment from "./Payment";
import Profile from "./Profile";
import PutRent from "./PutRent";
import Wishlist from "./Wishlist";
import OrderVeiw from "./OrderVeiw";
import Login from "./login";
import Header from "./header";
import Footer from "./Footer";
import OrderConfirmation from "./OrderConfirmation";
import AdminPage from "./Admin";
import BannedUserMessage from "./BannedUserMessage";

function App() { 

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Homepage/>}/>
        <Route path="/product" element={<Product/>}/>
        <Route path="/Checkout" element={<Checkout/>}/>
        <Route path="/ProductVeiw" element={<ProductVeiw/>}/>
        <Route path="/Signup" element={<Signup/>}/>
        <Route path="/History" element={<History/>}/>
        <Route path="/Payment" element={<Payment/>}/>
        <Route path="/Profile" element={<Profile/>}/>
        <Route path="/PutRent" element={<PutRent/>}/>
        <Route path="/Wishlist" element={<Wishlist/>}/>
        <Route path="/OrderVeiw" element={<OrderVeiw/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/header" element={<Header/>}/>
        <Route path="/footer" element={<Footer/>}/>
        <Route path="/productveiw/:id" element={<ProductVeiw />} />
        <Route path="/order-confirmation" element={<OrderConfirmation />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/banned" element={<BannedUserMessage />} /> {/* Add banned user route */}
      </Routes>
    </BrowserRouter>
  )
}

export default App
