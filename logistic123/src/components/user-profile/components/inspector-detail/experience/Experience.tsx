import images from 'assets/images/images';
import cx from 'classnames';
import { useDispatch, useSelector } from 'react-redux';
import Button, { ButtonSize, ButtonType } from 'components/ui/button/Button';
import { StatusPage, UserContext } from 'contexts/user-profile/UserContext';
import { Experience } from 'models/api/user/user.model';
import moment from 'moment';
import {
  clearUserExperienceErrorReducer,
  createUserExperienceActions,
  deleteUserExperienceActions,
  getListExperienceActions,
  updateUserExperienceActions,
} from 'store/user/user.action';
import { FC, useCallback, useContext, useEffect, useState } from 'react';
import { showConfirmBase } from 'components/ui/modal/confirmBase';
import Tooltip from 'antd/lib/tooltip';
import { renderDynamicLabel } from 'helpers/dynamic.helper';
import { COMMON_DYNAMIC_FIELDS } from 'constants/dynamic/common.const';
import { IDynamicLabel } from 'models/api/dynamic/dynamic.model';
import ModalExperience from './ModalExperience';
import styles from './experience.module.scss';

const TOOLTIP_COLOR = '#3B9FF3';

interface Props {
  disabled?: boolean;
  dynamicLabels?: IDynamicLabel;
}

const ExperienceList: FC<Props> = ({ disabled, dynamicLabels }) => {
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [selected, setSelected] = useState<Experience>(null);
  const { experience, userDetailResponse } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const { isInspector, statusPage } = useContext(UserContext);

  const handleDelete = useCallback(
    (id: string) => {
      dispatch(
        deleteUserExperienceActions.request({
          id,
          handleSuccess: () => {
            dispatch(
              getListExperienceActions.request({
                id: userDetailResponse.id,
                params: { pageSize: -1, sort: 'startDate:-1' },
              }),
            );
          },
        }),
      );
    },
    [dispatch, userDetailResponse.id],
  );

  const onEdit = useCallback((data: Experience) => {
    setSelected(data);
    setOpenModal(true);
  }, []);

  const onDelete = useCallback(
    (id: string) => {
      showConfirmBase({
        isDelete: true,
        txTitle: renderDynamicLabel(
          dynamicLabels,
          COMMON_DYNAMIC_FIELDS['Delete?'],
        ),
        txMsg: renderDynamicLabel(
          dynamicLabels,
          COMMON_DYNAMIC_FIELDS[
            'Are you sure you want to delete this record? This action cannot be undone and you will not be able to recover any data.'
          ],
        ),
        txButtonLeft: renderDynamicLabel(
          dynamicLabels,
          COMMON_DYNAMIC_FIELDS.Cancel,
        ),
        txButtonRight: renderDynamicLabel(
          dynamicLabels,
          COMMON_DYNAMIC_FIELDS.Delete,
        ),
        onPressButtonRight: () => handleDelete(id),
      });
    },
    [dynamicLabels, handleDelete],
  );
  const handleSubmit = useCallback(
    (dataForm, idExperience?: string) => {
      const { endDate, ...other } = dataForm;
      let params = {
        ...other,

        userId: userDetailResponse?.id,
        startDate: moment(dataForm.startDate).toISOString(),
        country: dataForm.country?.[0]?.value,
      };
      if (!idExperience) {
        if (!dataForm?.tillPresent) {
          params = {
            ...params,
            endDate: moment(endDate).toISOString(),
          };
        }
        dispatch(
          createUserExperienceActions.request({
            ...params,
            handleSuccess: () => {
              dispatch(
                getListExperienceActions.request({
                  id: userDetailResponse.id,
                  params: { pageSize: -1 },
                }),
              );
              setOpenModal(false);
              setSelected(null);
            },
          }),
        );
      } else {
        dispatch(
          updateUserExperienceActions.request({
            id: idExperience,
            data: {
              ...params,
              endDate: moment(dataForm.endDate).toISOString(),
            },
            handleSuccess: () => {
              dispatch(
                getListExperienceActions.request({
                  id: userDetailResponse.id,
                  params: { pageSize: -1 },
                }),
              );
              setOpenModal(false);
              setSelected(null);
            },
          }),
        );
      }
    },
    [dispatch, userDetailResponse.id],
  );

  useEffect(() => {
    if (userDetailResponse?.id && isInspector) {
      dispatch(
        getListExperienceActions.request({
          id: userDetailResponse?.id,
          params: { pageSize: -1, sort: 'startDate:-1' },
        }),
      );
    }

    return () => {
      dispatch(clearUserExperienceErrorReducer());
    };
  }, [dispatch, isInspector, userDetailResponse?.id]);

  return (
    <div className={styles.wrap}>
      <div
        className={cx(
          styles.header,
          'd-flex align-items-center justify-content-between',
        )}
      >
        <div className={styles.title}>
          {renderDynamicLabel(dynamicLabels, COMMON_DYNAMIC_FIELDS.Experience)}
        </div>
        <Button
          onClick={() => {
            setOpenModal(true);
            setSelected(null);
          }}
          className={styles.btnAdd}
          buttonSize={ButtonSize.Medium}
          buttonType={ButtonType.Primary}
          renderSuffix={
            <img
              src={images.icons.icAddCircle}
              alt="createNew"
              className={styles.addIc}
            />
          }
        >
          {renderDynamicLabel(dynamicLabels, COMMON_DYNAMIC_FIELDS.Add)}
        </Button>
      </div>
      <div className={cx(styles.wrapperList)}>
        {experience?.list?.data?.map((itemExperience) => (
          <div key={itemExperience?.id} className={cx(styles.wrapperEx)}>
            <div
              className={cx(
                'd-flex justify-content-between align-items-center',
                styles.wrapContent,
              )}
            >
              <div>
                <Tooltip
                  placement="topLeft"
                  title={itemExperience?.position}
                  color={TOOLTIP_COLOR}
                >
                  <p className={cx(styles.title, 'limit-line-text')}>
                    {itemExperience?.position}
                  </p>
                </Tooltip>

                <Tooltip
                  placement="topLeft"
                  title={`${itemExperience?.companyName} in ${itemExperience?.country}`}
                  color={TOOLTIP_COLOR}
                >
                  <p className={cx(styles.description, 'limit-line-text')}>
                    {itemExperience?.companyName}
                    <span className="px-1">
                      {renderDynamicLabel(
                        dynamicLabels,
                        COMMON_DYNAMIC_FIELDS.in,
                      )}
                    </span>
                    {itemExperience?.country}
                  </p>
                </Tooltip>

                <p className={cx(styles.date, 'limit-line-text')}>
                  {moment(itemExperience?.startDate).format('DD-MMM-YYYY')} -{' '}
                  {itemExperience?.tillPresent || !itemExperience?.endDate
                    ? renderDynamicLabel(
                        dynamicLabels,
                        COMMON_DYNAMIC_FIELDS.Present,
                      )
                    : moment(itemExperience?.endDate).format('DD-MMM-YYYY')}
                </p>
                <div className={cx(styles.circle)} />
                <div className={cx(styles.stick)} />
              </div>
              {statusPage !== StatusPage.VIEW && (
                <div className="d-flex">
                  <Button
                    className={cx(styles.action)}
                    onClick={() => onEdit(itemExperience)}
                  >
                    <img
                      className={cx(styles.action)}
                      src={images.icons.icEditPencil}
                      alt="edit"
                    />
                  </Button>
                  <Button
                    className={cx(styles.action)}
                    onClick={() => onDelete(itemExperience?.id)}
                  >
                    <img src={images.icons.icRemoveGray} alt="delete" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <ModalExperience
        isOpen={openModal}
        data={selected}
        onClose={() => {
          setSelected(null);
          setOpenModal(false);
        }}
        onSubmit={handleSubmit}
        dynamicLabels={dynamicLabels}
      />
    </div>
  );
};

export default ExperienceList;
