import { FC, useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { I18nNamespace } from 'constants/i18n.const';
import XLSX from 'xlsx';
import {
  Col,
  Row,
  Dropdown,
  DropdownItem,
  DropdownToggle,
  DropdownMenu,
} from 'reactstrap';
import { toastError, toastSuccess } from 'helpers/notification.helper';
import cloneDeep from 'lodash/cloneDeep';
import images from 'assets/images/images';
import { FieldValues, useForm } from 'react-hook-form';
import Table from 'antd/lib/table';
import { v4 } from 'uuid';
import ModalComponent, { ModalType } from 'components/ui/modal/Modal';
import Input from 'components/ui/input/Input';
import Button, { ButtonSize, ButtonType } from 'components/ui/button/Button';
import SelectUI from 'components/ui/select/Select';
import ToggleSwitch from 'components/ui/toggle-switch/ToggleSwitch';
import cx from 'classnames';
import {
  ElementMaster,
  StandardMaster,
} from 'models/api/element-master/element-master.model';
import {
  dataSourceParse,
  reloadSheetByKeys,
  listColByKeys,
  listKeysTemplate,
  handleSort,
} from './import-excel.cost';
import styles from '../form.module.scss';

interface ModalImportExcelProps {
  isVisibleModal?: boolean;
  title?: string;
  handleAdd?: (data: any) => void;
  setIsVisibleModalImportExcel?: (value: boolean) => void;
  dataTable?: ElementMaster[];
  selectedStandard: StandardMaster;
}

export const ModalImportExcel: FC<ModalImportExcelProps> = ({
  isVisibleModal,
  title,
  setIsVisibleModalImportExcel,
  handleAdd,
  dataTable,
  selectedStandard,
}) => {
  const { t } = useTranslation([
    I18nNamespace.ELEMENT_MASTER,
    I18nNamespace.COMMON,
  ]);
  const [files, setFiles] = useState(undefined);
  const uploadFile = useRef(null);
  const [result, setResult] = useState(null);
  const [listKeysData, setListKeyData] = useState(dataSourceParse);

  const [sheetList, setSheetList] = useState(undefined);
  const [dataSheet, setDataSheet] = useState<any[]>(undefined);
  const [sheetName, setSheetName] = useState(undefined);

  const [cols, setCols] = useState(null);

  const [headerTable, setHeaderTable] = useState<any[]>(undefined);
  const [excelKeyList, setExcelKeyList] = useState(undefined);
  const [firstRowAsHeader, setFirstRowAsHeader] = useState(true);

  const [rowFrom, setRowFrom] = useState<number>(0);
  const [rowTo, setRowTo] = useState<number>(0);

  const [rowIndex, setRowIndex] = useState<number>(0);
  const [columnIndex, setColumnIndex] = useState<number>(0);

  const [listExcelIndexVisible, setListExcelIndexVisible] =
    useState<number>(null);
  const [msgRequired, setMsgRequired] = useState<string>('');

  const defaultValues = {
    code: '',
    name: '',
    number: '',
    stage: undefined,
    questionNumber: undefined,
    keyPerformanceIndicator: '',
    bestPracticeGuidance: '',
    sheetList: undefined,
  };

  const { control, setValue, watch } = useForm<FieldValues>({
    mode: 'all',
    defaultValues,
  });

  const watchSheetList = watch('sheetList');

  const handleFile = useCallback((file) => {
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
  }, []);

  const make_cols = useCallback((refstr) => {
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
  }, []);

  const handleSliceSheetFile = useCallback(
    (data) => {
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
    },
    [columnIndex, rowIndex],
  );

  const isEmptyRecord = useCallback((record: Object) => {
    const listRecordsHasValue = [];
    // eslint-disable-next-line no-restricted-syntax
    for (const pro in record) {
      if (record[pro]) {
        listRecordsHasValue.push(record[pro]);
      }
    }
    return listRecordsHasValue?.length < 2;
  }, []);

  const getElementStageQExit = useCallback((data: ElementMaster[]) => {
    const exitDatas = data.filter((i, index) => {
      if (
        data
          .slice(index + 1, data.length + 1)
          .some(
            (item) =>
              item.elementStageQ.toLowerCase() ===
              i.elementStageQ.toLowerCase(),
          )
      ) {
        return true;
      }
      return false;
    });
    return exitDatas;
  }, []);

  const handleLoadSheet = useCallback(
    (listKeysChange?: any) => {
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
        setExcelKeyList(dataResultFiltered[0]);
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
    },
    [
      sheetName,
      result,
      listKeysData,
      firstRowAsHeader,
      handleSliceSheetFile,
      make_cols,
      isEmptyRecord,
    ],
  );

  const removeExcelValue = useCallback(
    (key: string) => {
      const listChanged = listKeysData.map((item) => {
        if (item.excelIndex === key) {
          return { ...item, excelValue: '' };
        }
        return item;
      });
      setListKeyData(listChanged);
    },
    [listKeysData],
  );

  const handleChangeKey = useCallback(
    (current, key) => {
      const listChanged = listKeysData.map((item) => {
        if (item.excelIndex === current.excelIndex) {
          return { ...item, excelValue: key };
        }
        return item;
      });
      setListKeyData(listChanged);
    },
    [listKeysData],
  );

  const handleChange = useCallback(
    (e) => {
      const { files } = e.target;
      const fileName = (files && files[0]?.name?.slice(-4)) || '';
      const isXLSX = fileName?.toLowerCase() === 'xlsx';
      if (isXLSX && files && files[0]) {
        setFiles(files);
        handleFile(files[0]);
      }
    },
    [handleFile],
  );

  const populateDataUpload = useCallback(() => {
    if (rowFrom > 0 || rowTo > 0) {
      return dataSheet.slice(rowFrom, rowTo);
    }
    return dataSheet;
  }, [dataSheet, rowFrom, rowTo]);

  const getKeyNameByName = useCallback(
    (name) => {
      const result = listKeysData?.find((item) => item?.columnName === name);
      return result?.excelValue;
    },
    [listKeysData],
  );

  const checkValidation = useCallback(
    (data) => {
      const dataElementStageQExit = getElementStageQExit(data);
      if (data?.find((item) => !item.code || item.code.length > 4)) {
        toastError(t('validation.code'));
        return true;
      }
      if (data?.find((item) => !item?.name)) {
        toastError(t('validation.name'));
        return true;
      }
      if (data?.find((item) => !item?.number || item.number.length > 4)) {
        toastError(t('validation.number'));
        return true;
      }
      if (
        data?.find(
          (item) =>
            !item?.stage ||
            !(
              item?.stage &&
              selectedStandard?.levels
                ?.map((item) => item.toLowerCase())
                .includes(item?.stage?.toLowerCase())
            ),
        )
      ) {
        toastError(t('validation.stage'));
        return true;
      }
      if (
        data?.find(
          (item) =>
            !item?.questionNumber ||
            item.questionNumber.toString().length > 4 ||
            Number.isNaN(item.questionNumber),
        )
      ) {
        toastError(t('validation.questionNumber'));
        return true;
      }
      if (dataElementStageQExit.length) {
        toastError(t('validation.uniqueElementStageQ'));
        return true;
      }

      return false;
    },
    [getElementStageQExit, selectedStandard?.levels, t],
  );

  const handleUpload = useCallback(() => {
    if (!watchSheetList) {
      setMsgRequired(t('errors.required'));
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

      const arrExcelData: ElementMaster[] = dataUpload?.map((item) => {
        const elementNumber = !getKeyNameByName(listKeysTemplate.number)
          ? String(item[getKeyNameByName(listKeysTemplate.code)])
          : String(item[getKeyNameByName(listKeysTemplate.number)]);

        return {
          id: v4(),
          code: String(item[getKeyNameByName(listKeysTemplate.code)] || ''),
          name: String(item[getKeyNameByName(listKeysTemplate.name)] || ''),
          number: elementNumber,
          stage: String(item[getKeyNameByName(listKeysTemplate.stage)] || ''),
          questionNumber:
            Number(item[getKeyNameByName(listKeysTemplate.questionNumber)]) ||
            null,
          elementStageQ: `${elementNumber}-${
            item[getKeyNameByName(listKeysTemplate.stage)]
          }-${item[getKeyNameByName(listKeysTemplate.questionNumber)]}`,
          keyPerformanceIndicator: String(
            item[getKeyNameByName(listKeysTemplate.keyPerformanceIndicator)] ||
              '',
          ),
          bestPracticeGuidance: String(
            item[getKeyNameByName(listKeysTemplate.bestPracticeGuidance)] || '',
          ),
          isAddItem: true,
        };
      });
      if (checkValidation([...arrExcelData, ...dataTable])) {
        return;
      }

      handleAdd(arrExcelData);
      setIsVisibleModalImportExcel(false);
      toastSuccess('You have imported successfully');
    }
  }, [
    checkValidation,
    dataSheet,
    dataTable,
    getKeyNameByName,
    handleAdd,
    populateDataUpload,
    rowFrom,
    rowTo,
    setIsVisibleModalImportExcel,
    t,
    watchSheetList,
  ]);

  const columnParse = [
    {
      title: 'Column name',
      dataIndex: 'columnName',
      key: 'columnName',
    },
    {
      title: 'Excel index',
      dataIndex: 'excelIndex',
      key: 'excelIndex',
      render: (data, record) => (
        <div
          className={cx(
            styles.wrapExcelIndexAction,
            'd-flex align-items-center',
          )}
        >
          <div className={styles.datInfo}>{record.excelValue}</div>
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
              {excelKeyList &&
                Object.entries(excelKeyList)
                  .filter(([key, value]) => value)
                  .map(([key, value]) => (
                    <DropdownItem
                      key={key}
                      onClick={() => handleChangeKey(record, key)}
                    >
                      {key}
                    </DropdownItem>
                  ))}
            </DropdownMenu>
          </Dropdown>
          <span onClick={() => removeExcelValue(data)}>
            <img
              className={styles.removeBtn}
              src={images.icons.icRemoveOrange}
              alt="icRemoveOrange"
            />
          </span>
        </div>
      ),
    },
  ];

  const renderForm = () => (
    <>
      <div className={styles.containerFormImportExcel}>
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
              {t('buttons.txSelectExcelFile')}
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
        <div className={cx(styles.titleContainer)}>{t('txDataField')}</div>
        <Row className=" mx-0 align-items-start">
          <Col className="ps-0">
            <SelectUI
              isRequired
              labelSelect={t('txSelectSheet')}
              data={sheetList || []}
              name="sheetList"
              onChange={(value) => setSheetName(value)}
              className={cx(styles.inputSelect, 'w-100')}
              control={control}
              notAllowSortData
            />
            <div className={styles.msgRequired}>{msgRequired}</div>
          </Col>
          <Col className="ps-0 pe-0">
            <Input
              label="Row index"
              disabled={firstRowAsHeader}
              onChange={(e) => {
                if (Number(e?.target?.value) >= 0) {
                  setRowIndex(Number(e?.target?.value));
                }
              }}
              value={rowIndex}
            />
          </Col>
          <Col className="pe-0">
            <Input
              label="Column index"
              disabled={firstRowAsHeader}
              onChange={(e) => {
                if (Number(e?.target?.value) >= 0) {
                  setColumnIndex(Number(e?.target?.value));
                }
              }}
              value={columnIndex}
            />
          </Col>
          <Col className="pe-0">
            <div style={{ height: '25px' }} />
            <ToggleSwitch
              label="First row as header"
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
                setMsgRequired(t('errors.required'));
              } else {
                handleLoadSheet();
              }
            }}
            className={cx('mt-auto ', styles.buttonLoadSheet)}
          >
            {t('buttons.txLoadSheet')}
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
            {t('buttons.txReset')}
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
              <div className={styles.noDataExcel}>{t('noDataExcel')}</div>
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
          label="Row no from"
          onChange={(e) => {
            if (Number(e?.target?.value) >= 0) {
              setRowFrom(Number(e?.target?.value));
            }
          }}
          value={rowFrom}
        />

        <div style={{ width: '10px' }} />
        <Input
          label="Row no to"
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
        >
          {t('buttons.txCancel')}
        </Button>
        <Button
          buttonType={ButtonType.Primary}
          onClick={handleUpload}
          className={cx('ms-0', styles.buttonSave)}
        >
          {t('buttons.txUpload')}
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
  }, [sheetName, setValue]);

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
      toggle={() => {
        setSheetList(undefined);
        setSheetName(undefined);
        setIsVisibleModalImportExcel(false);
      }}
      title={title}
      content={renderForm()}
      footer={renderFooter()}
      modalType={ModalType.X_LARGE}
    />
  );
};
