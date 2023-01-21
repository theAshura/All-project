import JSZipUtils from 'jszip-utils';
import JSZip from 'jszip';
import axios from 'axios';
import { saveAs } from 'file-saver';

export interface Files {
  name: string;
  link: string;
}
export const urlToPromise = (url: string) =>
  new Promise((resolve, reject) => {
    JSZipUtils.getBinaryContent(url, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });

export const getFileContents = (files: Files[]) => {
  const zip = new JSZip();

  files.forEach((file) => {
    // @ts-ignore
    zip.file(file.name, urlToPromise(file.link?.toString()), {
      binary: true,
    });
  });
  return zip;
};

export const handleDownloadFile = (data) => {
  const link = document.createElement('a');
  const arrFileBlank = ['image', 'text', 'text/plain'];
  const arrTextBlank = ['application/pdf', 'video/mp4'];
  const url = data?.link;
  link.download = data?.name || data?.originName;
  const isBlank = arrFileBlank.includes(data?.mimetype?.split('/')[0]);
  const isMimetypeBlank = arrTextBlank.includes(data?.mimetype);

  if (isBlank || isMimetypeBlank) {
    axios
      .get(url, {
        responseType: 'blob',
      })
      .then((res) => {
        saveAs(res.data, data?.name || data?.originName);
      });
  } else link.href = url;
  document.body.appendChild(link);
  link.click();
  link.parentNode.removeChild(link);
};
