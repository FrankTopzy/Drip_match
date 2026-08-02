
const API_KEY = import.meta.env.VITE_YOUCAM_API_KEY;

// Requirements: Modern browsers (fetch API + optional chaining supported).
//   - Chrome / Edge >= 80
//   - Firefox >= 74
//   - Safari >= 13.1
// 1. Starts an async task
// 2. Polls in a loop until the task status becomes success or error
const BASE_URL = 'https://yce-api-01.makeupar.com/s2s/v3.0/task/cloth';
const START_METHOD = 'POST';
const HEADERS = {
  "Content-Type": "application/json",
  "Authorization": `Bearer ${API_KEY}`
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function startTask() {
  const init = {
    method: START_METHOD,
    headers: HEADERS,
    body: JSON.stringify({
      "src_file_url": "https://plugins-media.makeupar.com/strapi/assets/clothes_01_10be1e1a9b.png",
      "ref_file_url": "https://plugins-media.makeupar.com/strapi/assets/clothes_reference_full_body_01_8190f45a28.png",
      "garment_category": "auto"
    }),
  };

  const res = await fetch(BASE_URL, init);
  if (!res.ok) {
    throw new Error(`Start request failed: ${res.status} ${res.statusText}`);
  }

  const payload = await res.json().catch(() => ({}));
  const taskId = payload?.data?.task_id;
  if (!taskId) {
    throw new Error('task_id not found in response: ' + JSON.stringify(payload));
  }

  console.log('[startTask] Task started, id =', taskId);
  return taskId;
}

async function pollTask(taskId, { intervalMs = 2000, maxAttempts = 300 } = {}) {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const pollUrl = BASE_URL + '/' + taskId;
    const res = await fetch(pollUrl, { method: 'GET', headers: HEADERS });

    if (!res.ok) {
      throw new Error(`Polling failed: ${res.status} ${res.statusText}`);
    }

    const payload = await res.json().catch(() => ({}));
    const status = payload?.data?.task_status;
    console.log('[pollTask] Attempt', attempt, 'status =', status);

    if (status === 'success') {
      const results = payload?.data?.results;
      console.log('[pollTask] Success results:', results);
      return payload;
    }
    if (status === 'error') {
      throw new Error('Task failed: ' + JSON.stringify(payload));
    }

    await sleep(intervalMs);
  }
  throw new Error('Max attempts exceeded while polling');
}

(async () => {
  try {
    const taskId = await startTask();
    const final = await pollTask(taskId);
    console.log('[main] Final response:', final);
  } catch (e) {
    console.error('[main] Flow error:', e);
  }
})();