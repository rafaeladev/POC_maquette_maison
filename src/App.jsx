import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";

import Home from "./pages/Home.jsx";
import Layout from "./components/Layout.jsx";

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
  /*    console.log(detectBasename()); */
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
      </Route>
    ),
    {
      // Ajoutez le chemin de base ici
      /* basename: "/sorbonne/reactQuiz/", */
      basename: detectBasename(),
    }
  );
  return <RouterProvider router={router} />;
}

export default App;
