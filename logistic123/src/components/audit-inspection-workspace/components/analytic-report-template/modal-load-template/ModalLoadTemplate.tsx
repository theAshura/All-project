import cx from 'classnames';
import { FC, useState, useEffect, useCallback, useRef } from 'react';
import jsPDF from 'jspdf';
// import { useSelector } from 'react-redux';
import { getAnalyticalReportFindingApi } from 'api/audit-inspection-workspace.api';
import { useParams } from 'react-router-dom';
import images from 'assets/images/images';
import html2canvas from 'html2canvas';
import { toastError } from 'helpers/notification.helper';
import { LoadingOutlined } from '@ant-design/icons';
import { renderDynamicLabel } from 'helpers/dynamic.helper';
import { DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS } from 'constants/dynamic/inspection-workspace.const';
import { IDynamicLabel } from 'models/api/dynamic/dynamic.model';
import DetectEsc from 'components/common/modal/DetectEsc';
// import ReactToPrint from 'react-to-print';
import { Modal, ModalProps } from 'reactstrap';
import Button, { ButtonType } from 'components/ui/button/Button';
import styles from './modal-load-template.module.scss';
import CategorySection from '../CategorySection';
import TotalNumberOfFindings from '../TotalNumberOfFindingsSection';
import RofSection from '../template-section/RofSection';
// import OtherRofSection from '../template-section/OtherRofSection';
import DetailAnalyticReport from '../template-section/DetailAnalytic';

interface ModalComponentProps extends ModalProps {
  isOpen: boolean;
  onClose: () => void;
  modalClassName?: string;
  contentClassName?: string;
  classesName?: string;
  dynamicLabels?: IDynamicLabel;
}

const footerTemplate = `“The content of this document may not be used for purposes other than that for which it has been supplied and may not be reproduced, either wholly or in part, in any way whatsoever, nor may it be used by, or its content divulged to, any other person or third party without prior written consent. This report is issued without any prejudice to any or all parties concerned on the condition that all parties concerned, waive rights to hold the auditing company or author liable in respect of any consequences arising from the use of the information contained (or not mentioned) in this report.”`;

const ModalLoadTemplate: FC<ModalComponentProps> = ({
  isOpen,
  onClose,
  modalClassName,
  contentClassName,
  classesName,
  dynamicLabels,
  ...other
}) => {
  // const { detailMainSubcategoryWise } = useSelector(
  //   (state) => state.auditInspectionWorkspace,
  // );

  const { id } = useParams<{ id: string }>();
  const ref = useRef<any>(null);
  const [findingData, setFindingData] = useState(null);
  const [loadingExport, setLoadingExport] = useState(false);

  useEffect(() => {
    getAnalyticalReportFindingApi(id)
      .then((res) => {
        setFindingData(res?.data);
      })
      .catch((err) => toastError(err));
  }, [id]);

  const handleDataPdf = useCallback(
    (id, pdf, width, height, pageNumber) =>
      html2canvas(document.querySelector(id)).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');

        const widthRatio = width / canvas.width;
        const heightRatio = height / canvas.height;

        const ratio = widthRatio > heightRatio ? heightRatio : widthRatio;
        const widthPdf = canvas.width * ratio;
        const heightPdf = canvas.height * ratio;
        pdf.setFontSize(6.1);
        pdf.text(
          `${renderDynamicLabel(
            dynamicLabels,
            DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS.Analytical[
              footerTemplate
            ],
          )}`,
          widthRatio + 5,
          height - 10,
          {
            maxWidth: widthPdf - 15,
          },
        );
        pdf.setFontSize(8);
        pdf.text(`${pageNumber}`, width - 5, height - 5, {
          maxWidth: widthPdf - 15,
        });
        // pdf.text(1, widthRatio + 15, height - 10);
        pdf.addImage(imgData, 'PNG', 0, 0, widthPdf, heightPdf);
      }),
    [dynamicLabels],
  );
  const exportPdf = useCallback(async () => {
    try {
      setLoadingExport(true);
      // eslint-disable-next-line new-cap
      const pdf = new jsPDF('p', 'mm', 'a4');
      const width = pdf.internal.pageSize.getWidth();
      const height = pdf.internal.pageSize.getHeight();
      await handleDataPdf('#category-section', pdf, width, height, 1);
      pdf.addPage();
      await handleDataPdf(
        '#total-number-of-finding-section',
        pdf,
        width,
        height,
        2,
      );
      pdf.addPage();
      await handleDataPdf('#rof-section', pdf, width, height, 3);
      // pdf.addPage();
      // await handleDataPdf('#other-rof-section', pdf, width, height, 4);
      pdf.addPage();
      await handleDataPdf('#detail-analytic-section', pdf, width, height, 4);

      setLoadingExport(false);

      pdf.save('i-Nautix _ Analytical Report.pdf');
    } catch (error) {
      toastError('Something went wrong when export.');
      setLoadingExport(false);
    }
  }, [handleDataPdf]);
  // const reactToPrintContent = useCallback(() => ref?.current, []);

  return (
    <Modal
      className={cx(styles.wrapModal, classesName)}
      modalClassName={cx(styles.modalClassName, modalClassName)}
      contentClassName={cx(styles.contentClassName, contentClassName)}
      isOpen={isOpen}
      {...other}
    >
      <div ref={ref} className={styles.wrapContent}>
        <div className={styles.closeBtn} onClick={onClose}>
          <img src={images.icons.icBlueClose} alt="ic-close-modal" />
        </div>
        <DetectEsc close={onClose} />
        <div id="category-section">
          <CategorySection
            id={id}
            findingData={findingData}
            dynamicLabels={dynamicLabels}
          />
        </div>
        <div id="total-number-of-finding-section">
          <TotalNumberOfFindings
            id={id}
            findingData={findingData}
            dynamicLabels={dynamicLabels}
          />
        </div>
        <div id="rof-section">
          <RofSection id={id} dynamicLabels={dynamicLabels} />
        </div>
        {/* <div id="other-rof-section">
          <OtherRofSection /> // remove this section
        </div> */}
        <div id="detail-analytic-section">
          <DetailAnalyticReport id={id} dynamicLabels={dynamicLabels} />
        </div>
        <div className="d-flex justify-content-end mb-3 pr-3">
          <Button
            className={styles.btnCancel}
            buttonType={ButtonType.CancelOutline}
            onClick={onClose}
          >
            {renderDynamicLabel(
              dynamicLabels,
              DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS.Analytical.Close,
            )}
          </Button>
          <Button
            className={styles.btnCancel}
            disabled={loadingExport}
            onClick={exportPdf}
          >
            {loadingExport ? (
              <LoadingOutlined />
            ) : (
              renderDynamicLabel(
                dynamicLabels,
                DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS.Analytical.Save,
              )
            )}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ModalLoadTemplate;
