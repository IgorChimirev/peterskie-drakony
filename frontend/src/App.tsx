import { Route, Routes } from "react-router-dom";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { Home } from "./pages/Home";
import { About } from "./pages/About";
import { Trainers } from "./pages/Trainers";
import { Branches } from "./pages/Branches";
import { Schedule } from "./pages/Schedule";
import { Pricing } from "./pages/Pricing";
import { News } from "./pages/News";
import { Contacts } from "./pages/Contacts";
import { Trial } from "./pages/Trial";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { Lk } from "./pages/Lk";
import { Trainer } from "./pages/Trainer";
import { Events } from "./pages/Events";
import { Gallery } from "./pages/Gallery";
import { Rating } from "./pages/Rating";
import { Reviews } from "./pages/Reviews";
import { Admin } from "./pages/admin/Admin";
import { ProtectedRoute } from "./auth/ProtectedRoute";

function App() {
  return (
    <>
      <Header />
      <main style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/trainers" element={<Trainers />} />
          <Route path="/branches" element={<Branches />} />
          <Route path="/schedule" element={<Schedule />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/news" element={<News />} />
          <Route path="/events" element={<Events />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/rating" element={<Rating />} />
          <Route path="/reviews" element={<Reviews />} />
          <Route path="/contacts" element={<Contacts />} />
          <Route path="/trial" element={<Trial />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/lk"
            element={
              <ProtectedRoute requireRole="PARENT">
                <Lk />
              </ProtectedRoute>
            }
          />
          <Route
            path="/trainer"
            element={
              <ProtectedRoute requireRole="TRAINER">
                <Trainer />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute requireRole="ADMIN">
                <Admin />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
      <Footer />
    </>
  );
}

export default App;
