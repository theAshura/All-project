import { useCallback } from 'react';

import { useDispatch } from 'react-redux';
import { BREAD_CRUMB } from 'constants/components/breadcrumb.const';
import Container from 'components/common/container/ContainerPage';
import BreadCrumb from 'components/breadcrumb/BreadCrumb';
import cx from 'classnames';
import { I18nNamespace } from 'constants/i18n.const';
import { useTranslation } from 'react-i18next';

import { CreateIssueNoteParams } from 'models/api/issue-note/issue-note.model';
import { createIssueNoteActions } from 'store/issue-note/issue-note.action';
import styles from './create.module.scss';
import IssueForm from '../forms/IssueNoteForm';

export default function IssueCreate() {
  const { t } = useTranslation(I18nNamespace.ISSUE_NOTE);

  const dispatch = useDispatch();

  const handleSubmit = useCallback(
    (formData: CreateIssueNoteParams) => {
      dispatch(createIssueNoteActions.request(formData));
    },
    [dispatch],
  );

  return (
    <div className={styles.issueNoteCreate}>
      <Container>
        <div className={cx(styles.headers)}>
          <BreadCrumb current={BREAD_CRUMB.ISSUE_NOTE_CREATE} />
          <div className={cx('fw-bold', styles.title)}>
            {t('headPageTitle')}
          </div>
        </div>
        <IssueForm isEdit data={null} isCreate onSubmit={handleSubmit} />
      </Container>
    </div>
  );
}
