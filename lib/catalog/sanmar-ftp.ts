import "server-only";
import SftpClient from "ssh2-sftp-client";

const SFTP_HOST = process.env.SANMAR_SFTP_HOST ?? "ftp.sanmar.com";
const SFTP_PORT = Number(process.env.SANMAR_SFTP_PORT ?? 2200);
const SFTP_USER = process.env.SANMAR_SFTP_USER ?? "";
const SFTP_PASSWORD = process.env.SANMAR_SFTP_PASSWORD ?? "";

/**
 * Download a single file from SanMar SFTP as a UTF-8 string.
 * Per guide, the canonical path is /SanMarPDD/SanMar_EPDD.csv.
 */
export async function downloadSanMarFile(remotePath: string): Promise<string> {
  if (!SFTP_USER || !SFTP_PASSWORD) {
    throw new Error("SANMAR_SFTP_USER / SANMAR_SFTP_PASSWORD not set");
  }
  const client = new SftpClient();
  try {
    await client.connect({
      host: SFTP_HOST,
      port: SFTP_PORT,
      username: SFTP_USER,
      password: SFTP_PASSWORD,
      readyTimeout: 30_000,
    });
    const buf = (await client.get(remotePath)) as Buffer;
    return buf.toString("utf8");
  } finally {
    await client.end().catch(() => {});
  }
}

export const SANMAR_EPDD_PATH = "/SanMarPDD/SanMar_EPDD.csv";
