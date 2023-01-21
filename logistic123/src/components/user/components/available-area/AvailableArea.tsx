import { Row, Col } from 'reactstrap';
import { StatusPage, UserContext } from 'contexts/user/UserContext';
import Button, { ButtonSize, ButtonType } from 'components/ui/button/Button';
import cx from 'classnames';
import ModalConfirm from 'components/role/modal/ModalConfirm';
import history from 'helpers/history.helper';
import isEmpty from 'lodash/isEmpty';
import { AppRouteConst } from 'constants/route.const';
import { useSelector } from 'react-redux';
import { useFormContext } from 'react-hook-form';
import { FC, useContext, useState } from 'react';
import { IDynamicLabel } from 'models/api/dynamic/dynamic.model';
import { renderDynamicLabel } from 'helpers/dynamic.helper';
import { COMMON_DYNAMIC_FIELDS } from 'constants/dynamic/common.const';
import Preference from './preference/Preference';

import styles from './available-area.module.scss';

interface AvailableProps {
  onSubmit?: (data) => void;
  internalLoading?: boolean;
  dynamicLabels?: IDynamicLabel;
}

const AvailableArea: FC<AvailableProps> = ({
  onSubmit,
  internalLoading = false,
  dynamicLabels,
}) => {
  const { statusPage } = useContext(UserContext);
  const [modal, setModal] = useState(false);

  const { watch, handleSubmit } = useFormContext();
  const { disable } = useSelector((state) => state.user);

  const handleSubmitFn = (dataForm) => {
    onSubmit({
      ...dataForm,
    });
  };

  return (
    <div className={styles.accountInformation}>
      <div className={styles.accountInformationContainer}>
        <Row>
          <Col>
            <Preference dynamicLabels={dynamicLabels} typePreference="strong" />
          </Col>
          <Col>
            <Preference
              dynamicLabels={dynamicLabels}
              typePreference="neutral"
            />
          </Col>
          <Col>
            <Preference dynamicLabels={dynamicLabels} typePreference="no" />
          </Col>
        </Row>
      </div>

      {statusPage !== StatusPage.VIEW && (
        <div className={cx('d-flex justify-content-end pt-3', styles.wrapBtn)}>
          <Button
            className="me-3"
            buttonType={ButtonType.Select}
            buttonSize={ButtonSize.Small}
            onClick={() => setModal(true)}
          >
            {renderDynamicLabel(dynamicLabels, COMMON_DYNAMIC_FIELDS.Cancel)}
          </Button>
          <Button
            buttonSize={ButtonSize.Small}
            loading={internalLoading || disable}
            onClick={handleSubmit(handleSubmitFn, (err) => {
              const watchForm = watch();
              const watchAvailableArea = watch('availableAreas');

              if (isEmpty(err?.roles)) {
                handleSubmitFn({
                  ...watchForm,
                  availableAreas: watchAvailableArea,
                });
              }
            })}
          >
            {statusPage === StatusPage.EDIT
              ? renderDynamicLabel(dynamicLabels, COMMON_DYNAMIC_FIELDS.Save)
              : renderDynamicLabel(dynamicLabels, COMMON_DYNAMIC_FIELDS.Next)}
          </Button>
        </div>
      )}

      <ModalConfirm
        toggle={() => setModal(!modal)}
        modal={modal}
        handleSubmit={() => history.push(AppRouteConst.USER)}
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
        dynamicLabels={dynamicLabels}
      />
    </div>
  );
};
export default AvailableArea;
