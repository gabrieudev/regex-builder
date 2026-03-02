const pattern = process.env.PATTERN;
const testString = process.env.TEST_STRING;

const MAX_MATCHES = 1000;
const MAX_MATCH_LEN = 10000;

const start = Date.now();

const response = {
  engine: "javascript",
  pattern,
  success: false,
  matches: [],
  matchCount: 0,
  matchRanges: [],
  groups: [],
  namedGroups: {},
  warnings: [],
  isFullMatch: false,
  error: null,
  executionTimeMs: null,
};

if (!pattern || testString === undefined) {
  response.error =
    "Variáveis de ambiente 'PATTERN' e 'TEST_STRING' são obrigatórias";
  console.error(JSON.stringify(response));
  process.exit(1);
}

try {
  const regex = new RegExp(pattern, "g");

  let count = 0;
  const iterator = testString.matchAll(regex);

  for (const match of iterator) {
    if (count >= MAX_MATCHES) {
      response.warnings.push(`maxMatches truncated to ${MAX_MATCHES}`);
      break;
    }

    let fullMatch = match[0] || "";

    if (fullMatch.length > MAX_MATCH_LEN) {
      fullMatch = fullMatch.substring(0, MAX_MATCH_LEN);
      response.warnings.push("match truncated to MAX_MATCH_LEN");
    }

    response.matches.push(fullMatch);
    response.matchRanges.push({
      start: match.index,
      end: match.index + fullMatch.length,
    });

    const groupList = [];
    for (let i = 0; i < match.length; i++) {
      groupList.push(match[i]);
    }
    response.groups.push(groupList);

    if (match.groups) {
      for (const [key, value] of Object.entries(match.groups)) {
        if (!response.namedGroups[key]) {
          response.namedGroups[key] = [];
        }
        response.namedGroups[key].push(value);
      }
    }

    count++;
  }

  response.matchCount = response.matches.length;

  const fullRegex = new RegExp(`^${pattern}$`);
  response.isFullMatch = fullRegex.test(testString);

  response.success = true;
} catch (e) {
  response.success = false;
  response.error = e.message;
}

response.executionTimeMs = Date.now() - start;

if (response.success) {
  console.log(JSON.stringify(response));
} else {
  console.error(JSON.stringify(response));
  process.exit(1);
}
