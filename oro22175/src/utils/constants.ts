/* GLOBAL CONSTANTS
   ========================================================================== */

export const APP_NAME = "";

export const OPTION_STATUS = [
  {
    value: "all",
    label: "All status",
  },
  {
    value: "active",
    label: "Active",
  },
  {
    value: "inactive",
    label: "Inactive",
  },
];

export const OPTION_STATUS_NOT_HAVE_ALL = [
  {
    value: "active",
    label: "Active",
  },
  {
    value: "inactive",
    label: "Inactive",
  },
];

export const OPTION_ROLE = [
  {
    value: "ADMIN",
    label: "ADMIN",
  },
  {
    value: "EDITOR",
    label: "EDITOR",
  },
  {
    value: "VIEWER",
    label: "VIEWER",
  },
];

export const TYPE_ACTION = {
  ADD: "ADD",
  EDIT: "EDIT",
};

export const regexLink = new RegExp(
  /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/
);

export const listMenuComponents = (name: string) => {
  switch (name) {
    case "application":
    case "":
    case "product-portfolio":
    case "product-technology":
      return "products";

    case "crop-guide-detail":
      return "cropGuide";

    case "calculator":
      return "";
    default:
      return name;
  }
};

export const MODULE_FILE_UPLOAD = {
  PRODUCT: "product-modification",
  PRODUCT_PORTFOLIO: "product-portfolio",
  PRODUCT_TECHNOLOGY: "product-technology",
  CROP_GUIDES: "crop-guides",
  AREA_MANAGES_MODIFICATION: "area-manages-modification",
};
