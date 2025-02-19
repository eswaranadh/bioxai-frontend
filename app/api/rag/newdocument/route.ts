import { unlink, readFile, writeFile } from "fs/promises";
import * as path from "path";
import { NextRequest, NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { getServerSideConfig } from "@/app/config/server";
import { BiochatterPath, ERROR_BIOSERVER_OK, LOCAL_BASE_URL } from "@/app/constant";
import { prettyObject } from "@/app/utils/format";

const serverConfig = getServerSideConfig();

async function writeToTempFile(f: Blob, filename: string): Promise<string> {
  try {
    // save to /tmp
    const bytes = await f.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const id = nanoid();
    const extname = path.extname(filename);
    const tmpPath = `/tmp/${id}${extname}`;

    console.log('Writing file to:', tmpPath);
    await writeFile(tmpPath, buffer);
    return tmpPath;
  } catch (error) {
    console.error('Error writing temp file:', error);
    throw error;
  }
}

async function requestNewDocument(
  tmpFile: string,
  filename: string,
  ragConfig: string,
  useRAG: string,
  authValue: string
) {
  let baseUrl = serverConfig.baseUrl ?? LOCAL_BASE_URL;
  const authHeaderName = "Authorization";

  if (!baseUrl.startsWith("http")) {
    baseUrl = `http://${baseUrl}`;
  }

  if (baseUrl.endsWith("/")) {
    baseUrl = baseUrl.slice(0, -1);
  }
  const path = BiochatterPath.NewDocument;
  const fetchUrl = `${baseUrl}/${path}`;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => {
    controller.abort();
  }, 10 * 60 * 1000);

  try {
    // Create multipart form-data manually
    const boundary = `--------------------------${Date.now().toString(16)}`;
    const fileBuffer = await readFile(tmpFile);

    // Construct the multipart form-data payload
    const payload = Buffer.concat([
      // File part
      Buffer.from(`--${boundary}\r\n`),
      Buffer.from(`Content-Disposition: form-data; name="file"; filename="${filename}"\r\n`),
      Buffer.from('Content-Type: text/plain\r\n\r\n'),
      fileBuffer,
      Buffer.from('\r\n'),

      // ragConfig part
      Buffer.from(`--${boundary}\r\n`),
      Buffer.from('Content-Disposition: form-data; name="ragConfig"\r\n\r\n'),
      Buffer.from(ragConfig),
      Buffer.from('\r\n'),

      // useRAG part
      Buffer.from(`--${boundary}\r\n`),
      Buffer.from('Content-Disposition: form-data; name="useRAG"\r\n\r\n'),
      Buffer.from(useRAG),
      Buffer.from('\r\n'),

      // End boundary
      Buffer.from(`--${boundary}--\r\n`)
    ]);

    console.log('Sending to bioserver:', {
      filename,
      fileSize: fileBuffer.length,
      ragConfig,
      useRAG,
      url: fetchUrl
    });

    const response = await fetch(fetchUrl, {
      method: "POST",
      headers: {
        [authHeaderName]: authValue,
        'Content-Type': `multipart/form-data; boundary=${boundary}`,
        'Content-Length': payload.length.toString()
      },
      body: payload,
      signal: controller.signal,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Bioserver error response:', errorText);
      throw new Error(errorText);
    }

    return response;
  } catch (error) {
    console.error('Error in requestNewDocument:', error);
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}

export async function POST(request: NextRequest) {
  let tmpFile: string | undefined;

  try {
    const formData = await request.formData();
    console.log('Received form data fields:', Array.from(formData.keys()));

    // Get all required fields
    const file = formData.get('file');
    const ragConfig = formData.get('ragConfig');
    const useRAG = formData.get('useRAG');

    // Validate all required fields are present
    if (!file || !ragConfig || !useRAG) {
      console.error('Missing required fields:', {
        hasFile: !!file,
        hasRagConfig: !!ragConfig,
        hasUseRAG: !!useRAG
      });
      return NextResponse.json({
        error: "Missing required fields",
        fields: {
          file: !!file,
          ragConfig: !!ragConfig,
          useRAG: !!useRAG
        }
      }, { status: 400 });
    }

    // Validate file is a Blob/File
    if (!(file instanceof Blob)) {
      console.error('Invalid file type:', typeof file);
      return NextResponse.json({
        error: "Invalid file type",
        type: typeof file
      }, { status: 400 });
    }

    // Get the filename
    const filename = (file as any).name || 'uploaded-file.txt';

    // Write file to temp location
    tmpFile = await writeToTempFile(file, filename);

    // Forward request to bioserver
    const authValue = request.headers.get("Authorization") ?? "";
    const res = await requestNewDocument(
      tmpFile,
      filename,
      ragConfig.toString(),
      useRAG.toString(),
      authValue
    );

    const data = await res.json();
    console.log('Response from bioserver:', data);
    return NextResponse.json(data);

  } catch (e: any) {
    console.error('Error processing upload:', e);
    return NextResponse.json({
      error: e.message || "Unknown error occurred",
      stack: process.env.NODE_ENV === 'development' ? e.stack : undefined
    }, { status: 500 });
  } finally {
    // Clean up temp file
    if (tmpFile) {
      try {
        await unlink(tmpFile);
      } catch (e) {
        console.error('Error deleting temp file:', e);
      }
    }
  }
}