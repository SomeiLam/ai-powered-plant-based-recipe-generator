import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { IngredientSelection } from './pages/IngredientSelection';
import { RecipeResult } from './pages/RecipeResult';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<IngredientSelection />} />
        <Route path="/recipe" element={<RecipeResult />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;