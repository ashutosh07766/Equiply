import { BrowserRouter, Routes, Route } from "react-router-dom";
import Homepage from './homepage';
import Product from './product';

function App() { 

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Homepage/>}/>
        <Route path="/product" element={<Product/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
