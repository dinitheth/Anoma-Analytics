import 'dotenv/config';

function req(name: string, fallback?: string) {
  const v = process.env[name] ?? fallback;
  if (v === undefined) throw new Error(`Missing env: ${name}`);
  return v;
}

export const env = {
  PORT: Number(process.env.PORT ?? 4000),
  COMET_RPC: req('COMET_RPC'),
  ANOMA_BIN: process.env.ANOMA_BIN || 'anoma',
  ANOMA_HOME: process.env.ANOMA_HOME || '',
  LOG_MODE: process.env.LOG_MODE || 'journal', // journal | file | ssh-journal
  JOURNAL_UNIT: process.env.JOURNAL_UNIT || 'anomad',
  LOG_FILE: process.env.LOG_FILE || '',
  SSH_HOST: process.env.SSH_HOST || ''
};
