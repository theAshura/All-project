import { createContext, useState } from 'react';
import { Datum } from 'models/api/role/role.model';
import { useDispatch } from 'react-redux';
import {
  createRoleActions,
  updateRoleActions,
  clearRolesErrorsReducer,
} from 'store/role/role.action';

import { ActionsType } from 'models/store/role/role.model';

interface RoleAndPermission {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  roleId: string;
  permissionId: string;
  isEnable: boolean;
}
interface DataContent {
  name?: string;
  description?: string;
  status?: string;
  rolePermissions?: RoleAndPermission[];
}
export interface DefaultValue {
  id: string;
  roleId: string;
  permissionId: string;
}
interface RoleAndPermissionContextValues {
  actions: ActionsType[];
  permissions: Datum[];
  permissionIDs: string[];
  content: DataContent;
  defaultValue: DefaultValue[];
  isEdit: boolean;
  isShowError: boolean;
  isCreate: boolean;
  setDataIsCreate: (value: boolean) => void;
  setDataIsEdit: (value: boolean) => void;
  setDataDefaultValue: (value: DefaultValue[]) => void;
  setDataContent: (field: string, value: string | number) => void;
  setDataAllContent: (value: DataContent) => void;
  setDataPermissionIDs: (value: string) => void;
  setDataPermissionAllIDs: (value: string[]) => void;
  setDataActions: (value: ActionsType[]) => void;
  setDataPermissions: (value: Datum[]) => void;
  submit: (id?: string) => void;
  setIsShowError: (value: boolean) => void;
}

export const RoleContext = createContext<
  RoleAndPermissionContextValues | undefined
>(undefined);

const RoleAndPermissionProvider = ({ children }) => {
  const dispatch = useDispatch();
  const [actions, setActions] = useState([]);
  const [isShowError, setIsShowError] = useState(false);

  const [defaultValue, setDefaultValue] = useState([]);

  const [content, setContent] = useState<DataContent>({
    name: '',
    description: '',
    status: '',
  });

  const [permissionIDs, setPermissionIDs] = useState([]);
  const [permissions, setPermission] = useState([]);
  const [isEdit, setIsEdit] = useState(true);
  const [isCreate, setIsCreate] = useState(false);
  const setDataIsEdit = (value: boolean) => {
    setIsEdit(value);
  };
  const setDataIsCreate = (value: boolean) => {
    setIsCreate(value);
  };
  const setDataDefaultValue = (value: DefaultValue[]) => {
    setDefaultValue([...value]);
  };
  const setDataContent = (field: string, value: string | number) => {
    setContent({ ...content, [field]: value });
    if (field === 'name') {
      dispatch(clearRolesErrorsReducer());
    }
  };

  const setDataAllContent = (value: DataContent) => {
    setContent(value);
  };

  const setDataActions = (value: ActionsType[]) => {
    setActions(value);
  };

  const setDataPermissions = (value: Datum[]) => {
    setPermission(value);
  };

  const setDataPermissionAllIDs = (value: string[]) => {
    setPermissionIDs([...value]);
  };
  const setDataPermissionIDs = (value: string) => {
    const isRemove = permissionIDs.includes(value);
    let newData: string[] = [...permissionIDs];
    if (isRemove) {
      newData = newData.filter((item) => item !== value);
    } else {
      newData = [...newData, value];
    }
    setPermissionIDs([...newData]);
  };

  const submit = (id?: string) => {
    if (
      content.name?.trim() &&
      content.status?.trim() &&
      permissionIDs.length > 0
    ) {
      if (isEdit && id) {
        dispatch(
          updateRoleActions.request({
            id,
            data: {
              name: content?.name?.trim(),
              description: content?.description?.trim(),
              status: content?.status?.trim(),
              permissions: [...permissionIDs],
            },
          }),
        );
      } else {
        dispatch(
          createRoleActions.request({
            name: content?.name?.trim(),
            description: content?.description?.trim(),
            status: content?.status?.trim(),
            permissions: [...permissionIDs],
          }),
        );
      }
    } else {
      setIsShowError(true);
    }
  };

  const themeContextData = {
    actions,
    permissionIDs,
    permissions,
    content,
    defaultValue,
    isEdit,
    isShowError,
    isCreate,
    setDataIsCreate,
    setDataIsEdit,
    setDataDefaultValue,
    setDataContent,
    setDataAllContent,
    setIsShowError,
    setDataActions,
    setDataPermissions,
    setDataPermissionIDs,
    setDataPermissionAllIDs,
    submit,
  };

  return (
    <RoleContext.Provider value={themeContextData}>
      {children}
    </RoleContext.Provider>
  );
};

export default RoleAndPermissionProvider;
