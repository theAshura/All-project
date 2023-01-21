import { FC } from 'react';
import { renderDynamicLabel } from 'helpers/dynamic.helper';
import { COMMON_DYNAMIC_FIELDS } from 'constants/dynamic/common.const';
import cx from 'classnames';
import Button, { ButtonType } from 'components/ui/button/Button';
import { IDynamicLabel } from 'models/api/dynamic/dynamic.model';
import images from 'assets/images/images';
import styles from './header-buttons.module.scss';

export enum HeaderBtnType {
  PREVIEW = 'preview',
  CHOOSE_TEMPLATE = 'choose-template',
  ACCEPT = 'accept',
  APPROVE = 'approve',
  REJECT = 'reject',
  REVIEW = 'review',
  CANCEL = 'cancel',
  EDIT = 'edit',
  DELETE = 'delete',
  EXPORT = 'export',
  BACK = 'back',
  REASSIGN = 'reassign',
  CLOSEOUT = 'closeout',
}

export interface HeaderBtn {
  name: HeaderBtnType;
  onClick: () => void | (() => void) | [];
  disabled: boolean;
  visible?: boolean;
}

interface Props {
  buttons: HeaderBtn[];
  dynamicLabels?: IDynamicLabel;
}

const HeaderButtons: FC<Props> = (props) => {
  const { buttons, dynamicLabels } = props;

  return (
    <div className={cx('d-flex', styles.btnWrapper)}>
      {buttons.map((i) => {
        switch (i.name) {
          case HeaderBtnType.PREVIEW: {
            return (
              <Button
                key={i.name}
                onClick={i.onClick}
                buttonType={ButtonType.Outline}
                renderSuffix={<img src={images.icons.icEye} alt="preview" />}
                className={cx(styles.btns, styles.btnOutline)}
                disabled={i.disabled}
              >
                {renderDynamicLabel(
                  dynamicLabels,
                  COMMON_DYNAMIC_FIELDS.Preview,
                )}
              </Button>
            );
          }
          case HeaderBtnType.BACK: {
            return (
              <Button
                key={i.name}
                onClick={i.onClick}
                buttonType={ButtonType.CancelOutline}
                className={cx(styles.btns, styles.btnOutline)}
                disabled={i.disabled}
              >
                {renderDynamicLabel(dynamicLabels, COMMON_DYNAMIC_FIELDS.Back)}
              </Button>
            );
          }
          case HeaderBtnType.EDIT: {
            return (
              <Button
                key={i.name}
                className={cx('me-1', styles.btns)}
                disabled={i.disabled}
                onClick={i.onClick}
              >
                <span className="pe-2">
                  {' '}
                  {renderDynamicLabel(
                    dynamicLabels,
                    COMMON_DYNAMIC_FIELDS.Edit,
                  )}
                </span>
                <img src={images.icons.icEdit} alt="edit" />
              </Button>
            );
          }
          case HeaderBtnType.EXPORT: {
            return (
              <Button
                className={cx('me-1', styles.btns)}
                disabled={i.disabled}
                key={i.name}
                onClick={i.onClick}
              >
                <span className="pe-2">
                  {' '}
                  {renderDynamicLabel(
                    dynamicLabels,
                    COMMON_DYNAMIC_FIELDS.Edit,
                  )}
                </span>
                <img src={images.icons.icEdit} alt="edit" />
              </Button>
            );
          }
          case HeaderBtnType.DELETE: {
            return (
              <Button
                key={i.name}
                onClick={i.onClick}
                buttonType={ButtonType.Orange}
                renderSuffix={<img src={images.icons.icRemove} alt="DELETE" />}
                className={cx(styles.btns)}
                disabled={i.disabled}
              >
                {renderDynamicLabel(
                  dynamicLabels,
                  COMMON_DYNAMIC_FIELDS.Delete,
                )}
              </Button>
            );
          }
          case HeaderBtnType.ACCEPT: {
            return (
              <Button
                key={i.name}
                onClick={i.onClick}
                renderSuffix={
                  <img src={images.icons.icTickWhite} alt="accept" />
                }
                className={styles.btns}
                disabled={i.disabled}
              >
                {renderDynamicLabel(
                  dynamicLabels,
                  COMMON_DYNAMIC_FIELDS.Accept,
                )}
              </Button>
            );
          }
          case HeaderBtnType.CHOOSE_TEMPLATE: {
            return (
              <Button key={i.name} onClick={i.onClick} disabled={i.disabled}>
                {renderDynamicLabel(
                  dynamicLabels,
                  COMMON_DYNAMIC_FIELDS['Choose template'],
                )}
              </Button>
            );
          }
          case HeaderBtnType.REVIEW: {
            return (
              <Button
                key={i.name}
                onClick={i.onClick}
                className={cx(styles.btns)}
                disabled={i.disabled}
                renderSuffix={<img src={images.icons.icAccept} alt="accept" />}
              >
                {renderDynamicLabel(
                  dynamicLabels,
                  COMMON_DYNAMIC_FIELDS.Review,
                )}
              </Button>
            );
          }

          case HeaderBtnType.REASSIGN: {
            return (
              <Button
                key={i.name}
                onClick={i.onClick}
                className={cx(styles.btns, styles.btnRed)}
                disabled={i.disabled}
                renderSuffix={<img src={images.icons.icClose} alt="icEdit" />}
              >
                {renderDynamicLabel(
                  dynamicLabels,
                  COMMON_DYNAMIC_FIELDS.Reassign,
                )}
              </Button>
            );
          }
          case HeaderBtnType.APPROVE: {
            return (
              <Button
                key={i.name}
                onClick={i.onClick}
                renderSuffix={<img src={images.icons.icAccept} alt="approve" />}
                className={cx(styles.btns, styles.green)}
                disabled={i.disabled}
              >
                {renderDynamicLabel(
                  dynamicLabels,
                  COMMON_DYNAMIC_FIELDS.Approve,
                )}
              </Button>
            );
          }
          case HeaderBtnType.CLOSEOUT: {
            return (
              <Button
                key={i.name}
                onClick={i.onClick}
                renderSuffix={<img src={images.icons.icSend} alt="closeout" />}
                className={cx(styles.btns, styles.green)}
                disabled={i.disabled}
              >
                {renderDynamicLabel(
                  dynamicLabels,
                  COMMON_DYNAMIC_FIELDS['Close out'],
                )}
              </Button>
            );
          }
          case HeaderBtnType.REJECT: {
            return (
              <Button
                key={i.name}
                onClick={i.onClick}
                buttonType={ButtonType.Dangerous}
                renderSuffix={
                  <img src={images.icons.icErrorWhite} alt="reject" />
                }
                className={cx(styles.btns, styles.btnRed)}
                disabled={i.disabled}
              >
                {renderDynamicLabel(
                  dynamicLabels,
                  COMMON_DYNAMIC_FIELDS.Reassign,
                )}
              </Button>
            );
          }
          case HeaderBtnType.CANCEL: {
            return (
              <Button
                key={i.name}
                onClick={i.onClick}
                buttonType={ButtonType.Orange}
                renderSuffix={
                  <img src={images.icons.icErrorWhite} alt="cancel" />
                }
                className={styles.btns}
                disabled={i.disabled}
              >
                {renderDynamicLabel(
                  dynamicLabels,
                  COMMON_DYNAMIC_FIELDS.Cancel,
                )}
              </Button>
            );
          }
          default:
            return undefined;
        }
      })}
    </div>
  );
};

export default HeaderButtons;
