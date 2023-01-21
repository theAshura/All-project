import { message } from "antd";

export const emailRegex = new RegExp(
  /^(\s*)[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}(\s*)$/i
);

export const passwordRegex = new RegExp(
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[ !"#$%&'()*+,-./\\:;<=>?@[\]^_`{|}~])[A-Za-z\d !"#$%&'()*+,-./\\:;<=>?@[\]^_`{|}~]{8,20}$/
);

export const validateEmail = (value: string) => {
  return emailRegex.test(value);
};

export const validatePassword = (value: string) => {
  return passwordRegex.test(value);
};

export const mapErrorMessage = (error: any) => {
  if (Array.isArray(error?.message)) {
    let arr: string[] = [];
    error?.message.forEach((item: any) => {
      arr = [...arr, item.message];
    });
    return message.error(arr.join(", "));
  }
  return message.error(error?.message);
};

export function capitalizeFirstLetter(str: string) {
  if (str) {
    const stringFirstLetter =
      str.charAt(0).toUpperCase() + str.toLowerCase().slice(1);
    return stringFirstLetter.replace(/_/g, " ");
  }
  return null;
}

export function capitalizeEachFirstLetter(str: string) {
  const convertToArray = str.replace(/_/g, " ").toLowerCase().split(" ");
  const result = convertToArray.map((val) => {
    return val.replace(val.charAt(0), val.charAt(0).toUpperCase());
  });

  return result.join(" ");
}
