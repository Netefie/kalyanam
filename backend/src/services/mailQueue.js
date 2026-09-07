// A minimal in-process, serial job queue for outbound mail. Deliberately not
// Redis/BullMQ — backend/README.md commits this API to running as one small
// process with no extra infra to pay for, and a plain array + `setInterval`-free
// drain loop is the right size for that (same call this codebase already
// made for services/bookingSweeper.js).
//
// Serial (not concurrent) on purpose: a connection-per-email burst is what
// gets a Gmail account rate-limited/throttled, so jobs run one at a time
// against the pooled transporter in services/mailer.js.
const queue = [];
let processing = false;

// `job` is a zero-arg async function. Returns immediately — the caller
// (services/mailer.js#sendMail) never waits on actual SMTP delivery.
export function enqueue(job) {
  queue.push(job);
  void run();
}

async function run() {
  if (processing) return; // an existing loop will pick up what was just pushed
  processing = true;
  try {
    while (queue.length) {
      const job = queue.shift();
      try {
        await job();
      } catch (err) {
        // A job (services/mailer.js#processLogRow) already catches and
        // records its own failures — reaching here means something more
        // fundamental broke (e.g. a DB write failed). Log and keep going;
        // one bad job must never wedge the rest of the queue.
        console.error("[mail-queue] job threw unexpectedly:", err.message);
      }
    }
  } finally {
    processing = false;
  }
}

// Resolves once every currently-queued job has finished — used on shutdown
// (server.js) so mail queued right before a redeploy still goes out instead
// of being silently dropped when the process exits.
export async function drain({ timeoutMs = 8000 } = {}) {
  const deadline = Date.now() + timeoutMs;
  while ((processing || queue.length) && Date.now() < deadline) {
    await new Promise((resolve) => setTimeout(resolve, 50));
  }
}

export function queueDepth() {
  return queue.length + (processing ? 1 : 0);
}
