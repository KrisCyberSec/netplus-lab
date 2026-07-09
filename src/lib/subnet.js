/** IPv4 subnet problem generator and checker for Network+ drills. */

function ipToInt(ip) {
  return ip.split('.').reduce((acc, oct) => (acc << 8) + Number(oct), 0) >>> 0;
}

function intToIp(n) {
  return [(n >>> 24) & 255, (n >>> 16) & 255, (n >>> 8) & 255, n & 255].join('.');
}

function maskFromPrefix(prefix) {
  if (prefix === 0) return 0;
  return (0xffffffff << (32 - prefix)) >>> 0;
}

function randomPrivateBase() {
  const roll = Math.random();
  if (roll < 0.4) {
    // 10.x.x.0
    return ipToInt(`10.${rand(0, 255)}.${rand(0, 255)}.0`);
  }
  if (roll < 0.75) {
    // 172.16-31.x.0
    return ipToInt(`172.${rand(16, 31)}.${rand(0, 255)}.0`);
  }
  // 192.168.x.0
  return ipToInt(`192.168.${rand(0, 255)}.0`);
}

function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const PREFIXES = [24, 25, 26, 27, 28, 29, 30, 23, 22];

/**
 * Generate a random subnet problem.
 * @returns {{ network: string, prefix: number, mask: string, broadcast: string, firstHost: string, lastHost: string, usableHosts: number, totalHosts: number }}
 */
export function generateSubnetProblem() {
  const prefix = PREFIXES[rand(0, PREFIXES.length - 1)];
  const mask = maskFromPrefix(prefix);
  const hostBits = 32 - prefix;
  const blockSize = 2 ** hostBits;

  // Align a private-ish base to the block
  let base = randomPrivateBase() & mask;
  // Nudge into a few different blocks for variety
  const blockIndex = rand(0, Math.min(16, Math.floor(0xffffffff / blockSize) - 1));
  base = ((base & mask) + blockIndex * blockSize) >>> 0;
  base = (base & mask) >>> 0;

  const broadcast = (base + blockSize - 1) >>> 0;
  const totalHosts = blockSize;
  const usableHosts = prefix >= 31 ? (prefix === 31 ? 2 : 1) : Math.max(0, blockSize - 2);
  const firstHost = prefix >= 31 ? base : (base + 1) >>> 0;
  const lastHost = prefix >= 31 ? broadcast : (broadcast - 1) >>> 0;

  return {
    network: intToIp(base),
    prefix,
    mask: intToIp(mask),
    broadcast: intToIp(broadcast),
    firstHost: intToIp(firstHost),
    lastHost: intToIp(lastHost),
    usableHosts,
    totalHosts,
    cidr: `${intToIp(base)}/${prefix}`,
  };
}

export function normalizeIp(value) {
  if (!value || typeof value !== 'string') return '';
  const parts = value.trim().split('.').map((p) => p.trim());
  if (parts.length !== 4) return value.trim();
  if (parts.some((p) => !/^\d+$/.test(p))) return value.trim();
  const nums = parts.map(Number);
  if (nums.some((n) => n < 0 || n > 255)) return value.trim();
  return nums.join('.');
}

/**
 * @param {ReturnType<typeof generateSubnetProblem>} problem
 * @param {{ broadcast?: string, mask?: string, usableHosts?: string|number, firstHost?: string, lastHost?: string }} answers
 */
export function checkSubnetAnswers(problem, answers) {
  const results = {};
  if (answers.broadcast !== undefined) {
    results.broadcast = normalizeIp(answers.broadcast) === problem.broadcast;
  }
  if (answers.mask !== undefined) {
    results.mask = normalizeIp(answers.mask) === problem.mask;
  }
  if (answers.usableHosts !== undefined && answers.usableHosts !== '') {
    results.usableHosts = Number(answers.usableHosts) === problem.usableHosts;
  }
  if (answers.firstHost !== undefined) {
    results.firstHost = normalizeIp(answers.firstHost) === problem.firstHost;
  }
  if (answers.lastHost !== undefined) {
    results.lastHost = normalizeIp(answers.lastHost) === problem.lastHost;
  }
  const keys = Object.keys(results);
  const correct = keys.filter((k) => results[k]).length;
  return {
    results,
    correct,
    total: keys.length,
    allCorrect: keys.length > 0 && correct === keys.length,
  };
}

export { intToIp, ipToInt, maskFromPrefix };
