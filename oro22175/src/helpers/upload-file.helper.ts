import { uploadFileModuleRequest } from "api/upload-file/upload-file.api";
import { FileUploads } from "api/upload-file/upload-file.interface";
import { mapErrorMessage } from "./utilities.helper";

// upload files
export async function uploadFilesModule(
  module: string, // MODULE_FILE_UPLOAD
  initialFileUploads: FileUploads[]
) {
  try {
    const listIdFile: string[] = [];
    const fileAddFile = initialFileUploads.filter(
      (item: FileUploads) => !item.isDeleted && !item._id
    );

    const fileMapId = initialFileUploads.filter(
      (item: FileUploads) => !item.isDeleted && item._id
    );
    for await (const file of fileAddFile) {
      const data = await uploadFileModuleRequest(module, file);
      listIdFile.push(data.data[0]._id || "");
    }

    for (const file of fileMapId) {
      listIdFile.push(file?._id || "");
    }
    return Promise.resolve(listIdFile);
  } catch (e) {
    mapErrorMessage(e);
    return undefined;
  }
}

// upload files
export async function uploadFilesModuleHaveTitle(
  module: string, // MODULE_FILE_UPLOAD
  initialFileUploads: FileUploads[]
) {
  try {
    const listFile: { file: string; title: string }[] = [];
    const fileAddFile = initialFileUploads.filter(
      (item: FileUploads) => !item.isDeleted && !item._id
    );

    const fileMapId = initialFileUploads.filter(
      (item: FileUploads) => !item.isDeleted && item._id
    );
    for await (const file of fileAddFile) {
      const data = await uploadFileModuleRequest(module, file);
      listFile.push({ file: data.data[0]._id || "", title: file?.title || "" });
    }

    for (const file of fileMapId) {
      listFile.push({ file: file._id || "", title: file?.title || "" });
    }
    return Promise.resolve(listFile);
  } catch (e) {
    mapErrorMessage(e);
    return undefined;
  }
}
