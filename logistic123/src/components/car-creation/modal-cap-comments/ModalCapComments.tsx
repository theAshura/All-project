import { yupResolver } from '@hookform/resolvers/yup';
import images from 'assets/images/images';
import cx from 'classnames';
import NoDataImg from 'components/common/no-data/NoData';
import { RowComponent } from 'components/common/table/row/rowCp';
import TableCp from 'components/common/table/TableCp';
import Button, { ButtonSize, ButtonType } from 'components/ui/button/Button';
import { GroupButton } from 'components/ui/button/GroupButton';
import Input from 'components/ui/input/Input';
import { showConfirmBase } from 'components/ui/modal/confirmBase';
import ModalComponent from 'components/ui/modal/Modal';
import { ActivePermission, MaxLength } from 'constants/common.const';
import {
  ActionTypeEnum,
  Features,
  SubFeatures,
} from 'constants/roleAndPermission.const';
import { COMMON_DYNAMIC_FIELDS } from 'constants/dynamic/common.const';
import { renderDynamicLabel } from 'helpers/dynamic.helper';
import { formatDateTime } from 'helpers/utils.helper';
import { CAR_CAP_DYNAMIC_FIELDS } from 'constants/dynamic/car-cap.const';
import { IDynamicLabel } from 'models/api/dynamic/dynamic.model';
import { Action } from 'models/common.model';
import {
  FC,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { FieldValues, useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import * as yup from 'yup';
import { CarFormContext } from '../CarFormContext';
import styles from './modal-cap.module.scss';

interface TableCapCommentProps {
  onchange?: (comment) => void;
  disable?: boolean;
  viewOnly?: boolean;
  dynamicLabels?: IDynamicLabel;
}
const defaultValues = {
  comment: '',
};

const TableCapComment: FC<TableCapCommentProps> = (props) => {
  const { workFlowActiveUserPermission } = useSelector(
    (state) => state.workFlow,
  );
  const { disable, viewOnly, dynamicLabels } = props;
  const { step2Values, setStep2Values } = useContext(CarFormContext);

  const schema = yup.object().shape({
    comment: yup
      .string()
      .trim()
      .nullable()
      .required(
        renderDynamicLabel(
          dynamicLabels,
          COMMON_DYNAMIC_FIELDS['This field is required'],
        ),
      ),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FieldValues>({
    mode: 'all',
    defaultValues,
    resolver: yupResolver(schema),
  });
  const [modal, setModal] = useState(false);
  const [comment, setComment] = useState<any[]>([]);
  const rowLabels = useMemo(
    () => [
      !viewOnly && {
        id: 'action',
        label: renderDynamicLabel(dynamicLabels, CAR_CAP_DYNAMIC_FIELDS.Action),
        sort: false,
        width: '100',
      },
      {
        id: 'sNo',
        label: renderDynamicLabel(
          dynamicLabels,
          CAR_CAP_DYNAMIC_FIELDS['S.No'],
        ),
        sort: true,
        width: '100',
      },
      {
        id: 'comment',
        label: renderDynamicLabel(
          dynamicLabels,
          CAR_CAP_DYNAMIC_FIELDS.Comment,
        ),
        sort: true,
        width: '210',
      },
      {
        id: 'commentedBy',
        label: renderDynamicLabel(
          dynamicLabels,
          CAR_CAP_DYNAMIC_FIELDS['Commented by'],
        ),
        sort: true,
        width: '100',
        maxWidth: '200',
      },
      {
        id: 'commentedDate',
        label: renderDynamicLabel(
          dynamicLabels,
          CAR_CAP_DYNAMIC_FIELDS['Commented date'],
        ),
        sort: true,
        width: '70',
      },
    ],
    [dynamicLabels, viewOnly],
  );

  useEffect(() => {
    if (step2Values?.comments) {
      setComment(step2Values?.comments);
    }
  }, [step2Values?.comments]);

  const onSubmitForm = (data) => {
    const newComment = [...comment];
    newComment.push(data);
    setComment(newComment);
    setStep2Values((prev) => ({ ...prev, comments: newComment }));
    setModal(false);
  };

  const handleCancel = () => {
    setModal(false);
  };

  const onDeleteComment = useCallback(
    (index) => {
      const newComment = [...comment];
      newComment.splice(index, 1);
      setStep2Values((prev) => ({ ...prev, comments: newComment }));
    },
    [comment, setStep2Values],
  );

  const handleDelete = useCallback(
    (index?) => {
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
        onPressButtonRight: () => onDeleteComment(index),
      });
    },
    [dynamicLabels, onDeleteComment],
  );

  const sanitizeData = (data, index) => {
    const finalData = {
      id: data?.id || index,
      sNo: index + 1,
      comment: data?.comment || '',
      commentedBy: data?.createdUser?.username || '',
      commentedDate: formatDateTime(data?.createdAt) || '',
    };
    return finalData;
  };

  const checkWorkFlow = useMemo(() => {
    if (
      workFlowActiveUserPermission.some(
        (item) => item === ActivePermission.CREATOR,
      )
    ) {
      return true;
    }
    return false;
  }, [workFlowActiveUserPermission]);

  const renderRow = useCallback(
    (isScrollable?: boolean) => {
      if (comment?.length > 0) {
        return (
          <tbody>
            {comment?.map((item, index) => {
              const finalData = sanitizeData(item, index);
              const actions: Action[] = [
                {
                  img: images.icons.icRemove,
                  function: !disable ? () => handleDelete(index) : undefined,
                  feature: Features.AUDIT_INSPECTION,
                  subFeature: SubFeatures.PLANNING_AND_REQUEST,
                  action: ActionTypeEnum.DELETE,
                  buttonType: ButtonType.Orange,
                  disable,
                },
              ];
              return (
                <RowComponent
                  isScrollable={isScrollable}
                  data={finalData}
                  actionList={actions}
                  validWordFlow={checkWorkFlow}
                  rowLabels={rowLabels}
                  key={String(item?.serialNumber + index)}
                />
              );
            })}
          </tbody>
        );
      }
      return null;
    },
    [comment, disable, checkWorkFlow, rowLabels, handleDelete],
  );

  const renderForm = () => (
    <>
      <div>
        <Input
          isRequired
          label={renderDynamicLabel(
            dynamicLabels,
            CAR_CAP_DYNAMIC_FIELDS['CAP comment'],
          )}
          {...register('comment')}
          messageRequired={errors?.comment?.message || ''}
          placeholder={renderDynamicLabel(
            dynamicLabels,
            CAR_CAP_DYNAMIC_FIELDS['Enter comment'],
          )}
          maxLength={MaxLength.MAX_LENGTH_OPTIONAL}
        />
      </div>
    </>
  );

  const renderFooter = () => (
    <>
      <div>
        <GroupButton
          className={cx(styles.GroupButton, 'mt-4 justify-content-end')}
          buttonTypeLeft={ButtonType.PrimaryLight}
          dynamicLabels={dynamicLabels}
          handleCancel={handleCancel}
          handleSubmit={handleSubmit(onSubmitForm)}
        />
      </div>
    </>
  );

  useEffect(() => {
    if (!modal) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modal]);

  return (
    <div className={cx('mt-4', styles.wrap)}>
      {!viewOnly && (
        <div className="d-flex justify-content-between align-items-center">
          <div className={cx(styles.title)}>
            {renderDynamicLabel(
              dynamicLabels,
              CAR_CAP_DYNAMIC_FIELDS['CAP comment'],
            )}
          </div>
          <Button
            disabled={disable}
            disabledCss={disable}
            onClick={() => setModal(true)}
            buttonSize={ButtonSize.Medium}
            buttonType={ButtonType.Primary}
            className={cx('mt-auto ', styles.button)}
            renderSuffix={
              <img
                src={images.icons.icAddCircle}
                alt="createNew"
                className={styles.icButton}
              />
            }
          >
            {renderDynamicLabel(dynamicLabels, CAR_CAP_DYNAMIC_FIELDS.Add)}
          </Button>
        </div>
      )}
      <div className={cx('pt-4', styles.table)}>
        {comment?.length ? (
          <TableCp
            rowLabels={rowLabels}
            renderRow={renderRow}
            loading={false}
            isEmpty={undefined}
          />
        ) : (
          <NoDataImg />
        )}
      </div>
      <ModalComponent
        isOpen={modal}
        toggle={() => {
          setModal(false);
        }}
        title={renderDynamicLabel(
          dynamicLabels,
          CAR_CAP_DYNAMIC_FIELDS['Add comment'],
        )}
        content={renderForm()}
        footer={renderFooter()}
      />
    </div>
  );
};

export default TableCapComment;
