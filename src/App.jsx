import {
  Route,
  RouterProvider,
  createHashRouter,
  createRoutesFromElements,
} from "react-router-dom";

import Home from "./pages/Home.jsx";
import Intro from "./pages/Intro.jsx";
import Layout from "./components/Layout.jsx";

import { CanvasProvider } from "./utils/Context/CanvasContext.jsx";

// Cette fonction est un exemple et doit être adaptée à votre cas spécifique
function detectBasename() {
  // Retire `index.html` ou tout autre fichier spécifique de l'URL, si présent.
  let path = window.location.pathname.replace(/\/index\.html$/, "");

  // S'assure qu'il y a un slash final pour le basename
  if (!path.endsWith("/")) {
    path += "/";
  }

  // `path` devrait maintenant contenir le chemin complet nécessaire pour basename,
  // par exemple, `/sandbox/content/courses/NIK78OVNM2/dista65cdd90-456a-45e9-9d5d-cb360f7c0358/0/`
  return path;
}

function App() {
  const basename = detectBasename();
  console.log(`Basename detected: ${basename}`);

  const router = createHashRouter(
    createRoutesFromElements(
      <Route path="/" element={<Layout />}>
        <Route index element={<Intro />} />
        <Route path="/:id" element={<Home />} />
      </Route>
    ),
    {
      // Ajoutez le chemin de base ici
      /* basename: "/sorbonne/reactQuiz/", */
      basename: basename,
    }
  );
  return <RouterProvider router={router} />;
}

export default App;
