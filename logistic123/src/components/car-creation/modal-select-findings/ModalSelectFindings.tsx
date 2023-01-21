import Table, { ColumnsType } from 'antd/lib/table';
import { getRofFindingWithNoCar } from 'api/report-of-finding.api';
import images from 'assets/images/images';
import cx from 'classnames';
import NoDataImg from 'components/common/no-data/NoData';
import Button, { ButtonSize, ButtonType } from 'components/ui/button/Button';
import CustomCheckbox from 'components/ui/checkbox/Checkbox';
import Input from 'components/ui/input/Input';
import { KeyPress } from 'constants/common.const';
import { getListFileApi } from 'api/dms.api';
import { toastError } from 'helpers/notification.helper';
import { COMMON_DYNAMIC_FIELDS } from 'constants/dynamic/common.const';
import cloneDeep from 'lodash/cloneDeep';
import {
  FC,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { renderDynamicLabel } from 'helpers/dynamic.helper';
import { CAR_CAP_DYNAMIC_FIELDS } from 'constants/dynamic/car-cap.const';
import { IDynamicLabel } from 'models/api/dynamic/dynamic.model';
import { useSelector } from 'react-redux';
import { Modal, ModalProps } from 'reactstrap';
import { CarFormContext } from '../CarFormContext';
import styles from './modal-select-findings.module.scss';

interface ModalComponentProps extends ModalProps {
  isOpen: boolean;
  onClose: () => void;
  modalClassName?: string;
  contentClassName?: string;
  classesName?: string;
  dynamicLabels?: IDynamicLabel;
}

const ModalSelectFindings: FC<ModalComponentProps> = ({
  isOpen,
  onClose,
  modalClassName,
  contentClassName,
  classesName,
  dynamicLabels,
  ...other
}) => {
  const { ReportOfFindingDetail } = useSelector(
    (state) => state.reportOfFinding,
  );
  const { setStep1Values, rofId, step1Values } = useContext(CarFormContext);

  const [listFindingSelected, selectFinding] = useState([]);
  const [initialFindings, setInitialFinding] = useState([]);
  const [listFindingItems, setListFindingItems] = useState([]);
  const [search, setSearch] = useState('');

  // useEffect(() => {
  //   if (ReportOfFindingDetail?.reportFindingItems) {
  //     setListFindingItems(ReportOfFindingDetail?.reportFindingItems);
  //   }
  // }, [ReportOfFindingDetail?.reportFindingItems]);

  useEffect(() => {
    if (ReportOfFindingDetail?.id || rofId) {
      getRofFindingWithNoCar(rofId || ReportOfFindingDetail?.id)
        .then((res) => {
          setListFindingItems(res?.data?.data || []);
          setInitialFinding(res?.data?.data || []);
        })
        // eslint-disable-next-line no-console
        .catch((err) => console.log(err));
    }
  }, [ReportOfFindingDetail?.id, rofId]);

  useEffect(() => {
    if (step1Values?.findingSelected) {
      selectFinding(step1Values?.findingSelected);
    }
  }, [step1Values?.findingSelected]);

  const handleSelectFinding = useCallback(
    (id: string) => {
      if (id === 'all') {
        if (listFindingSelected?.length === listFindingItems?.length) {
          selectFinding([]);
        } else {
          selectFinding(listFindingItems);
        }
        return;
      }
      const existId = listFindingSelected?.some((i) => i?.id === id);
      if (existId) {
        const newList = listFindingSelected?.filter((i) => i.id !== id);
        selectFinding(newList);
      } else {
        const newList = cloneDeep(listFindingSelected);
        const findingSelected = listFindingItems?.find((i) => i.id === id);
        newList?.push(findingSelected);
        selectFinding(newList);
      }
    },
    [listFindingItems, listFindingSelected],
  );

  const handleFilterBySearch = useCallback(() => {
    if (!search) {
      setListFindingItems(initialFindings);
      return;
    }
    const result = initialFindings.filter(
      (i) =>
        i.reference?.includes(search) ||
        i?.auditTypeName?.includes(search) ||
        i.reference?.includes(search) ||
        i.findingStatus?.includes(search) ||
        i?.findingRemark?.includes(search),
    );
    setListFindingItems(result);
  }, [initialFindings, search]);

  const columns: ColumnsType = [
    {
      title: '',
      dataIndex: 'id',
      key: 'id',
      width: 50,
      render: (id) => (
        <div className="position-relative">
          {listFindingItems && listFindingItems[0]?.id === id && (
            <div className={styles.customSelectAll}>
              <CustomCheckbox
                value={id}
                checked={
                  listFindingItems?.length &&
                  listFindingSelected?.length &&
                  listFindingItems?.length === listFindingSelected?.length
                }
                onChange={(e) => {
                  handleSelectFinding('all');
                }}
              />
            </div>
          )}
          <CustomCheckbox
            value={id}
            checked={listFindingSelected?.some((i) => i.id === id)}
            onChange={(e) => {
              handleSelectFinding(id);
            }}
          />
        </div>
      ),
    },
    {
      title: renderDynamicLabel(dynamicLabels, CAR_CAP_DYNAMIC_FIELDS['S.No']),
      dataIndex: 'sNo',
      key: 'sNo',
    },
    {
      title: renderDynamicLabel(
        dynamicLabels,
        CAR_CAP_DYNAMIC_FIELDS['Reference number'],
      ),
      dataIndex: 'reference',
      key: 'reference',
    },
    {
      title: renderDynamicLabel(
        dynamicLabels,
        CAR_CAP_DYNAMIC_FIELDS['Inspection type'],
      ),
      dataIndex: 'auditTypeName',
      key: 'auditTypeName',
    },
    {
      title: renderDynamicLabel(
        dynamicLabels,
        CAR_CAP_DYNAMIC_FIELDS['Finding comments'],
      ),
      dataIndex: 'findingComment',
      key: 'findingComment',
    },
    {
      title: renderDynamicLabel(
        dynamicLabels,
        CAR_CAP_DYNAMIC_FIELDS['Finding remarks'],
      ),
      dataIndex: 'findingRemark',
      key: 'findingRemark',
    },
    {
      title: renderDynamicLabel(
        dynamicLabels,
        CAR_CAP_DYNAMIC_FIELDS['Finding type'],
      ),
      dataIndex: 'natureFindingName',
      key: 'natureFindingName',
    },
  ];

  const dataSource = useMemo(
    () =>
      listFindingItems?.map((item, index) => ({
        sNo: index + 1,
        id: item.id,
        reference: item?.reference || 'N/A',
        auditTypeName: item?.auditTypeName,
        findingComment: item?.findingComment,
        findingRemark: item?.findingRemark,
        natureFindingName: item?.natureFindingName,
      })),
    [listFindingItems],
  );

  const closeAndClearData = useCallback(() => {
    onClose();
    if (step1Values?.findingSelected) {
      selectFinding(step1Values?.findingSelected);
    } else {
      selectFinding([]);
    }

    setSearch('');
  }, [onClose, step1Values?.findingSelected]);

  const getListFileAttach = useCallback(async (ids: string[]) => {
    if (!ids || ids?.length <= 0) {
      return [];
    }
    try {
      const listFileAttach = await getListFileApi({ ids });
      return (
        listFileAttach?.data?.map((i) => ({
          id: i.id,
          name: i.originName,
          size: i.size,
          mimetype: i.mimetype,
          key: i.key,
          link: i.link,
          lastModifiedDate: i.createdAt,
          uploadByUser: i?.uploadByUser?.username || '',
        })) || []
      );
    } catch (error) {
      return toastError(error);
    }
  }, []);

  return (
    <Modal
      className={cx(styles.wrapModal, classesName)}
      modalClassName={cx(styles.modalClassName, modalClassName)}
      contentClassName={cx(styles.contentClassName, contentClassName)}
      isOpen={isOpen}
      {...other}
    >
      <div className={styles.header}>
        <div>
          {renderDynamicLabel(
            dynamicLabels,
            CAR_CAP_DYNAMIC_FIELDS['Select findings'],
          )}
        </div>
        <div className={styles.closeBtn} onClick={closeAndClearData}>
          <img src={images.icons.icClose} alt="ic-close-modal" />
        </div>
      </div>
      <div className={styles.content}>
        <div className={cx(styles.filterWrapper, 'd-flex ')}>
          <Input
            renderPrefix={
              <img
                src={images.icons.menu.icSearchInActive}
                alt="buttonReset"
                className={styles.icon}
              />
            }
            wrapperInput={styles.wrapperInput}
            onKeyUp={(e) => {
              if (e.keyCode === KeyPress.ENTER) {
                handleFilterBySearch();
              }
            }}
            className={styles.inputSearch}
            onChange={(e) => setSearch(String(e.target.value))}
            value={search}
            label={renderDynamicLabel(
              dynamicLabels,
              COMMON_DYNAMIC_FIELDS.Search,
            )}
            maxLength={128}
            styleLabel={styles.labelFilter}
            placeholder={renderDynamicLabel(
              dynamicLabels,
              COMMON_DYNAMIC_FIELDS.Search,
            )}
          />
          <div>
            <Button
              className={styles.buttonFilter}
              onClick={handleFilterBySearch}
              buttonType={ButtonType.Outline}
            >
              {renderDynamicLabel(dynamicLabels, COMMON_DYNAMIC_FIELDS.Search)}
            </Button>
            <Button
              buttonType={ButtonType.OutlineDangerous}
              buttonSize={ButtonSize.Medium}
              className={styles.buttonFilter}
              disabled={!search}
              disabledCss={!search}
              onClick={() => {
                setSearch('');
                setListFindingItems(initialFindings);
              }}
            >
              {renderDynamicLabel(
                dynamicLabels,
                COMMON_DYNAMIC_FIELDS['Clear all'],
              )}
            </Button>
          </div>
        </div>

        {listFindingItems?.length ? (
          <Table
            columns={columns}
            className={cx(styles.tableWrapper)}
            dataSource={dataSource}
            pagination={false}
            scroll={{ x: 'max-content' }}
            rowClassName={styles.rowWrapper}
          />
        ) : (
          <NoDataImg />
        )}
        <div className="d-flex justify-content-end align-items-center">
          <Button
            className={styles.btnCancel}
            buttonType={ButtonType.CancelOutline}
            onClick={closeAndClearData}
          >
            {renderDynamicLabel(dynamicLabels, COMMON_DYNAMIC_FIELDS.Cancel)}
          </Button>
          <Button
            buttonType={ButtonType.Primary}
            buttonSize={ButtonSize.Medium}
            onClick={async () => {
              const listIds = [];

              listFindingSelected?.forEach((item) => {
                if (item?.findingAttachments?.length) {
                  listIds.push(item?.findingAttachments);
                }
              });

              const listFileAttach = listIds?.length
                ? await getListFileAttach(listIds?.flat(2))
                : [];

              setStep1Values((prev) => ({
                ...prev,
                findingSelected: listFindingSelected,
                attachmentsFromFinding: listFileAttach,
              }));
              closeAndClearData();
            }}
          >
            {renderDynamicLabel(dynamicLabels, COMMON_DYNAMIC_FIELDS.Save)}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ModalSelectFindings;
