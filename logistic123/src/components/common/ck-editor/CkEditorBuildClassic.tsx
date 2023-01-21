import cx from 'classnames';
import images from 'assets/images/images';
import { FC, ReactElement, Dispatch, SetStateAction } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import Table from '@ckeditor/ckeditor5-table/src/table';
import TableToolbar from '@ckeditor/ckeditor5-table/src/tabletoolbar';
import Alignment from '@ckeditor/ckeditor5-alignment/src/alignment';
import ClassicEditor from '@ckeditor/ckeditor5-editor-classic/src/classiceditor';
import Essentials from '@ckeditor/ckeditor5-essentials/src/essentials';
import Bold from '@ckeditor/ckeditor5-basic-styles/src/bold';
import Italic from '@ckeditor/ckeditor5-basic-styles/src/italic';
// import CKFinder from '@ckeditor/ckeditor5-ckfinder/src/ckfinder';
import Strikethrough from '@ckeditor/ckeditor5-basic-styles/src/strikethrough';
import Underline from '@ckeditor/ckeditor5-basic-styles/src/underline';
import Subscript from '@ckeditor/ckeditor5-basic-styles/src/subscript';
import Superscript from '@ckeditor/ckeditor5-basic-styles/src/superscript';
import Code from '@ckeditor/ckeditor5-basic-styles/src/code';
import CodeBlock from '@ckeditor/ckeditor5-code-block/src/codeblock';
import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph';
import WordCount from '@ckeditor/ckeditor5-word-count/src/wordcount';
import IndentBlock from '@ckeditor/ckeditor5-indent/src/indentblock';
import Indent from '@ckeditor/ckeditor5-indent/src/indent';
import CKFinderUploadAdapter from '@ckeditor/ckeditor5-adapter-ckfinder/src/uploadadapter';
// import Autoformat from '@ckeditor/ckeditor5-autoformat/src/autoformat';
import BlockQuote from '@ckeditor/ckeditor5-block-quote/src/blockquote';
// import EasyImage from '@ckeditor/ckeditor5-easy-image/src/easyimage';
// import SimpleUploadAdapter from '@ckeditor/ckeditor5-upload/src/adapters/simpleuploadadapter';
// import CloudServicesUploadAdapter from '@ckeditor/ckeditor5-easy-image/src/cloudservicesuploadadapter';
// import ImageInsert from '@ckeditor/ckeditor5-image/src/imageinsert';
import Heading from '@ckeditor/ckeditor5-heading/src/heading';
// import Base64UploadAdapter from '@ckeditor/ckeditor5-upload/src/adapters/base64uploadadapter';
import TodoList from '@ckeditor/ckeditor5-list/src/todolist';
import FontFamily from '@ckeditor/ckeditor5-font/src/font';
import Image from '@ckeditor/ckeditor5-image/src/image';
import ImageResize from '@ckeditor/ckeditor5-image/src/imageresize';
import ImageCaption from '@ckeditor/ckeditor5-image/src/imagecaption';
import ImageStyle from '@ckeditor/ckeditor5-image/src/imagestyle';
import Mention from '@ckeditor/ckeditor5-mention/src/mention';
import ImageToolbar from '@ckeditor/ckeditor5-image/src/imagetoolbar';
import { FileType, FilePrefix } from 'constants/common.const';
import ImageUpload from '@ckeditor/ckeditor5-image/src/imageupload';
import Link from '@ckeditor/ckeditor5-link/src/link';
import List from '@ckeditor/ckeditor5-list/src/list';
import { uploadFileApi } from 'api/audit-inspection-workspace.api';
import { MentionModel } from 'components/ui/input-mention/InputMention';

import './ck-editor.scss';

function customItemRenderer(item) {
  const itemElement = document.createElement('span');

  itemElement.classList.add('custom-item');
  itemElement.id = `mention-list-item-id-${item.display}`;
  itemElement.textContent = `${item.display}`;

  // const usernameElement = document.createElement('span');

  // usernameElement.classList.add('custom-item-username');
  // usernameElement.textContent = item.id;

  // itemElement.appendChild(usernameElement);

  return itemElement;
}

class MyUploadAdapter {
  loader: any;

  token: string;

  constructor(loader, token) {
    // The file loader instance to use during the upload.
    this.loader = loader;
    this.token = token;
  }

  // Starts the upload process.
  upload() {
    return this.loader.file.then(
      (file) =>
        new Promise((resolve, reject) => {
          this.handleUpload(resolve, reject, file);
        }),
    );
  }

  // Initializes XMLHttpRequest listeners.
  handleUpload = async (resolve, reject, file) => {
    try {
      const formDataImages = new FormData();
      formDataImages.append('files', file);
      formDataImages.append('fileType', FileType.ATTACHMENT);
      formDataImages.append('prefix', FilePrefix.ATTACHMENT);
      const response = await uploadFileApi(formDataImages);

      if (response?.data) {
        resolve({
          default: response?.data[0]?.link,
        });
      }
    } catch (error) {
      reject("Can't not upload this image.");
    }
  };
}

// ...

function MyCustomUploadAdapterPlugin(e: any) {
  // const { token } = useSelector((state) => state.authenticate);
  e.plugins.get('FileRepository').createUploadAdapter = (loader) =>
    new MyUploadAdapter(loader, 'token');
}

const fontFamilyConfig = {
  options: [
    'default',
    'Arial, Helvetica, sans-serif',
    'Courier New, Courier, monospace',
    'Georgia, serif',
    'Lucida Sans Unicode, Lucida Grande, sans-serif',
    'Tahoma, Geneva, sans-serif',
    'Times New Roman, Times, serif',
    'Trebuchet MS, Helvetica, sans-serif',
    'Verdana, Geneva, sans-serif',
  ],
};

const fontSizeConfig = {
  options: [8, 9, 10, 11, 12, 14, 15, 16, 18, 20, 22, 24, 26, 28, 36, 48, 72],
};

interface Props {
  data: ReactElement | string;
  disabled?: boolean;
  label?: string;
  messageRequired?: string;
  isRequired?: boolean;
  onChange: ({ event, editor, data }) => void;
  dataMentions?: MentionModel[];
  dataMentions2?: MentionModel[];
  placeholder?: string;
  setCountCharacters?: Dispatch<SetStateAction<number>>;
}

const CkEditorClassic: FC<Props> = ({
  data,
  disabled,
  onChange,
  messageRequired,
  label,
  isRequired,
  dataMentions,
  dataMentions2,
  placeholder,
  setCountCharacters,
}) => {
  const editorConfiguration = {
    plugins: [
      Heading,
      Alignment,
      Mention,
      WordCount,
      Bold,
      Italic,
      Strikethrough,
      Underline,
      Subscript,
      Superscript,
      Code,
      CodeBlock,
      Link,
      BlockQuote,
      Essentials,
      Paragraph,
      FontFamily,
      Image,
      ImageUpload,
      CKFinderUploadAdapter,
      ImageResize,
      ImageCaption,
      ImageToolbar,
      ImageStyle,
      Indent,
      IndentBlock,
      List,
      Table,
      TableToolbar,
      TodoList,
    ],
    placeholder,
    image: {
      resizeOptions: [
        {
          name: 'resizeImage:original',
          value: null,
          icon: 'original',
        },
        {
          name: 'resizeImage:50',
          value: '50',
          icon: 'medium',
        },
        {
          name: 'resizeImage:75',
          value: '75',
          icon: 'large',
        },
      ],
      toolbar: [
        // ...,
        'resizeImage:50',
        'resizeImage:75',
        'resizeImage:original',
      ],
    },
    extraPlugins: [MyCustomUploadAdapterPlugin],
    fontFamily: fontFamilyConfig,
    toolbar: [
      'heading',
      '|',
      'alignment:left',
      'alignment:right',
      'alignment:center',
      'alignment:justify',
      '|',
      'bulletedList',
      'numberedList',
      '|',
      'outdent',
      'indent',
      '|',
      'todoList',
      '|',
      'bold',
      'italic',
      'strikethrough',
      'underline',
      'link',
      '|',
      'subscript',
      'superscript',
      '|',
      'code',
      'codeBlock',
      '|',
      'fontFamily',
      'fontsize',
      'fontColor',
      'fontBackgroundColor',
      '|',
      'insertTable',

      '|',
      'uploadImage',
      'imageTextAlternative',
      'imageStyle:alignLeft',
      'imageStyle:alignCenter',
      'imageStyle:alignRight',
      'imageStyle:full',
      '|',
      'blockQuote',
      '|',
      'undo',
      'redo',
    ],
    wordCount: {
      onUpdate: (stats) => {
        if (setCountCharacters) {
          setCountCharacters(stats.characters || 0);
        }
      },
      // showParagraphs: false,
      // showWordCount: true,
      // showCharCount: true,
      // countSpacesAsChars: false,
      // countHTML: false,
      // maxWordCount: -1,
      // maxCharCount: -1,
    },
    indentBlock: {
      offset: 1,
      unit: 'rem',
    },
    alignment: {
      options: ['left', 'center', 'right'],
    },
    fontSize: fontSizeConfig,
    table: {
      contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells'],
    },

    shouldNotGroupWhenFull: true,
    mention: {
      dropdownLimit: 100,
      feeds: [
        {
          marker: '@',
          feed: dataMentions,
          itemRenderer: customItemRenderer,
        },
        {
          marker: '#',
          feed: dataMentions2,
          itemRenderer: customItemRenderer,
        },
      ],
    },
    // ckfinder: {
    //   // The URL that the images are uploaded to.
    //   uploadUrl: `${API_BASE_URL}/support/api/v1/upload`,

    //   // Enable the XMLHttpRequest.withCredentials property.
    //   withCredentials: true,

    //   // Headers sent along with the XMLHttpRequest to the upload server.
    //   headers: {
    //     'X-CSRF-TOKEN': 'CSFR-Token',
    //     Authorization: token,
    //   },
    // },
  };

  return (
    <>
      {label && (
        <div className="d-flex align-items-start mg__b-1">
          <div className={cx('label')}>{label}</div>
          {isRequired && (
            <img src={images.icons.icRequiredAsterisk} alt="required" />
          )}
        </div>
      )}
      <CKEditor
        editor={ClassicEditor}
        data={data || ''}
        config={editorConfiguration}
        onReady={(editor) => {
          // You can store the "editor" and use when it is needed.
          // eslint-disable-next-line no-console
          console.log('Editor is ready to use!', editor);
          if (disabled && editor?.ui) {
            // eslint-disable-next-line no-param-reassign
            editor.ui!.view!.editable!.element!.style.backgroundColor =
              '#e8e8ea';
            // eslint-disable-next-line no-param-reassign
            editor.ui!.view!.editable!.element!.style.cursor = 'not-allowed';
          }
        }}
        disabled={disabled}
        onChange={(event, editor) => {
          const dataChanged = editor.getData();
          onChange({ event, editor, data: dataChanged });
        }}
        onBlur={(_event, editor) => {
          // eslint-disable-next-line no-console
          console.log('Blur.', editor);
        }}
        onFocus={(event, editor) => {
          // eslint-disable-next-line no-console
          console.log('Focus.', editor);
        }}
      />
      {messageRequired && (
        <div className="message-required mt-2">{messageRequired} </div>
      )}
    </>
  );
};

export default CkEditorClassic;
