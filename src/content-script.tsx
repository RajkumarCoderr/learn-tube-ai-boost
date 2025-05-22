
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

// Function to inject our React app into YouTube
function injectApp() {
  // Create a container for our app
  const appContainer = document.createElement('div');
  appContainer.id = 'youtube-learner-extension-root';
  document.body.appendChild(appContainer);
  
  // Render our React app into the container
  const root = createRoot(appContainer);
  root.render(<App />);
}

// Wait for YouTube to load completely before injecting
window.addEventListener('load', () => {
  // Small delay to ensure YouTube's DOM is fully rendered
  setTimeout(() => {
    injectApp();
  }, 1000);
});

// We also want to detect navigation between YouTube videos (SPA behavior)
// We'll use the YouTube detector service to handle that
