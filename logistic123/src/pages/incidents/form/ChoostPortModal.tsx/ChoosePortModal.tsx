import {
  FC,
  ReactElement,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Modal } from 'reactstrap';
import Button, { ButtonSize } from 'components/ui/button/Button';
import cx from 'classnames';

import DetectEsc from 'components/common/modal/DetectEsc';
import { GroupButton } from 'components/ui/button/GroupButton';
import AGGridModule from 'components/common/ag-grid/AGGridModule2';
import {
  MODULE_TEMPLATE,
  DEFAULT_COL_DEF_TYPE_FLEX,
  DEFAULT_COL_DEF,
} from 'constants/components/ag-grid.const';
import Radio from 'components/ui/radio/Radio';

import styles from './modal.module.scss';

interface PortData {
  id: string;
  portCode: string;
  portName: string;
  country: string;
}

interface PSCDeficiencyData {
  id: string;
  code: string;
  name: string;
}

interface PSCActionData extends PSCDeficiencyData {}

interface Props {
  buttonClassName?: string;
  disable?: boolean;
  buttonName?: string;
  data?: PortData[] | PSCDeficiencyData[] | PSCActionData[];
  title?: string;
  template?: keyof typeof MODULE_TEMPLATE;
  value?: string;
  setValue?: any;
  name?: string;
  renderPrefix?: (() => ReactElement) | ReactElement;
  renderSuffix?: (() => ReactElement) | ReactElement;
  classPrefix?: string;
  classSuffix?: string;
  aggridHeight?: string;
}

const ChoosePortModal: FC<Props> = ({
  buttonClassName,
  disable,
  buttonName,
  title,
  data = [],
  template,
  value,
  setValue,
  name,
  renderPrefix,
  renderSuffix,
  classPrefix,
  classSuffix,
  aggridHeight,
}) => {
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [isMultiColumnFilter, setIsMultiColumnFilter] =
    useState<boolean>(false);
  const [selectedValue, setSelectedValue] = useState('');
  const shouldAGGridColumnFlex =
    name === 'pscDeficiencyId' || name === 'pscActionId' || name === 'portId';

  const handleToggleModal = useCallback(() => {
    setOpenModal(false);
  }, []);

  const handleSaveChoice = useCallback(() => {
    handleToggleModal();
    setValue(name, selectedValue);
  }, [handleToggleModal, name, selectedValue, setValue]);

  const columnDefs = useMemo(() => {
    if (name === 'pscDeficiencyId')
      return [
        {
          field: 'selected',
          headerName: '',
          checkboxSelection: false,
          filter: false,
          sortable: false,
          enableRowGroup: false,
          lockPosition: true,
          pinned: 'center',
          width: 70,
          maxWidth: 70,
          cellRendererFramework: ({ data }: { data: PSCDeficiencyData }) => (
            <div key={data?.id}>
              <Radio
                value={data?.id}
                checked={selectedValue === String(data?.id)}
                onChange={(e) => setSelectedValue(e.target.value)}
              />
            </div>
          ),
        },
        {
          field: 'code',
          headerName: 'PSC deficiency code',
          filter: isMultiColumnFilter
            ? 'agMultiColumnFilter'
            : 'agTextColumnFilter',
        },
        {
          field: 'name',
          headerName: 'PSC deficiency name',
          filter: isMultiColumnFilter
            ? 'agMultiColumnFilter'
            : 'agTextColumnFilter',
        },
      ];

    if (name === 'pscActionId')
      return [
        {
          field: 'selected',
          headerName: '',
          checkboxSelection: false,
          filter: false,
          sortable: false,
          enableRowGroup: false,
          lockPosition: true,
          pinned: 'center',
          width: 70,
          maxWidth: 70,
          cellRendererFramework: ({ data }: { data: PSCActionData }) => (
            <div key={data?.id}>
              <Radio
                value={data?.id}
                checked={selectedValue === String(data?.id)}
                onChange={(e) => setSelectedValue(e.target.value)}
              />
            </div>
          ),
        },
        {
          field: 'code',
          headerName: 'PSC action code',
          filter: isMultiColumnFilter
            ? 'agMultiColumnFilter'
            : 'agTextColumnFilter',
        },
        {
          field: 'name',
          headerName: 'PSC action name',
          filter: isMultiColumnFilter
            ? 'agMultiColumnFilter'
            : 'agTextColumnFilter',
        },
      ];

    return [
      {
        field: 'selected',
        headerName: '',
        checkboxSelection: false,
        filter: false,
        sortable: false,
        enableRowGroup: false,
        lockPosition: true,
        pinned: 'center',
        width: 70,
        maxWidth: 70,
        cellRendererFramework: ({ data }: { data: PortData }) => (
          <div key={data?.id}>
            <Radio
              value={data?.id}
              checked={selectedValue === String(data?.id)}
              onChange={(e) => setSelectedValue(e.target.value)}
            />
          </div>
        ),
      },
      {
        field: 'portCode',
        headerName: 'Port code',
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'portName',
        headerName: 'Port name',
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'country',
        headerName: 'Country name',
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
    ];
  }, [isMultiColumnFilter, name, selectedValue]);

  useEffect(() => {
    if (value) {
      setSelectedValue(value);
    }
  }, [value]);

  return (
    <div key={JSON.stringify(data)}>
      <div>
        <Button
          className={cx(buttonClassName)}
          buttonSize={ButtonSize.Medium}
          onClick={() => setOpenModal(true)}
          disabled={disable}
          disabledCss={disable}
          renderPrefix={renderPrefix}
          renderSuffix={renderSuffix}
          classPrefix={classPrefix}
          classSuffix={classSuffix}
        >
          <div>{buttonName || 'Choose Port'}</div>
        </Button>
      </div>
      <Modal
        key={buttonClassName}
        size="lg"
        modalClassName={cx(styles.wrapper, styles.modalStyle)}
        contentClassName={cx(styles.content)}
        toggle={handleToggleModal}
        isOpen={openModal && !disable}
      >
        <section className={cx(styles.container)}>
          <DetectEsc close={handleToggleModal} />
          <header className={cx(styles.header)}>
            <div className={cx(styles.title)}>{title || 'Choose Port'}</div>
            <DetectEsc close={handleToggleModal} />
          </header>
          <AGGridModule
            loading={false}
            pageSizeDefault={15}
            params={null}
            dataFilter={null}
            hasRangePicker={false}
            columnDefs={columnDefs}
            moduleTemplate={
              MODULE_TEMPLATE[template] || MODULE_TEMPLATE.choosePortIncident
            }
            dataTable={data}
            height={aggridHeight || '300px'}
            setIsMultiColumnFilter={setIsMultiColumnFilter}
            getList={() => {}}
            fileName="Port"
            colDefProp={
              shouldAGGridColumnFlex
                ? DEFAULT_COL_DEF_TYPE_FLEX
                : DEFAULT_COL_DEF
            }
          />
        </section>
        <footer className={cx(styles.footer)}>
          <GroupButton
            className={styles.GroupButton}
            handleCancel={handleToggleModal}
            handleSubmit={handleSaveChoice}
          />
        </footer>
      </Modal>
    </div>
  );
};

export default ChoosePortModal;
