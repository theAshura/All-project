import { FC, useEffect, useState } from 'react';
import { Col, Row } from 'reactstrap';
import CustomModalInside from 'components/ui/modal/custom-modal-inside/CustomModalInside';
import DetectEsc from 'components/common/modal/DetectEsc';
import Input from 'components/ui/input/Input';
import { IDynamicLabel } from 'models/api/dynamic/dynamic.model';
import { renderDynamicLabel } from 'helpers/dynamic.helper';
import { COMMON_DYNAMIC_FIELDS } from 'constants/dynamic/common.const';
import { MAX_LENGTH_TEXT } from 'constants/common.const';
import Button, { ButtonSize, ButtonType } from 'components/ui/button/Button';
import LabelUI from 'components/ui/label/LabelUI';
import { Template } from './AGGridCore';

interface TemplateModalProps {
  isOpen: boolean;
  title?: string;
  toggle: () => void;
  handleSave?: (data: string) => void;
  templates: Template[];
  loading?: boolean;
  dynamicLabels?: IDynamicLabel;
}

const TemplateModal: FC<TemplateModalProps> = (props) => {
  const {
    toggle,
    title,
    isOpen,
    handleSave,
    templates = [],
    loading,
    dynamicLabels,
  } = props;
  const [content, setContent] = useState('');
  const [isFirstChange, setIsFirstChange] = useState(true);
  const [err, setErr] = useState('');

  useEffect(() => {
    if (isOpen) {
      setContent('');
      setIsFirstChange(true);
      setErr('');
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isFirstChange && content.length === 0) {
      setErr(
        renderDynamicLabel(
          dynamicLabels,
          COMMON_DYNAMIC_FIELDS['This field is required'],
        ),
      );
    }
    if (!isFirstChange && content.length > 0) {
      const template = templates.find(
        (item) => item.name.toUpperCase() === content.trim().toUpperCase(),
      );
      if (template) {
        setErr(
          renderDynamicLabel(
            dynamicLabels,
            COMMON_DYNAMIC_FIELDS['The template name is existed'],
          ),
        );
      } else {
        setErr('');
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content, isFirstChange]);

  const renderForm = () => (
    <>
      <div>
        <DetectEsc close={toggle} />
        <Row className="pt-2 ">
          <Col className="pt-2" md={4} xs={4}>
            <LabelUI
              label={renderDynamicLabel(
                dynamicLabels,
                COMMON_DYNAMIC_FIELDS['Template name'],
              )}
              isRequired
            />
          </Col>
          <Col className="ps-0" md={8} xs={8}>
            <Input
              placeholder={renderDynamicLabel(
                dynamicLabels,
                COMMON_DYNAMIC_FIELDS['Enter template name'],
              )}
              autoFocus
              messageRequired={!isFirstChange && err}
              isRequired
              maxLength={MAX_LENGTH_TEXT}
              readOnly={loading}
              disabledCss={loading}
              value={content}
              onChange={(event) => {
                setContent(event.target.value);
                setIsFirstChange(false);
              }}
            />
          </Col>
        </Row>
      </div>
    </>
  );

  const renderFooter = () => (
    <>
      <div className="d-flex justify-content-end mt-3">
        <Button
          buttonType={ButtonType.CancelOutline}
          buttonSize={ButtonSize.Medium}
          disabled={loading}
          onClick={() => {
            if (!loading) {
              toggle();
            }
          }}
        >
          {renderDynamicLabel(dynamicLabels, COMMON_DYNAMIC_FIELDS.Cancel)}
        </Button>
        <Button
          className="ms-2"
          buttonSize={ButtonSize.Medium}
          disabled={err.trim().length > 0 || loading}
          onClick={() => {
            setIsFirstChange(false);
            if (content.trim().length > 0) {
              handleSave(content.trim());
            } else {
              setErr(
                renderDynamicLabel(
                  dynamicLabels,
                  COMMON_DYNAMIC_FIELDS['This field is required'],
                ),
              );
            }
          }}
        >
          {renderDynamicLabel(dynamicLabels, COMMON_DYNAMIC_FIELDS.Save)}
        </Button>
      </div>
    </>
  );

  return (
    <CustomModalInside
      // w={560}
      isOpen={isOpen}
      toggle={() => {
        toggle();
      }}
      title={title}
      content={renderForm()}
      footer={renderFooter()}
    />
  );
};

export default TemplateModal;
