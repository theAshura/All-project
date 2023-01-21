import { useState, useEffect } from 'react';
import useEffectOnce from 'hoc/useEffectOnce';
import { useSelector, useDispatch } from 'react-redux';
import { CreateGroupBody } from 'models/api/group/group.model';
import { BREAD_CRUMB } from 'constants/components/breadcrumb.const';
import {
  createGroupAction,
  clearErrorMessages,
} from 'store/group/group.action';
import { AppRouteConst } from 'constants/route.const';
import Form, { Errors } from 'components/group/forms/GroupForm';
import history from 'helpers/history.helper';
import {
  ActionTypeEnum,
  Features,
  SubFeatures,
} from 'constants/roleAndPermission.const';
import NoPermissionComponent from 'containers/no-permission/index';
import PermissionCheck from 'hoc/withPermissionCheck';

const GroupManagementCreate = () => {
  const dispatch = useDispatch();
  const [groupCode, setGroupCode] = useState<string>('');
  const [groupName, setGroupName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [errors, setErrors] = useState<Errors>({});
  const { messageError, loading } = useSelector((store) => store.group);

  useEffectOnce(() => {
    dispatch(clearErrorMessages());
  });

  useEffect(() => {
    let messages = {};
    messageError?.forEach((i) => {
      messages = { ...messages, [i?.fieldName]: i?.message };
    });
    setErrors(messages);
  }, [messageError]);

  const handleSubmit = () => {
    const body: CreateGroupBody = {
      code: groupCode,
      name: groupName,
      description,
    };
    dispatch(createGroupAction.request(body));
  };

  const handleCancel = () => {
    history.push(AppRouteConst.GROUP);
  };

  return (
    <PermissionCheck
      options={{
        feature: Features.COMPANY,
        subFeature: SubFeatures.GROUP,
        action: ActionTypeEnum.CREATE,
      }}
    >
      {({ hasPermission }) =>
        hasPermission ? (
          <Form
            code={groupCode}
            currentBreadcrumbs={BREAD_CRUMB.GROUP_CREATE}
            name={groupName}
            description={description}
            setCode={setGroupCode}
            setName={setGroupName}
            handleSubmit={handleSubmit}
            handleCancel={handleCancel}
            setDescription={setDescription}
            errors={errors}
            loading={loading}
            isCreate
          />
        ) : (
          <NoPermissionComponent />
        )
      }
    </PermissionCheck>
  );
};

export default GroupManagementCreate;
