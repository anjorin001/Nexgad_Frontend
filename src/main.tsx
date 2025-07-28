// TODO clear this nigga
localStorage.setItem(
  "auth",
  JSON.stringify({
    firstName: "Anjiorin",
    lastName: "Favour",
    email: "user@example.com",
    profilePicture: "https://example.com/profile.jpg",
  })
);

import { createRoot } from 'react-dom/client'
import { BrowserRouter } from "react-router-dom";
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
)
