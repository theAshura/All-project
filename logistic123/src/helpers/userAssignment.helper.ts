import { UserAssignments } from 'models/common.model';

export const convertDataUserAssignment = (
  userAssignments: UserAssignments[],
) => {
  if (!userAssignments?.length) {
    return [];
  }
  let usersPermissions = [];
  userAssignments?.forEach((item) => {
    if (usersPermissions?.some((i) => i.permission === item?.permission)) {
      usersPermissions = usersPermissions?.map((i) =>
        i?.permission === item?.permission
          ? {
              permission: i?.permission,
              userIds: i.userIds?.concat([item?.user?.id]),
            }
          : i,
      );
    } else {
      usersPermissions?.push({
        permission: item.permission,
        userIds: [item?.user?.id],
      });
    }
  });
  return usersPermissions;
};
