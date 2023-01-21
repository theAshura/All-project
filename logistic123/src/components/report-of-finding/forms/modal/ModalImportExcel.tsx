import { FC, useEffect, useMemo, useRef, useState } from 'react';
import { useSelector } from 'react-redux';

import XLSX from 'xlsx';
import {
  Col,
  Row,
  Dropdown,
  DropdownItem,
  DropdownToggle,
  DropdownMenu,
} from 'reactstrap';
import * as yup from 'yup';
import { toastError } from 'helpers/notification.helper';
import cloneDeep from 'lodash/cloneDeep';
import images from 'assets/images/images';
import { FieldValues, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Table from 'antd/lib/table';
import { ReportOfFindingItems } from 'models/api/report-of-finding/report-of-finding.model';

import ModalComponent from 'components/ui/modal/Modal';
import Input from 'components/ui/input/Input';
import Button, { ButtonSize, ButtonType } from 'components/ui/button/Button';
import SelectUI from 'components/ui/select/Select';
import ToggleSwitch from 'components/ui/toggle-switch/ToggleSwitch';
import { renderDynamicLabel } from 'helpers/dynamic.helper';
import { DETAIL_REPORT_OF_FINDING_DYNAMIC_FIELDS } from 'constants/dynamic/report-of-finding.const';
import { IDynamicLabel } from 'models/api/dynamic/dynamic.model';
import { COMMON_DYNAMIC_FIELDS } from 'constants/dynamic/common.const';
import cx from 'classnames';
import {
  dataSourceParse,
  reloadSheetByKeys,
  listColByKeys,
  listKeysTemplate,
  listKeysRequired,
  handleSort,
} from './import-excel.cost';
import styles from '../form.module.scss';

import NoDataImg from '../../../common/no-data/NoData';

interface ModalImportExcelProps {
  isVisibleModal?: boolean;
  title?: string;
  handleAdd?: (data: ReportOfFindingItems[]) => void;
  setIsVisibleModalImportExcel?: (value: boolean) => void;
  dynamicLabels?: IDynamicLabel;
}

export const ModalImportExcel: FC<ModalImportExcelProps> = ({
  isVisibleModal,
  title,
  setIsVisibleModalImportExcel,
  handleAdd,
  dynamicLabels,
}) => {
  const { listAuditTypes } = useSelector((state) => state.auditType);
  const [files, setFiles] = useState(undefined);
  const uploadFile = useRef(null);
  const [result, setResult] = useState(null);

  const [listKeysData, setListKeyData] = useState(dataSourceParse);

  const [sheetList, setSheetList] = useState(undefined);
  const [dataSheet, setDataSheet] = useState<any[]>(undefined);
  const [sheetName, setSheetName] = useState(undefined);

  const [cols, setCols] = useState(null);

  const [headerTable, setHeaderTable] = useState<any[]>(undefined);
  const [firstRowAsHeader, setFirstRowAsHeader] = useState(true);

  const [rowFrom, setRowFrom] = useState<number>(0);
  const [rowTo, setRowTo] = useState<number>(0);

  const [rowIndex, setRowIndex] = useState<number>(0);
  const [columnIndex, setColumnIndex] = useState<number>(0);

  const [listExcelIndexVisible, setListExcelIndexVisible] =
    useState<number>(null);

  const { listDepartmentMaster } = useSelector(
    (state) => state.departmentMaster,
  );
  const { listMainCategories } = useSelector((state) => state.mainCategory);
  const { listSecondCategories } = useSelector((state) => state.secondCategory);
  const { listVIQs } = useSelector((state) => state.viq);
  const { listNatureOfFindings } = useSelector(
    (state) => state.inspectionMapping,
  );
  const [msgRequired, setMsgRequired] = useState<string>('');
  const optionListDepartment = useMemo(
    () =>
      listDepartmentMaster?.data?.map((item) => ({
        value: item.id,
        label: item.name,
      })),
    [listDepartmentMaster],
  );
  const optionListMainCategory = useMemo(
    () =>
      listMainCategories?.data?.map((item) => ({
        value: item.id,
        label: item.name,
      })),
    [listMainCategories],
  );
  const optionListSecondCategory = useMemo(
    () =>
      listSecondCategories?.data?.map((item) => ({
        value: item.id,
        label: item.name,
      })),
    [listSecondCategories],
  );
  const optionListVIQ = useMemo(
    () =>
      listVIQs?.data?.map((item) => ({
        value: item.id,
        label: item.refNo,
      })),
    [listVIQs],
  );

  const defaultValues = {
    code: '',
    name: '',
    description: '',
    status: 'active',
    sheetList: undefined,
  };
  const schema = yup.object().shape({
    code: yup
      .string()
      .trim()
      .nullable()
      .required(
        renderDynamicLabel(
          dynamicLabels,
          COMMON_DYNAMIC_FIELDS['This field is required'],
        ),
      ),
    name: yup
      .string()
      .trim()
      .nullable()
      .required(
        renderDynamicLabel(
          dynamicLabels,
          COMMON_DYNAMIC_FIELDS['This field is required'],
        ),
      ),
    shoreDepartmentIds: yup
      .array()
      .nullable()
      .required(
        renderDynamicLabel(
          dynamicLabels,
          COMMON_DYNAMIC_FIELDS['This field is required'],
        ),
      ),
  });

  const isEmptyRecord = (record: Object) => {
    const listRecordsHasValue = [];
    // eslint-disable-next-line no-restricted-syntax
    for (const pro in record) {
      if (record[pro]) {
        listRecordsHasValue.push(record[pro]);
      }
    }
    return listRecordsHasValue?.length < 2;
  };

  const handleSliceSheetFile = (data) => {
    let result = cloneDeep(data);
    const dataLength = data?.length;
    if (Number(rowIndex) >= dataLength || Number(columnIndex) >= 10) {
      // 10 is total columns
      return [];
    }
    if (Number(rowIndex) > 0) {
      result = data.slice(rowIndex, dataLength);
    }
    if (Number(columnIndex) > 0) {
      result = data.map((item, index) => {
        const sliced = Object.fromEntries(
          Object.entries(item).slice(columnIndex + 1, dataLength),
        );
        return sliced;
      });
    }
    return result;
  };

  const make_cols = (refstr) => {
    const o = [];
    const C = XLSX.utils.decode_range(refstr).e.c + 1;

    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < C; ++i) {
      o[i] = {
        title: XLSX.utils.encode_col(i),
        dataIndex: XLSX.utils.encode_col(i),
        key: XLSX.utils.encode_col(i),
      };
    }
    return o;
  };

  const handleLoadSheet = (listKeysChange?: any) => {
    if (sheetName) {
      const wb = XLSX.read(result, { type: 'array' });
      const ws = wb.Sheets[sheetName];
      /* Convert array of arrays */
      const data = XLSX.utils.sheet_to_json(ws, { header: 1 });
      const dataFilled = data.filter((i: any) => i?.length > 0);
      const dataResult: any = reloadSheetByKeys(
        dataFilled,
        listKeysChange || listKeysData,
      );

      const dataResultFiltered = cloneDeep(dataResult)?.filter(
        (item) => !isEmptyRecord(item),
      );
      if (firstRowAsHeader) {
        setHeaderTable([dataResultFiltered[0]]);
      } else {
        setHeaderTable(undefined);
      }
      const dataWithoutHeader = dataResultFiltered?.filter(
        (item) => item?.key !== 0,
      );
      const dataPopulated = handleSliceSheetFile(dataWithoutHeader);
      setDataSheet(dataPopulated);

      setCols(listColByKeys(make_cols(ws['!ref']), listKeysData));
      setRowFrom(0);
      setRowTo(0);
    }
  };

  const removeExcelIndex = (key: string) => {
    const listDataRemoved = listKeysData.filter(
      (item) => item.excelIndex !== String(key),
    );
    setListKeyData(listDataRemoved);
    handleLoadSheet(listDataRemoved);
  };

  const handleChangeKey = async (current, changeTo) => {
    const listChanged = listKeysData.map((item) => {
      if (item.excelIndex === current.excelIndex) {
        return { ...item, excelIndex: changeTo.excelIndex };
      }
      if (item.excelIndex === changeTo.excelIndex) {
        return { ...item, excelIndex: current.excelIndex };
      }
      return item;
    });

    setListKeyData(listChanged);
    handleLoadSheet(listChanged);
  };

  const columnParse = [
    {
      title: renderDynamicLabel(
        dynamicLabels,
        DETAIL_REPORT_OF_FINDING_DYNAMIC_FIELDS['Column name'],
      ),
      dataIndex: 'columnName',
      key: 'columnName',
    },
    {
      title: renderDynamicLabel(
        dynamicLabels,
        DETAIL_REPORT_OF_FINDING_DYNAMIC_FIELDS['Excel index'],
      ),
      dataIndex: 'excelIndex',
      key: 'excelIndex',
      render: (data, record) => {
        const listRecodeChecked = listKeysData.filter(
          (item) => item.excelIndex !== record.excelIndex,
        );
        return (
          <div
            className={cx(
              styles.wrapExcelIndexAction,
              'd-flex align-items-center',
            )}
          >
            <div className={styles.datInfo}>{data}</div>
            <Dropdown
              isOpen={listExcelIndexVisible === record.key}
              className="mr-3"
              toggle={() =>
                setListExcelIndexVisible(
                  listExcelIndexVisible !== record.key ? record.key : null,
                )
              }
            >
              <DropdownToggle className={styles.dropdownBtn} caret>
                <img src={images.icons.icArrowDown} alt="arrowDown" />
              </DropdownToggle>
              <DropdownMenu className={styles.wrapMenu}>
                {listRecodeChecked.map((item) => (
                  <DropdownItem
                    key={item.columnName}
                    onClick={() => handleChangeKey(record, item)}
                  >
                    {item.excelIndex}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            {!listKeysRequired?.some((i) => i === record.columnName) && (
              <span onClick={() => removeExcelIndex(data)}>
                <img
                  className={styles.removeBtn}
                  src={images.icons.icRemoveOrange}
                  alt="icRemoveOrange"
                />
              </span>
            )}
          </div>
        );
      },
    },
  ];

  const { control, setValue, watch } = useForm<FieldValues>({
    mode: 'all',
    defaultValues,
    resolver: yupResolver(schema),
  });

  const watchSheetList = watch('sheetList');

  const handleFile = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      /* Parse data */
      const ab = e.target.result;
      setResult(e.target.result);
      const wb = XLSX.read(ab, { type: 'array' });
      setSheetList(
        wb?.SheetNames?.map((item, index) => ({ value: item, label: item })),
      );
    };
    reader.readAsArrayBuffer(file);
  };

  // const handleClear = () => {
  //   setDataSheet(undefined);
  //   setRowFrom(0);
  //   setRowTo(0);
  // };

  const handleChange = (e) => {
    const { files } = e.target;
    const fileName = (files && files[0]?.name?.slice(-4)) || '';
    const isXLSX = fileName?.toLowerCase() === 'xlsx';
    if (isXLSX && files && files[0]) {
      setFiles(files);
      handleFile(files[0]);
    }
  };

  const populateDataUpload = () => {
    if (rowFrom > 0 || rowTo > 0) {
      return dataSheet.slice(rowFrom - 1, rowTo);
    }
    return dataSheet;
  };
  const getKeyNameByName = (name) => {
    const result = listKeysData?.find((item) => item?.columnName === name);
    return result?.excelIndex;
  };

  const checkValidation = (data) => {
    if (data?.find((item) => !item.reference)) {
      toastError('Reference number is invalid.');
      return true;
    }
    if (data?.find((item) => !item?.auditTypeId)) {
      toastError('Inspection type is invalid.');
      return true;
    }
    if (data?.find((item) => !item?.natureFindingId)) {
      toastError('Findings type is invalid.');
      return true;
    }
    if (data?.find((item) => !item?.isSignificant)) {
      toastError('Is significant is invalid.');
      return true;
    }
    if (data?.find((item) => !item?.findingComment)) {
      toastError('Findings comments is invalid.');
      return true;
    }

    return false;
  };

  const handleUpload = () => {
    if (!watchSheetList) {
      setMsgRequired('This field is required');
      return;
    }
    if (dataSheet !== undefined) {
      const dataUpload = populateDataUpload();
      if (dataUpload?.length <= 0) {
        toastError('Columns value missing');
        return;
      }
      if (rowFrom > rowTo) {
        toastError('Row from must be less than row to');
        return;
      }

      const arrExcelData: ReportOfFindingItems[] = dataUpload?.map((item) => ({
        reference: String(
          item[getKeyNameByName(listKeysTemplate.referenceNumber)] || '',
        ),
        auditTypeId:
          listAuditTypes?.data?.find(
            (i) =>
              i?.name === item[getKeyNameByName(listKeysTemplate.auditType)],
          )?.id || null,
        natureFindingId:
          listNatureOfFindings?.data?.find(
            (i) =>
              i?.name === item[getKeyNameByName(listKeysTemplate.findingsType)],
          )?.id || null,
        isSignificant: !!item[getKeyNameByName(listKeysTemplate.isSignificant)],
        departmentId:
          optionListDepartment?.find(
            (i) =>
              i?.label === item[getKeyNameByName(listKeysTemplate.department)],
          )?.value || null,
        mainCategoryId:
          optionListMainCategory?.find(
            (i) =>
              i?.label ===
              item[getKeyNameByName(listKeysTemplate.mainCategory)],
          )?.value || null,
        secondCategoryId:
          optionListSecondCategory?.find(
            (i) =>
              i?.label ===
              item[getKeyNameByName(listKeysTemplate.stSubCategory)],
          )?.value || null,
        viqId:
          optionListVIQ?.find(
            (i) =>
              i?.label === item[getKeyNameByName(listKeysTemplate.viqCategory)],
          )?.value || null,
        findingComment: String(
          item[getKeyNameByName(listKeysTemplate.findingsComments)] || '',
        ),
        findingRemark: String(
          item[getKeyNameByName(listKeysTemplate.findingRemarks)] || '',
        ),
        attachments: [],
        findingAttachments: [],
        locationId: '',
      }));

      if (checkValidation(arrExcelData)) {
        return;
      }

      handleAdd(arrExcelData);
      setIsVisibleModalImportExcel(false);
    }
  };

  const renderForm = () => (
    <>
      {/* <div className={styles.wrapContentModalScrollImportExcel}> */}
      <div className={styles.containerFormImportExcel}>
        <div className={cx(styles.titleContainer, 'pt-1')}>
          {renderDynamicLabel(
            dynamicLabels,
            DETAIL_REPORT_OF_FINDING_DYNAMIC_FIELDS['Report of findings'],
          )}
        </div>
        <div>
          <input
            type="file"
            id="file"
            accept=".xlsx"
            className={styles.inputFile}
            ref={uploadFile}
            onChange={handleChange}
          />
          {!files ? (
            <Button
              onClick={() => uploadFile.current.click()}
              buttonSize={ButtonSize.Small}
              buttonType={ButtonType.Primary}
              className={cx('mt-auto', styles.button)}
              renderSuffix={
                <img
                  src={images.icons.icAddCircle}
                  alt="createNew"
                  className={styles.icButton}
                />
              }
            >
              {renderDynamicLabel(
                dynamicLabels,
                DETAIL_REPORT_OF_FINDING_DYNAMIC_FIELDS['Select excel file'],
              )}
            </Button>
          ) : (
            <div className={styles.showFileUploaded}>
              <div>
                <img src={images.icons.icFiles} alt="files" />
                <span>{(files && files[0]?.name) || ''}</span>
              </div>
              <button
                onClick={() => {
                  uploadFile.current.value = null;
                  setSheetList(undefined);
                  setFirstRowAsHeader(true);
                  setRowIndex(0);
                  setColumnIndex(0);
                  setValue('sheetList', undefined);
                  setFiles(undefined);
                  setDataSheet(undefined);
                  setMsgRequired('');
                }}
              >
                <img src={images.icons.icDeleteFiles} alt="delete files" />
              </button>
            </div>
          )}
        </div>

        <div className={cx(styles.divider)} />
        <div className={cx(styles.titleContainer)}>
          {renderDynamicLabel(
            dynamicLabels,
            DETAIL_REPORT_OF_FINDING_DYNAMIC_FIELDS['Data field'],
          )}
        </div>
        <Row className=" mx-0 align-items-start">
          <Col className="ps-0">
            <SelectUI
              isRequired
              labelSelect={renderDynamicLabel(
                dynamicLabels,
                DETAIL_REPORT_OF_FINDING_DYNAMIC_FIELDS['Select sheet'],
              )}
              data={sheetList || []}
              placeholder={renderDynamicLabel(
                dynamicLabels,
                DETAIL_REPORT_OF_FINDING_DYNAMIC_FIELDS['Please select'],
              )}
              name="sheetList"
              onChange={(value) => setSheetName(value)}
              className={cx(styles.inputSelect, 'w-100')}
              control={control}
            />
            <div className={styles.msgRequired}>{msgRequired}</div>
          </Col>
          <Col className="ps-0 pe-0">
            <Input
              label={renderDynamicLabel(
                dynamicLabels,
                DETAIL_REPORT_OF_FINDING_DYNAMIC_FIELDS['Row index'],
              )}
              disabled={firstRowAsHeader}
              onChange={(e) => {
                if (Number(e?.target?.value) >= 0) {
                  setRowIndex(Number(e?.target?.value));
                }
              }}
              value={rowIndex}
            />
            {/* <div className="d-flex align-items-start pb-2">
              <div className="label-select ">Row index</div>
              <img src={images.icons.icRequiredAsterisk} alt="required" />
            </div>
            <InputNumber
              disabled
              className={styles.inputNumber}
              maxLength={2}
              min={0}
              max={10}
              value={rowIndex}
              onChange={(value) => setRowIndex(value)}
              onKeyPress={handleKeyPress}
            /> */}
          </Col>
          <Col className="pe-0">
            <Input
              label={renderDynamicLabel(
                dynamicLabels,
                DETAIL_REPORT_OF_FINDING_DYNAMIC_FIELDS['Column index'],
              )}
              disabled={firstRowAsHeader}
              onChange={(e) => {
                if (Number(e?.target?.value) >= 0) {
                  setColumnIndex(Number(e?.target?.value));
                }
              }}
              value={columnIndex}
            />

            {/* <div className="d-flex align-items-start pb-2">
              <div className="label-select ">Column index</div>
              <img src={images.icons.icRequiredAsterisk} alt="required" />
            </div>
            <InputNumber
              disabled
              className={styles.inputNumber}
              maxLength={2}
              min={0}
              max={10}
              value={columnIndex}
              onChange={(value) => setColumnIndex(value)}
              onKeyPress={handleKeyPress}
            /> */}
          </Col>
          <Col className="pe-0">
            <div style={{ height: '25px' }} />
            <ToggleSwitch
              label={renderDynamicLabel(
                dynamicLabels,
                DETAIL_REPORT_OF_FINDING_DYNAMIC_FIELDS['First row as header'],
              )}
              checked={firstRowAsHeader}
              onChange={() => {
                setFirstRowAsHeader(!firstRowAsHeader);
                setRowIndex(0);
                setColumnIndex(0);
              }}
              name="firstRowAsHeader"
            />
          </Col>
        </Row>
        <div
          className={cx(
            'd-flex justify-content-end',
            styles.mb_10,
            styles.mt_10,
          )}
        >
          <Button
            buttonSize={ButtonSize.Medium}
            buttonType={ButtonType.Primary}
            onClick={() => {
              if (!watchSheetList) {
                setMsgRequired(
                  renderDynamicLabel(
                    dynamicLabels,
                    COMMON_DYNAMIC_FIELDS['This field is required'],
                  ),
                );
              } else {
                handleLoadSheet();
              }
            }}
            className={cx('mt-auto ', styles.buttonLoadSheet)}
            // disabled={!sheetName || !files || !sheetList}
          >
            {renderDynamicLabel(
              dynamicLabels,
              DETAIL_REPORT_OF_FINDING_DYNAMIC_FIELDS['Load sheet'],
            )}
          </Button>
          <Button
            buttonType={ButtonType.CancelOutline}
            buttonSize={ButtonSize.Medium}
            className={styles.buttonReset}
            onClick={() => {
              uploadFile.current.value = null;
              setFiles(undefined);
              setSheetList(undefined);
              setResult(undefined);
              setFirstRowAsHeader(true);
              setRowIndex(0);
              setColumnIndex(0);
              setValue('sheetList', undefined);
              setMsgRequired('');
            }}
          >
            {renderDynamicLabel(
              dynamicLabels,
              DETAIL_REPORT_OF_FINDING_DYNAMIC_FIELDS.Reset,
            )}
          </Button>
        </div>

        <Row className="">
          <Col sm={3}>
            <Table
              columns={columnParse || []}
              className={cx(styles.tableWrapper)}
              scroll={!dataSheet ? { y: 170 } : {}}
              dataSource={(dataSheet && listKeysData.sort(handleSort)) || []}
              rowClassName={styles.rowWrapper}
              pagination={false}
            />
          </Col>
          <Col sm={9}>
            {!dataSheet ? (
              <NoDataImg />
            ) : (
              <Table
                columns={cols || []}
                className={cx(styles.tableWrapper)}
                dataSource={
                  dataSheet && headerTable
                    ? headerTable?.concat(dataSheet)
                    : dataSheet || []
                }
                scroll={{ x: 1400, y: 365 }}
                rowClassName={styles.rowWrapper}
                size="large"
                pagination={false}
              />
            )}
          </Col>
        </Row>
        <div className={cx(styles.dividerFooter)} />
      </div>
    </>
  );
  const renderFooter = () => (
    <div className="d-flex justify-content-between align-items-end pt-4">
      <div className="d-flex">
        <Input
          label={renderDynamicLabel(
            dynamicLabels,
            DETAIL_REPORT_OF_FINDING_DYNAMIC_FIELDS['Row no from'],
          )}
          onChange={(e) => {
            if (Number(e?.target?.value) >= 0) {
              setRowFrom(Number(e?.target?.value));
            }
          }}
          value={rowFrom}
        />

        <div style={{ width: '10px' }} />
        <Input
          label={renderDynamicLabel(
            dynamicLabels,
            DETAIL_REPORT_OF_FINDING_DYNAMIC_FIELDS['Row no to'],
          )}
          onChange={(e) => {
            if (Number(e?.target?.value) >= 0) {
              setRowTo(Number(e?.target?.value));
            }
          }}
          value={rowTo}
        />
      </div>
      <div className="mt-4 d-flex justify-content-end">
        <Button
          buttonType={ButtonType.CancelOutline}
          className={cx('ms-0', styles.buttonExcludeUpload)}
          onClick={() => setIsVisibleModalImportExcel(false)}
          // onClick={handleClear}
        >
          {renderDynamicLabel(dynamicLabels, COMMON_DYNAMIC_FIELDS.Cancel)}
        </Button>
        {/* <Button
          buttonType={ButtonType.Outline}
          className={cx('ms-0', styles.buttonExcludeUpload)}
        >
          {t('txExcludeUpload')}
        </Button> */}
        <Button
          buttonType={ButtonType.Primary}
          onClick={handleUpload}
          className={cx('ms-0', styles.buttonSave)}
          // disabled={!dataSheet}
        >
          {renderDynamicLabel(dynamicLabels, COMMON_DYNAMIC_FIELDS.Upload)}
        </Button>
      </div>
    </div>
  );

  useEffect(() => {
    if (!isVisibleModal) {
      setDataSheet(undefined);
      setSheetList(undefined);
      setSheetName(undefined);
      setFirstRowAsHeader(true);
      setHeaderTable(null);
      setFiles(undefined);
      setRowFrom(0);
      setRowTo(0);
      setRowIndex(0);
      setColumnIndex(0);
      setMsgRequired('');
      setListKeyData(dataSourceParse);
    }
  }, [isVisibleModal]);

  useEffect(() => {
    if (sheetName) {
      setValue('sheetList', sheetName);
    } else {
      setValue('sheetList', undefined);
      setListKeyData(dataSourceParse);
    }
  }, [setValue, sheetName]);

  useEffect(() => {
    if (watchSheetList?.length) {
      setMsgRequired('');
    }
  }, [watchSheetList]);

  return (
    <ModalComponent
      w="90%"
      h="90%"
      isOpen={isVisibleModal}
      className={styles.modalImport}
      toggle={() => {
        setSheetList(undefined);
        setSheetName(undefined);
        setIsVisibleModalImportExcel(false);
      }}
      title={title}
      content={renderForm()}
      footer={renderFooter()}
    />
  );
};
