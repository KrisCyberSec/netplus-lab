import { BrowserRouter, HashRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import SubnetDrill from './pages/SubnetDrill';
import PortsDrill from './pages/PortsDrill';
import OsiMap from './pages/OsiMap';
import Quiz from './pages/Quiz';
import Scenarios from './pages/Scenarios';
import ToolsDrill from './pages/ToolsDrill';
import Coverage from './pages/Coverage';
import MockExam from './pages/MockExam';
import Cheatsheets from './pages/Cheatsheets';
import ReviewMisses from './pages/ReviewMisses';
import Path from './pages/Path';
import MultiStep from './pages/MultiStep';
import Checklist from './pages/Checklist';

// HashRouter works on GitHub Pages without a custom 404 rewrite.
const Router = import.meta.env.PROD ? HashRouter : BrowserRouter;

export default function App() {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="path" element={<Path />} />
          <Route path="review" element={<ReviewMisses />} />
          <Route path="subnet" element={<SubnetDrill />} />
          <Route path="ports" element={<PortsDrill />} />
          <Route path="osi" element={<OsiMap />} />
          <Route path="quiz" element={<Quiz />} />
          <Route path="mock" element={<MockExam />} />
          <Route path="scenarios" element={<Scenarios />} />
          <Route path="pbq" element={<MultiStep />} />
          <Route path="tools" element={<ToolsDrill />} />
          <Route path="sheets" element={<Cheatsheets />} />
          <Route path="checklist" element={<Checklist />} />
          <Route path="coverage" element={<Coverage />} />
        </Route>
      </Routes>
    </Router>
  );
}
