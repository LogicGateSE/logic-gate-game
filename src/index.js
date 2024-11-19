import { createRoot } from 'react-dom/client';
import App from './intro'

const container = document.getElementById('app');
const root = createRoot(container);
root.render(<App tab="home" root={root} />);