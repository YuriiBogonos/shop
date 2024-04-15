import { useContext, useEffect } from "react";
import {
  createBrowserRouter,
  createHashRouter,
  RouterProvider,
} from "react-router-dom";
import { AuthContext } from "../providers/authContext";
import { LoginPage } from "../components/LoginPage/LoginPage";
import { Home } from "../components/Home/Home";
import ProductsProvider from "../providers/productsContext";

const router = createHashRouter([
  {
    path: "/",
    element: <LoginPage />,
  },
  {
    path: "/home",
    element: <Home />,
  },
  {
    path: "*",
    element: <LoginPage />,
  },
]);

const Navigator = () => {
  const { currentUser, loading } = useContext(AuthContext);

  const routArray = window.location.href.split("/");

  useEffect(() => {
    if (
      !currentUser &&
      routArray[routArray.length - 1].length !== 0 &&
      !loading
    ) {
      window.history.pushState({}, "/", "/");
      window.location.reload();
    }
  }, [currentUser, loading]);

  return (
    <ProductsProvider>
      <RouterProvider router={router} />
    </ProductsProvider>
  );
};

export default Navigator;
