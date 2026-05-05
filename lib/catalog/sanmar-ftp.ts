import "server-only";
import SftpClient from "ssh2-sftp-client";
import { promises as fs } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { randomBytes } from "node:crypto";

const SFTP_HOST = process.env.SANMAR_SFTP_HOST ?? "ftp.sanmar.com";
const SFTP_PORT = Number(process.env.SANMAR_SFTP_PORT ?? 2200);
const SFTP_USER = process.env.SANMAR_SFTP_USER ?? "";
const SFTP_PASSWORD = process.env.SANMAR_SFTP_PASSWORD ?? "";

/**
 * Download a file from SanMar SFTP and return its contents as a UTF-8
 * string.
 *
 * Uses fastGet() to stream the file to a temp path on disk rather than
 * buffering the entire payload in Node's memory. This is faster and
 * dramatically more resilient for large files (the EPDD CSV is ~500MB).
 *
 * Sends SSH keepalive packets every 20 seconds so SanMar's server
 * doesn't drop the connection during long transfers.
 */
export async function downloadSanMarFile(remotePath: string): Promise<string> {
  if (!SFTP_USER || !SFTP_PASSWORD) {
    throw new Error("SANMAR_SFTP_USER / SANMAR_SFTP_PASSWORD not set");
  }

  const client = new SftpClient();
  const tmpFile = path.join(
    tmpdir(),
    `sanmar-${Date.now()}-${randomBytes(4).toString("hex")}.csv`
  );

  try {
    await client.connect({
      host: SFTP_HOST,
      port: SFTP_PORT,
      username: SFTP_USER,
      password: SFTP_PASSWORD,
      readyTimeout: 30_000,
      // Send a keepalive packet every 20s. With keepaliveCountMax = 60,
      // the connection stays alive for at least 20min of pure idle time
      // before either side considers it dead. SanMar's transfer should
      // never go that long anyway since the stream is constantly active.
      keepaliveInterval: 20_000,
      keepaliveCountMax: 60,
      algorithms: {
        serverHostKey: [
          "ssh-rsa",
          "ssh-dss",
          "rsa-sha2-256",
          "rsa-sha2-512",
          "ecdsa-sha2-nistp256",
          "ecdsa-sha2-nistp384",
          "ecdsa-sha2-nistp521",
        ],
      },
    });

    // Stream remote -> temp file on disk. Faster and more resilient
    // than buffering all 500MB in memory.
    await client.fastGet(remotePath, tmpFile);

    // Read the file we just downloaded as UTF-8.
    const text = await fs.readFile(tmpFile, "utf8");
    return text;
  } finally {
    await client.end().catch(() => {});
    // Clean up the temp file regardless of success or failure
    await fs.unlink(tmpFile).catch(() => {});
  }
}

export const SANMAR_EPDD_PATH = "/SanMarPDD/SanMar_EPDD.csv";
