import {
  generateSubnetProblem,
  checkSubnetAnswers,
  ipToInt,
  intToIp,
  maskFromPrefix,
} from '../src/lib/subnet.js';

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

// Known /24
const mask24 = maskFromPrefix(24);
assert(intToIp(mask24) === '255.255.255.0', 'mask /24');

// /26 block
const base = ipToInt('192.168.1.64');
const p = 26;
const m = maskFromPrefix(p);
const net = (base & m) >>> 0;
assert(intToIp(net) === '192.168.1.64', 'network align');
assert(intToIp((net + 63) >>> 0) === '192.168.1.127', 'broadcast /26');

// Generator + self-check
for (let i = 0; i < 50; i++) {
  const problem = generateSubnetProblem();
  const result = checkSubnetAnswers(problem, {
    broadcast: problem.broadcast,
    mask: problem.mask,
    usableHosts: problem.usableHosts,
    firstHost: problem.firstHost,
    lastHost: problem.lastHost,
  });
  assert(result.allCorrect, `self-check failed for ${problem.cidr}`);
  assert(problem.prefix >= 22 && problem.prefix <= 30, 'prefix range');
}

// Wrong answer fails
const sample = generateSubnetProblem();
const bad = checkSubnetAnswers(sample, { broadcast: '1.2.3.4', mask: sample.mask });
assert(bad.results.broadcast === false, 'wrong broadcast detected');
assert(bad.results.mask === true, 'correct mask detected');

console.log('subnet tests passed');
