import { useLocation } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import Header from './components/layout/Header';

// Pages where the global header should NOT appear
const NO_HEADER_PATHS = ['/', '/login', '/signup'];

function App() {
  const location = useLocation();
  const showHeader = !NO_HEADER_PATHS.includes(location.pathname);

  return (
    <>
      {showHeader && <Header />}
      <AppRoutes />
    </>
  );
}

export default App;
