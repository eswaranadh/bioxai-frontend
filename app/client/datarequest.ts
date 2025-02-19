import { ApiPath, HDR_APPLICATION_JSON, HDR_CONTENT_TYPE } from "../constant";
import { RAGConfig } from "../store/rag";
import { DbConnectionArgs } from "../utils/datatypes";
import { getHeaders } from "./api";

const AUTHORIZATION = "Authorization";
const APIKEY = "api-key";
export function get_auth_header(): Record<string, string> {
  const jsonHeaders = getHeaders();
  console.log("get_auth_header", jsonHeaders);
  if (jsonHeaders[AUTHORIZATION]) {
    return { [AUTHORIZATION]: jsonHeaders[AUTHORIZATION] };
  }
  return { [APIKEY]: jsonHeaders[APIKEY] };
}

export const requestKGConnectionStatus = async (
  connectionArgs: DbConnectionArgs
) => {
  const KG_UAL = ApiPath.KG;
  let fetchUrl = KG_UAL as string;
  if (!fetchUrl.endsWith('/')) {
    fetchUrl += '/';
  }
  const connectionStatusUrl = fetchUrl + 'connectionstatus';
  const res = await fetch(connectionStatusUrl, {
    method: "POST",
    headers: {
      [HDR_CONTENT_TYPE]: HDR_APPLICATION_JSON,
    },
    body: JSON.stringify({ connectionArgs })
  });

  return res;
}

export const requestAllVSDocuments = async (
  connectionArgs: DbConnectionArgs,
  docIds?: string[]
) => {
  const RAG_URL = ApiPath.RAG;
  let fetchUrl = RAG_URL as string;
  if (!fetchUrl.endsWith('/')) {
    fetchUrl += '/';
  }
  fetchUrl += 'alldocuments';
  const res = await fetch(fetchUrl, {
    method: 'POST',
    headers: {
      ...get_auth_header(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ connectionArgs, docIds }),
  });
  return res;
}

export const requestVSConnectionStatus = async (
  connectionArgs: DbConnectionArgs
) => {
  const RAG_URL = ApiPath.RAG;
  let fetchUrl = RAG_URL as string;
  if (!fetchUrl.endsWith('/')) {
    fetchUrl += '/';
  }
  const connectionStatusUrl = fetchUrl + "connectionstatus";
  const res = await fetch(connectionStatusUrl, {
    method: 'POST',
    headers: {
      ...get_auth_header(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ connectionArgs }),
  });

  return res;
}

export const requestUploadFile = async (
  file: File,
  ragConfig: RAGConfig,
  useRAG: boolean
) => {
  const RAG_URL = ApiPath.RAG;
  const path = "newdocument";
  let uploadPath = RAG_URL as string;
  if (!uploadPath.endsWith('/')) {
    uploadPath += '/';
  }
  uploadPath += path;
  const formData = new FormData();

  // Ensure file is properly set
  formData.append('file', file, file.name);

  // Convert objects to strings for FormData
  formData.append('ragConfig', JSON.stringify(ragConfig));
  formData.append('useRAG', String(useRAG));

  // Debug logging
  console.log('Uploading file:', {
    fileName: file.name,
    fileSize: file.size,
    ragConfig: JSON.stringify(ragConfig),
    useRAG: String(useRAG)
  });

  const res = await fetch(uploadPath, {
    method: "POST",
    body: formData,
    headers: {
      ...get_auth_header(),
      // Note: Don't set Content-Type header, let the browser set it with boundary
    }
  });

  return res;
}

export const requestRemoveDocument = async (
  connectionArgs: DbConnectionArgs,
  docId: string,
  docIds: string[],
) => {
  const RAG_URL = ApiPath.RAG;
  const path = "document";
  let delPath = RAG_URL as string;
  if (!delPath.endsWith('/')) {
    delPath += '/';
  }
  delPath += path;
  const res = await fetch(delPath, {
    method: "DELETE",
    body: JSON.stringify({ docId, connectionArgs, docIds }),
    headers: {
      ...get_auth_header()
    }
  });
  return res;
}

export const requestTokenUsage = async (
  session_id?: string,
  model?: string
) => {
  const TokenUsage_URL = ApiPath.TokenUsage;
  let url = TokenUsage_URL as string;
  if (!url.endsWith('/')) {
    url += '/';
  }
  const res = await fetch(url, {
    method: "POST",
    body: JSON.stringify({
      "session_id": session_id ?? "",
      "model": model ?? "gpt-3.5-turbo",
    }),
    headers: {
      ...get_auth_header()
    }
  });
  return res;
}