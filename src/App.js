import { BrowserRouter } from 'react-router-dom';
import CanmaSite from './CanmaSite';

function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <CanmaSite />
    </BrowserRouter>
  );
}

export default App;
