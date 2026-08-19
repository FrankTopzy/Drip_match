/**
 * YouCam Apparel VTO API Service
 * 
 * Wraps the YouCam generative Apparel Virtual Try-On API.
 * Uses /api/youcam proxy (configured in vite.config.ts) to avoid CORS in dev.
 */

const API_KEY = import.meta.env.VITE_YOUCAM_API_KEY as string;

// In dev, requests go through Vite proxy; in prod, adjust to your backend proxy
const BASE_URL = 'https://yce-api-01.makeupar.com/s2s/v2.0';
const FILE_ENDPOINT = `${BASE_URL}/file`;
const TASK_ENDPOINT = `${BASE_URL}/task/cloth-v3`;

const getHeaders = (contentType = 'application/json') => ({
  'Content-Type': contentType,
  Authorization: `Bearer ${API_KEY}`,
});

// ─── Types ──────────────────────────────────────────────────────────────

export type GarmentCategory = 'auto' | 'upper_body' | 'lower_body' | 'full_body';

export type TaskStatus = 'pending' | 'processing' | 'success' | 'error';

export interface TryOnResult {
  taskId: string;
  status: TaskStatus;
  resultImageUrl?: string;
  results?: Array<{ url: string }>;
  raw?: unknown;
}

export interface FileUploadResult {
  fileId: string;
  uploadUrl: string;
}

// ─── Helpers ────────────────────────────────────────────────────────────

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

// ─── Public URL Flow ────────────────────────────────────────────────────

/**
 * Start a try-on task using publicly accessible image URLs.
 * @param garmentUrl  URL of the garment/clothing image
 * @param referenceUrl  URL of the reference person photo
 * @param category  Garment category hint (default: 'auto')
 * @returns The task ID for polling
 */
export async function startTryOnTask(garmentUrl: string, referenceUrl: string, category: GarmentCategory = 'auto',
): Promise<string> {
  const res = await fetch(TASK_ENDPOINT, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({
      src_file_url: referenceUrl, // src = person (who wears the garment)
      ref_file_url: garmentUrl,   // ref = garment (clothing item)
      garment_category: category,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Start task failed (${res.status}): ${text}`);
  }

  const payload = await res.json();
  const taskId = payload?.data?.task_id;
  if (!taskId) {
    throw new Error(
      'task_id not found in response: ' + JSON.stringify(payload),
    );
  }

  return taskId;
}


// ─── File Upload Flow ───────────────────────────────────────────────────
/**
 * Upload a local file to YouCam's file API.
 * Returns the file_id to use in task creation.
 */
export async function uploadFile(file: File): Promise<string> {
  // Step 1: Request an upload URL
  const initRes = await fetch(FILE_ENDPOINT, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({
      files: [
      {
        file_name: file.name,
        content_type: file.type || "image/jpeg",
        file_size: file.size,
      },
    ],
    }),
  });

  console.log(file);

  if (!initRes.ok) {
    const text = await initRes.text();
    throw new Error(`File init failed (${initRes.status}): ${text}`);
  }

  const initPayload = await initRes.json();
  
  const uploadedFile = initPayload?.data?.files?.[0];
  
  const fileId = uploadedFile?.file_id;

  const uploadRequest = uploadedFile?.requests?.[0];

  const uploadUrl = uploadRequest?.url;

  if (!uploadUrl || !fileId) {
    throw new Error(
      'File upload init failed: ' + JSON.stringify(initPayload),
    );
  }

  // Step 2: PUT the binary file to the upload URL
  const putRes = await fetch(uploadUrl, {
    method: uploadRequest.method, // PUT

    headers: uploadRequest.headers,
    body: file,
  });
  

  if (!putRes.ok) {
    throw new Error(`File upload PUT failed (${putRes.status})`);
  }

  return fileId;
}




/**
 * Start a try-on task where the person photo was uploaded (file ID)
 * but the garment comes from a public URL.
 * src = person, ref = garment — YouCam convention.
 */
export async function startTryOnTaskWithUploadedUser(
  userFileId: string,
  garmentUrl: string,
  category: GarmentCategory = 'auto',
): Promise<string> {
  const body = {
    src_file_id: userFileId,   // src = person (uploaded file)
    ref_file_url: garmentUrl,  // ref = garment (public URL)
    garment_category: category,
  };

  const res = await fetch(TASK_ENDPOINT, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Start task (file IDs) failed (${res.status}): ${text}`);
  }

  const payload = await res.json();
  const taskId = payload?.data?.task_id;

  if (!taskId) {
    throw new Error('task_id not found: ' + JSON.stringify(payload));
  }

  return taskId;
}


/**
 * Start a try-on task where BOTH the garment AND the person photo
 * were local files and have been uploaded to YouCam's file API.
 * src = person file ID, ref = garment file ID — YouCam convention.
 */
export async function startTryOnTaskWithBothFileIds(
  garmentFileId: string,
  userFileId: string,
  category: GarmentCategory = 'auto',
): Promise<string> {
  const body = {
    src_file_id: userFileId,    // src = person (uploaded file)
    ref_file_id: garmentFileId, // ref = garment (uploaded file)
    garment_category: category,
  };

  const res = await fetch(TASK_ENDPOINT, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Start task (both file IDs) failed (${res.status}): ${text}`);
  }

  const payload = await res.json();
  const taskId = payload?.data?.task_id;

  if (!taskId) {
    throw new Error('task_id not found: ' + JSON.stringify(payload));
  }

  return taskId;
}




// ─── Polling ────────────────────────────────────────────────────────────
/**
 * Poll for the try-on task result.
 * @param taskId   The task ID returned by startTryOnTask
 * @param options  Polling configuration
 * @returns        The completed try-on result
 */


export async function pollTaskResult(taskId: string, options: { intervalMs?: number; maxAttempts?: number } = {}): Promise<TryOnResult> {
  const { intervalMs = 2500, maxAttempts = 120 } = options;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const res = await fetch(`${TASK_ENDPOINT}/${taskId}`, {
      method: "GET",
      headers: getHeaders(),
    });

    const payload = await res.json();

    if (!res.ok) {
      throw new Error(JSON.stringify(payload));
    }

    const status = payload?.data?.task_status;


    if (status === "success") {
      const results = payload?.data?.results;

      return {
        taskId,
        status,
        resultImageUrl: results.url,
        results,
        raw: payload,
      };
    }

    if (status === "error") {
      throw new Error(JSON.stringify(payload.data));
    }

    await sleep(intervalMs);
  }

  throw new Error(`Polling timed out after ${maxAttempts} attempts`);
}

// ─── Convenience ────────────────────────────────────────────────────────

/**
 * Full try-on flow: start task → poll → return result image URL.
 */
export async function tryOnWithUrls(garmentUrl: string, referenceUrl: string, category: GarmentCategory = 'auto', onStatusUpdate?: (msg: string) => void): Promise<TryOnResult> {

  onStatusUpdate?.('Starting virtual try-on...');

  const taskId = await startTryOnTask(garmentUrl, referenceUrl, category);

  onStatusUpdate?.('Processing your look...');
  
  return pollTaskResult(taskId);
}
