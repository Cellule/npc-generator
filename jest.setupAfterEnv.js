// Change default timeout from 5s to 10s
const timeout = process.env.JEST_TIMEOUT ? +process.env.JEST_TIMEOUT : 10000;
jest.setTimeout(timeout);
