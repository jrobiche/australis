export interface GameConsoleConfiguration {
  id: string;
  name: string;
  ipAddress: string;
  auroraFtpPort: number;
  auroraFtpUsername: string | null;
  auroraFtpPassword: string | null;
  auroraHttpPort: number;
  auroraHttpUsername: string | null;
  auroraHttpPassword: string | null;
}
