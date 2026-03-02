#!/usr/bin/env python3
import os, json, re, time, sys

MAX_MATCHES = 1000
MAX_MATCH_LEN = 10000

pattern = os.environ.get('PATTERN')
test_string = os.environ.get('TEST_STRING')

out = {
    "engine": "python",
    "pattern": pattern,
    "success": False,
    "matches": [],
    "matchCount": 0,
    "matchRanges": [],
    "groups": [],
    "namedGroups": {},
    "warnings": [],
    "error": None,
    "executionTimeMs": None
}

start = time.time()
if not pattern or test_string is None:
    out['error'] = "Missing PATTERN or TEST_STRING"
    print(json.dumps(out))
    sys.exit(1)

try:
    compiled = re.compile(pattern)
    count = 0
    for m in compiled.finditer(test_string):
        if count >= MAX_MATCHES:
            out['warnings'].append(f"maxMatches truncated to {MAX_MATCHES}")
            break
        full = m.group(0) or ""
        original_len = len(full)
        if len(full) > MAX_MATCH_LEN:
            full = full[:MAX_MATCH_LEN]
            out['warnings'].append("match truncated to MAX_MATCH_LEN")
        out['matches'].append(full)
        out['matchRanges'].append({"start": m.start(), "end": m.start() + len(full)})
        # groups
        gs = []
        for i in range(0, len(m.groups())+1):
            try:
                g = m.group(i)
            except IndexError:
                g = None
            if g is not None and len(g) > MAX_MATCH_LEN:
                g = g[:MAX_MATCH_LEN]
            gs.append(g)
        out['groups'].append(gs)
        for name, val in m.groupdict().items():
            if name not in out['namedGroups']:
                out['namedGroups'][name] = []
            out['namedGroups'][name].append(val)
        count += 1

    out['matchCount'] = len(out['matches'])
    out['success'] = True
    out['isFullMatch'] = compiled.fullmatch(test_string) is not None

except re.error as e:
    out['error'] = "PatternError: " + str(e)
    out['success'] = False
except Exception as e:
    out['error'] = "RuntimeError: " + str(e)
    out['success'] = False
finally:
    out['executionTimeMs'] = int((time.time() - start) * 1000)
    print(json.dumps(out))