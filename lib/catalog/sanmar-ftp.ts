import "server-only";
import SftpClient from "ssh2-sftp-client";

const FTP_HOST = process.env.SANMAR_FTP_HOST ?? "ftp.sanmar.com";
const FTP_PORT = Number(process.env.SANMAR_FTP_PORT ?? 2200);
const FTP_USER = process.env.SANMAR_FTP_USER ?? "";
const FTP_PASSWORD = process.env.SANMAR_FTP_PASSWORD ?? "";

/**
 * Download a single file from SanMar SFTP as a UTF-8 string.
 * Per guide, the canonical path is /SanMarPDD/SanMar_EPDD.csv.
 */
export async function downloadSanMarFile(remotePath: string): Promise<string> {
  if (!FTP_USER || !FTP_PASSWORD) {
    throw new Error("SANMAR_FTP_USER / SANMAR_FTP_PASSWORD not set");
  }
  const client = new SftpClient();
  try {
    await client.connect({
      host: FTP_HOST,
      port: FTP_PORT,
      username: FTP_USER,
      password: FTP_PASSWORD,
      readyTimeout: 30_000,
    });
    const buf = (await client.get(remotePath)) as Buffer;
    return buf.toString("utf8");
  } finally {
    await client.end().catch(() => {});
  }
}

export const SANMAR_EPDD_PATH = "/SanMarPDD/SanMar_EPDD.csv";
