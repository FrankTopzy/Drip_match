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
      src_file_url: garmentUrl,
      ref_file_url: referenceUrl,
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
/*export async function uploadGarmentFromUrl(garmentUrl: string): Promise<string> {

  console.log("Loading garment:", garmentUrl);

  const response = await fetch(garmentUrl);

  if (!response.ok) {
    throw new Error("Couldn't load garment image.");
  }

  const blob = await response.blob();

  const file = new File(
    [blob],
    garmentUrl.split("/").pop() || "garment.jpg",
    {
      type: blob.type || "image/jpeg",
    }
  );

  console.log(file);

  const garmentFileId = await uploadFile(file);

  console.log("Garment File ID:", garmentFileId);

  return garmentFileId;
}*/

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
  console.log("Response: " + initPayload);
  
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

  console.log("PutRes: " + putRes);
  

  if (!putRes.ok) {
    throw new Error(`File upload PUT failed (${putRes.status})`);
  }

  return fileId;
}




/**
 * Start a try-on task using uploaded file IDs.
 */

export async function startTryOnTaskWithUploadedUser(userFileId: string, garmentUrl: string, category: GarmentCategory = 'auto'): Promise<string> {
  const body = {
      src_file_id: userFileId,
      ref_file_url: garmentUrl ,
      garment_category: category,
    }

  //console.log("TASK ENDPOINT:", TASK_ENDPOINT);
  
  //console.log("REQUEST BODY:", body);

  console.log("Garment URL:", garmentUrl);
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
  //console.log("Task creation response:", payload);
  //console.log("STATUS:", res.status);
  //console.log("PAYLOAD:", payload);  
  const taskId = payload?.data?.task_id;
  //console.log("Polling task:", taskId);
  

  if (!taskId) {
    throw new Error('task_id not found: ' + JSON.stringify(payload));
  }

  return taskId;
}



/*export async function startTryOnTaskWithFileIds(
  garmentFileId: string,
  userFileId: string,
  category: GarmentCategory = "auto"
): Promise<string> {

  const body = {
    src_file_id: garmentFileId,
    ref_file_id: userFileId,
    garment_category: category,
  };

  console.log(body);

  const res = await fetch(TASK_ENDPOINT, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw new Error(await res.text());
  }

  const payload = await res.json();

  console.log(payload);

  return payload.data.task_id;
}*/

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
    console.log(`Polling attempt ${attempt}`);
    console.log(`GET ${TASK_ENDPOINT}/${taskId}`);

    const res = await fetch(`${TASK_ENDPOINT}/${taskId}`, {
      method: "GET",
      headers: getHeaders(),
    });

    //console.log("HTTP Status:", res.status);

    const payload = await res.json();
    //console.log("Poll Response:", payload);

    if (!res.ok) {
      throw new Error(JSON.stringify(payload));
    }

    const status = payload?.data?.task_status;

    //console.log("Task Status:", status);

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

    console.log(JSON.stringify(payload, null, 2));

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
