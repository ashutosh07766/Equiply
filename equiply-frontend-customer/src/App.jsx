import { BrowserRouter, Routes, Route } from "react-router-dom";
import Homepage from './homepage';
import Product from './product';
import Cheakout from './Cheakout';
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

function App() { 

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Homepage/>}/>
        <Route path="/product" element={<Product/>}/>
        <Route path="/Cheakout" element={<Cheakout/>}/>
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
      </Routes>
    </BrowserRouter>
  )
}

export default App
