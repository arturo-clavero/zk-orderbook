import { proofBatch } from "../validate";
import { batch } from "./BatchManager";

class BatchVerifier {
  constructor(intervalMs) {
    this.intervalMs = intervalMs;
    this.timer = null;
    this.locked = false;
    this.pendingRun = false;
  }

  async verifyBatch() {
    if (this.locked) {
      this.pendingRun = true;
      return;
    }

    this.locked = true;
    try {
      console.log("Starting batch verification...");
      await proofBatch();

      if (batch.isFull()) {
        console.log("Batch is full, resetting timer...");
        this.resetTimer();
        this.pendingRun = true;
      }
    } finally {
      this.locked = false;

      if (this.pendingRun) {
        this.pendingRun = false;
        this.verifyBatch();
      }
    }
  }
  
  start() {
    if (!this.timer) {
      this.timer = setInterval(() => this.verifyBatch(), this.intervalMs);
    }
  }

  stop() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  resetTimer() {
    this.stop();
    this.start();
  }
}

const verifier = new BatchVerifier(60000); // run every 60 seconds
verifier.start();

