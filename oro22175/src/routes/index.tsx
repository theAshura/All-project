/* ROUTES COMPONENT
   ========================================================================== */

import loadable from "@loadable/component";
import AuthRoute from "containers/auth/AuthRoute";
import LayoutDefault from "containers/layouts/default";
import Loading from "containers/loadable-fallback/loading";
import { RouteObject } from "react-router-dom";
import ROUTES from "./constant";

/**
 * Lazy load page components. Fallback to <Loading /> when in loading phase
 */

const Login = loadable(() => import("pages/login"), {
  fallback: <Loading />,
});

const Banner = loadable(() => import("pages/banner"), {
  fallback: <Loading />,
});

const ProductsSection = loadable(() => import("pages/products-section"), {
  fallback: <Loading />,
});

const CropGuides = loadable(() => import("pages/crop-guides"), {
  fallback: <Loading />,
});

const Products = loadable(() => import("pages/products"), {
  fallback: <Loading />,
});

const ProductPortfolio = loadable(
  () => import("pages/products/product-portfolio-detail"),
  {
    fallback: <Loading />,
  }
);

const ProductSelector = loadable(
  () => import("pages/products/product-selector-detail"),
  {
    fallback: <Loading />,
  }
);

const ProductTechno = loadable(
  () => import("pages/products/product-technology-detail"),
  {
    fallback: <Loading />,
  }
);
const CropGuideSection = loadable(
  () => import("pages/crop-guide-section/index"),
  {
    fallback: <Loading />,
  }
);
const UserProfile = loadable(() => import("pages/user-profile/index"), {
  fallback: <Loading />,
});

const AreaManagesModification = loadable(
  () => import("pages/area-manages-modification"),
  {
    fallback: <Loading />,
  }
);

const ContactUs = loadable(() => import("pages/contact-us"), {
  fallback: <Loading />,
});

const UserManagement = loadable(() => import("pages/user-management"), {
  fallback: <Loading />,
});

const ApplicationModification = loadable(
  () => import("pages/application-modification"),
  {
    fallback: <Loading />,
  }
);

const NotFound = loadable(() => import("pages/not-found"), {
  fallback: <Loading />,
});
const Calculator = loadable(() => import("pages/calculator/index"), {
  fallback: <Loading />,
});
const CalculatorDetail = loadable(
  () => import("pages/calculator/CalculatorDetail"),
  {
    fallback: <Loading />,
  }
);

/**
 * Use <AuthRoute /> to protect authenticate pages
 */
export const routes: RouteObject[] = [
  {
    path: ROUTES.login,
    element: (
      <AuthRoute>
        <Login />
      </AuthRoute>
    ),
  },
  {
    path: ROUTES.home,
    element: (
      <AuthRoute>
        <LayoutDefault />
      </AuthRoute>
    ),
    children: [
      {
        path: ROUTES.applicationModification,
        element: <ApplicationModification />,
      },
      {
        path: ROUTES.productsSection,
        element: <ProductsSection />,
      },
      {
        path: ROUTES.cropGuides,
        element: <CropGuides />,
      },
      {
        path: ROUTES.applicationModification,
        element: <ApplicationModification />,
      },
      {
        path: ROUTES.areaManages,
        element: <AreaManagesModification />,
      },
      {
        path: ROUTES.contactUs,
        element: <ContactUs />,
      },
      {
        path: ROUTES.userManager,
        element: <UserManagement />,
      },
      { path: ROUTES.productModification, element: <Products /> },
      {
        path: ROUTES.productPortfolio,
        element: <ProductPortfolio />,
      },
      {
        path: ROUTES.productSelector,
        element: <ProductSelector />,
      },
      { path: ROUTES.productTechnology, element: <ProductTechno /> },
      { path: ROUTES.cropGuideDetail, element: <CropGuideSection /> },
      { path: ROUTES.userProfile, element: <UserProfile /> },
      { path: ROUTES.calculator, element: <Calculator /> },
      { path: `${ROUTES.calculator}/:id`, element: <CalculatorDetail /> },

      { path: ROUTES.notfound, element: <NotFound /> },
    ],
  },
];

export default routes;
