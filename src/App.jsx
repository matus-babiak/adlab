import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Index from './pages/Index';
import RoasKalkulacka from './pages/RoasKalkulacka';
import OptimalizatorRozpoctu from './pages/OptimalizatorRozpoctu';
import EcomKalkulacka from './pages/EcomKalkulacka';
import PacingScenare from './pages/PacingScenare';
import UnavaKreativ from './pages/UnavaKreativ';
import ScenareSkalovania from './pages/ScenareSkalovania';

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/roas" element={<RoasKalkulacka />} />
        <Route path="/optimalizator-rozpoctu" element={<OptimalizatorRozpoctu />} />
        <Route path="/ecom" element={<EcomKalkulacka />} />
        <Route path="/pacing-scenare" element={<PacingScenare />} />
        <Route path="/unava-kreativ" element={<UnavaKreativ />} />
        <Route path="/scenare-skalovania" element={<ScenareSkalovania />} />
      </Routes>
    </Layout>
  );
}
