import Button, { ButtonSize, ButtonType } from 'components/ui/button/Button';
import { useState, useContext } from 'react';
import images from 'assets/images/images';
import { Datum, ActionPermission } from 'models/api/role/role.model';
import { AppRouteConst } from 'constants/route.const';
import { IDynamicLabel } from 'models/api/dynamic/dynamic.model';
import { renderDynamicLabel } from 'helpers/dynamic.helper';
import { COMMON_DYNAMIC_FIELDS } from 'constants/dynamic/common.const';
import { DETAIL_ROLE_AND_PERMISSION_DYNAMIC_FIELDS } from 'constants/dynamic/role-and-permission.const';
import history from 'helpers/history.helper';
import { Features, SubFeatures } from 'constants/roleAndPermission.const';
import { useSelector } from 'react-redux';
import { Table } from 'reactstrap';
import { RoleContext } from '../../../contexts/role/RoleContext';
import styles from './common-detail.module.scss';
import RowTable from './RowTable';
import ModalConfirm from '../modal/ModalConfirm';

export interface TableRoleAndPermissionDetailProps {
  id?: string;
  dynamicLabels?: IDynamicLabel;
}

interface LabelsType {
  id: string;
  label: string;
  width?: string;
}

export function TableRoleAndPermissionDetail(
  props: TableRoleAndPermissionDetailProps,
) {
  const { id, dynamicLabels } = props;
  const { isEdit, isShowError, permissionIDs, permissions, submit } =
    useContext(RoleContext);

  const [modal, setModal] = useState(false);
  const { loading, listPermission, listActions } = useSelector(
    (state) => state.roleAndPermission,
  );

  const preventedMenus = [
    `${Features.CONFIGURATION}::${SubFeatures.VESSEL_OWNER_BUSINESS}`,
    `${Features.CONFIGURATION}::${SubFeatures.RISK_FACTOR}`,
    `${Features.CONFIGURATION}::${SubFeatures.DMS}`,
    `${Features.CONFIGURATION}::${SubFeatures.FLEET}`,
    `${Features.QUALITY_ASSURANCE}::${SubFeatures.VIEW_DASHBOARD}`,
  ];
  const preventedMenusNoSubMenu = [
    `${Features.QUALITY_ASSURANCE}::${SubFeatures.VIEW_DASHBOARD}`,
  ];
  const renderRows = (item: Datum, actions: ActionPermission[]) => (
    <>
      <RowTable
        item={item}
        actionItem={actions}
        hiddenCheckBox={
          item?.name !==
          `${Features.QUALITY_ASSURANCE}::${SubFeatures.QA_DASHBOARD}`
        }
      />
      {item?.children
        .filter((i) => !preventedMenus.includes(i?.name))
        .map((i) => (
          <RowTable key={i.id} item={i} actionItem={actions} isChildren />
        ))}
    </>
  );

  const renderTable = (item?: Datum) => {
    const hasSubMenu = [
      Features.QUALITY_ASSURANCE,
      Features.CONFIGURATION,
    ].some((feature) => feature === item?.name);

    let rowLabels: LabelsType[] = item?.actions?.map((i) => ({
      id: i?.id,
      label: i.name,
    }));

    if (hasSubMenu) {
      rowLabels = item?.actions?.map((i) => ({
        id: i?.id,
        label: i.name,
      }));
    }
    rowLabels = [
      {
        id: 'FEAture',
        label: item?.description,
      },
      {
        id: 'full_access',
        label: 'Full access',
      },
      ...rowLabels,

      {
        id: '1',
        label: '',
      },
    ];

    return (
      <div className={styles.wrapTableChild}>
        <Table hover className={styles.table}>
          <thead className={styles.thread}>
            <tr className={styles.titleTable}>
              {rowLabels.map((item) => (
                <th key={item.id} className={styles.subTitle}>
                  {/* {renderDynamicLabel(
                    dynamicLabels,
                    COMMON_DYNAMIC_FIELDS[item.label] || item.label,
                  )} */}
                  {item.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {hasSubMenu
              ? item?.children
                  ?.filter((i) => !preventedMenusNoSubMenu.includes(i?.name))
                  .map((i) => renderRows(i, item?.actions))
              : item?.children
                  ?.filter(
                    (permissions) => permissions?.name !== 'Configuration::DMS',
                  )
                  ?.map((i) => (
                    <RowTable key={i.id} item={i} actionItem={item?.actions} />
                  ))}
          </tbody>
        </Table>
      </div>
    );
  };

  const renderListTable = () =>
    permissions?.map((item, index) => (
      <div key={index.toString() + item?.id}>{renderTable(item)}</div>
    ));

  return (
    <div className={styles.tableDetail}>
      <div className={styles.wrapTitleTableTop}>
        <div className="d-flex">
          <div className={styles.title}>
            {renderDynamicLabel(
              dynamicLabels,
              DETAIL_ROLE_AND_PERMISSION_DYNAMIC_FIELDS['Feature permission'],
            )}
          </div>
          {isEdit && (
            <img
              src={images.icons.icRequiredAsterisk}
              className={styles.icRequired}
              alt="required"
            />
          )}
        </div>
        {isShowError && permissionIDs?.length === 0 && (
          <div className={styles.errorFeature}>
            {renderDynamicLabel(
              dynamicLabels,
              DETAIL_ROLE_AND_PERMISSION_DYNAMIC_FIELDS[
                'The permission is required'
              ],
            )}
          </div>
        )}
      </div>

      <div className={styles.wrapTable}>
        {loading && (
          <div className="d-flex justify-content-center">
            <img
              src={images.common.loading}
              className={styles.loading}
              alt="loading"
            />
          </div>
        )}
        {!loading &&
          listPermission?.length > 0 &&
          listActions?.length > 0 &&
          renderListTable()}
        {!loading &&
          (listPermission?.length === 0 || listActions?.length === 0) && (
            <div className="d-flex justify-content-center">
              <img
                src={images.icons.icNoData}
                className={styles.noData}
                alt="no data"
              />
            </div>
          )}
      </div>
      {isEdit && (
        <div className={styles.footer}>
          <Button
            buttonType={ButtonType.CancelOutline}
            buttonSize={ButtonSize.Medium}
            className={styles.buttonCancel}
            onClick={() => {
              setModal(!modal);
            }}
          >
            {renderDynamicLabel(dynamicLabels, COMMON_DYNAMIC_FIELDS.Cancel)}
          </Button>
          <Button
            buttonType={ButtonType.Primary}
            buttonSize={ButtonSize.Medium}
            className={styles.buttonSave}
            onClick={() => submit(id)}
            disabledCss={!isEdit}
          >
            {renderDynamicLabel(dynamicLabels, COMMON_DYNAMIC_FIELDS.Save)}
          </Button>
        </div>
      )}

      <ModalConfirm
        toggle={() => setModal(!modal)}
        dynamicLabels={dynamicLabels}
        modal={modal}
        handleSubmit={() => history.push(AppRouteConst.ROLE)}
        title={renderDynamicLabel(
          dynamicLabels,
          COMMON_DYNAMIC_FIELDS['Cancel?'],
        )}
        content={renderDynamicLabel(
          dynamicLabels,
          COMMON_DYNAMIC_FIELDS[
            'Are you sure you want to proceed with this action?'
          ],
        )}
      />
    </div>
  );
}
