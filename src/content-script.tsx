
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

console.log('YouTube Learner content script loaded');

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

// Add listener for YouTube video changes from background script
if (typeof chrome !== 'undefined' && chrome.runtime) {
  chrome.runtime.onMessage.addListener((message) => {
    if (message.type === 'NEW_VIDEO') {
      console.log('New YouTube video detected:', message.videoId);
    }
    return true;
  });
}
