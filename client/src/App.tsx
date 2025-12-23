import { BrowserRouter, Routes, Route } from "react-router-dom"
import Closet from "./pages/Closet"
import Generate from "./pages/Generate"

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Closet />} />
        <Route path="/generate" element={<Generate />} />
      </Routes>
    </BrowserRouter>
  )
}