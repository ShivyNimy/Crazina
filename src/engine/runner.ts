import type { ConsoleEntry, ExecutionResult, TestCaseResult, WebStarterFiles } from '../types';

const ASSERTION_HARNESS = `
function __formatValue(val) {
  if (val === undefined) return 'undefined';
  if (val === null) return 'null';
  if (typeof val === 'string') return JSON.stringify(val);
  if (typeof val === 'function') return '[Function ' + (val.name || 'anonymous') + ']';
  if (val instanceof Error) return val.name + ': ' + val.message;
  try {
    const seen = new WeakSet();
    return JSON.stringify(val, function(_k, v) {
      if (typeof v === 'object' && v !== null) {
        if (seen.has(v)) return '[Circular]';
        seen.add(v);
      }
      if (v instanceof Map) return { __type: 'Map', entries: Array.from(v.entries()) };
      if (v instanceof Set) return { __type: 'Set', values: Array.from(v.values()) };
      return v;
    });
  } catch {
    return String(val);
  }
}

function __deepEqual(a, b) {
  if (Object.is(a, b)) return true;
  if (typeof a !== typeof b || a === null || b === null) return false;
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (!__deepEqual(a[i], b[i])) return false;
    }
    return true;
  }
  if (Array.isArray(a) !== Array.isArray(b)) return false;
  if (a instanceof Date && b instanceof Date) return a.getTime() === b.getTime();
  if (a instanceof Set && b instanceof Set) {
    if (a.size !== b.size) return false;
    for (const v of a) if (!b.has(v)) return false;
    return true;
  }
  if (a instanceof Map && b instanceof Map) {
    if (a.size !== b.size) return false;
    for (const [k, v] of a) {
      if (!b.has(k) || !__deepEqual(v, b.get(k))) return false;
    }
    return true;
  }
  if (typeof a === 'object' && typeof b === 'object') {
    const keysA = Object.keys(a);
    const keysB = Object.keys(b);
    if (keysA.length !== keysB.length) return false;
    for (const k of keysA) {
      if (!Object.prototype.hasOwnProperty.call(b, k)) return false;
      if (!__deepEqual(a[k], b[k])) return false;
    }
    return true;
  }
  return false;
}

class __AssertionError extends Error {
  constructor(message, expected, actual) {
    super(message);
    this.name = 'AssertionError';
    this.expected = expected;
    this.actual = actual;
  }
}

function expect(actual) {
  return {
    toBe(expected) {
      if (!Object.is(actual, expected)) {
        throw new __AssertionError(
          'Expected ' + __formatValue(expected) + ', received ' + __formatValue(actual),
          __formatValue(expected),
          __formatValue(actual)
        );
      }
    },
    toEqual(expected) {
      if (!__deepEqual(actual, expected)) {
        throw new __AssertionError(
          'Expected deep equality with ' + __formatValue(expected) + ', received ' + __formatValue(actual),
          __formatValue(expected),
          __formatValue(actual)
        );
      }
    },
    toBeTruthy() {
      if (!actual) {
        throw new __AssertionError('Expected truthy value, received ' + __formatValue(actual), 'truthy', __formatValue(actual));
      }
    },
    toBeFalsy() {
      if (actual) {
        throw new __AssertionError('Expected falsy value, received ' + __formatValue(actual), 'falsy', __formatValue(actual));
      }
    },
    toBeDefined() {
      if (actual === undefined) {
        throw new __AssertionError('Expected value to be defined', 'defined', 'undefined');
      }
    },
    toContain(item) {
      const ok =
        (typeof actual === 'string' && actual.includes(item)) ||
        (Array.isArray(actual) && actual.some((x) => __deepEqual(x, item)));
      if (!ok) {
        throw new __AssertionError(
          'Expected ' + __formatValue(actual) + ' to contain ' + __formatValue(item),
          'contains ' + __formatValue(item),
          __formatValue(actual)
        );
      }
    },
    toBeGreaterThan(n) {
      if (!(typeof actual === 'number' && actual > n)) {
        throw new __AssertionError('Expected ' + __formatValue(actual) + ' > ' + n, '> ' + n, __formatValue(actual));
      }
    },
    toBeLessThan(n) {
      if (!(typeof actual === 'number' && actual < n)) {
        throw new __AssertionError('Expected ' + __formatValue(actual) + ' < ' + n, '< ' + n, __formatValue(actual));
      }
    },
    toBeCloseTo(expected, digits = 2) {
      const diff = Math.abs(actual - expected);
      const tol = Math.pow(10, -digits) / 2;
      if (typeof actual !== 'number' || Number.isNaN(actual) || diff >= tol) {
        throw new __AssertionError(
          'Expected ' + __formatValue(actual) + ' to be close to ' + expected,
          '~' + expected,
          __formatValue(actual)
        );
      }
    },
    toThrow(msgPart) {
      if (typeof actual !== 'function') {
        throw new __AssertionError('Expected a function to test for throwing', 'function', typeof actual);
      }
      let threw = false;
      let errMsg = '';
      try {
        actual();
      } catch (e) {
        threw = true;
        errMsg = e && e.message ? String(e.message) : String(e);
      }
      if (!threw) {
        throw new __AssertionError('Expected function to throw an error, but it did not throw', 'throws error', 'no error');
      }
      if (msgPart && !errMsg.toLowerCase().includes(String(msgPart).toLowerCase())) {
        throw new __AssertionError(
          'Expected error message to include ' + JSON.stringify(msgPart) + ', got ' + JSON.stringify(errMsg),
          String(msgPart),
          errMsg
        );
      }
    }
  };
}
`;

export function runJavaScriptTests(
  userCode: string,
  testScript: string,
  timeoutMs = 3500
): Promise<ExecutionResult> {
  return new Promise((resolve) => {
    const startedAt = performance.now();

    const workerSource = `
      const __logs = [];
      const __serializeArg = (arg) => {
        if (typeof arg === 'string') return arg;
        if (arg === undefined) return 'undefined';
        if (arg === null) return 'null';
        if (arg instanceof Error) return arg.name + ': ' + arg.message;
        try {
          return JSON.stringify(arg, null, 2);
        } catch {
          return String(arg);
        }
      };

      const __origConsole = self.console;
      self.console = {
        log: (...args) => __logs.push({ level: 'log', message: args.map(__serializeArg).join(' ') }),
        info: (...args) => __logs.push({ level: 'info', message: args.map(__serializeArg).join(' ') }),
        warn: (...args) => __logs.push({ level: 'warn', message: args.map(__serializeArg).join(' ') }),
        error: (...args) => __logs.push({ level: 'error', message: args.map(__serializeArg).join(' ') }),
      };

      ${ASSERTION_HARNESS}

      const __registeredTests = [];
      function test(name, fn) {
        __registeredTests.push({ name, fn });
      }

      self.onmessage = async (event) => {
        const { userCode, testScript } = event.data;
        const results = [];
        try {
          const combined = userCode + "\\n\\n;\\n" + (testScript || "");
          const AsyncFunction = Object.getPrototypeOf(async function(){}).constructor;
          const runner = new AsyncFunction('test', 'expect', '__logs', 'console', combined);
          await runner(test, expect, __logs, self.console);

          for (const t of __registeredTests) {
            try {
              await t.fn();
              results.push({ name: t.name, passed: true });
            } catch (err) {
              results.push({
                name: t.name,
                passed: false,
                expected: err && err.expected,
                actual: err && err.actual,
                error: err && err.message ? err.message : String(err),
              });
            }
          }

          self.postMessage({
            tests: results,
            logs: __logs,
            runtimeError: undefined,
          });
        } catch (err) {
          self.postMessage({
            tests: results,
            logs: __logs,
            runtimeError: err && err.message ? (err.name + ': ' + err.message) : String(err),
          });
        }
      };
    `;

    const blob = new Blob([workerSource], { type: 'application/javascript' });
    const url = URL.createObjectURL(blob);
    const worker = new Worker(url);

    let settled = false;
    const finish = (result: ExecutionResult) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      worker.terminate();
      URL.revokeObjectURL(url);
      resolve(result);
    };

    const timer = window.setTimeout(() => {
      finish({
        success: false,
        tests: [],
        logs: [],
        runtimeError:
          'Execution timed out after ' +
          (timeoutMs / 1000).toFixed(1) +
          's. Check for an infinite loop or an unresolved Promise!',
        durationMs: Math.round(performance.now() - startedAt),
      });
    }, timeoutMs);

    worker.onmessage = (e) => {
      const data = e.data as {
        tests: TestCaseResult[];
        logs: ConsoleEntry[];
        runtimeError?: string;
      };
      const allPassed =
        !data.runtimeError &&
        (data.tests.length === 0 || data.tests.every((t) => t.passed));
      finish({
        success: allPassed,
        tests: data.tests,
        logs: data.logs,
        runtimeError: data.runtimeError,
        durationMs: Math.round(performance.now() - startedAt),
      });
    };

    worker.onerror = (err) => {
      finish({
        success: false,
        tests: [],
        logs: [],
        runtimeError: err.message || 'Runtime error in code execution.',
        durationMs: Math.round(performance.now() - startedAt),
      });
    };

    worker.postMessage({ userCode, testScript });
  });
}

export function buildWebPreviewDocument(files: WebStarterFiles, bridgeId?: string): string {
  const safeJs = files.js.replace(/<\/script>/gi, '<\\/script>');
  const safeCss = files.css.replace(/<\/style>/gi, '<\\/style>');

  const consoleBridge = bridgeId
    ? `
    <script>
      (function() {
        const send = (level, args) => {
          try {
            const msg = Array.from(args).map((a) => {
              if (typeof a === 'string') return a;
              try { return JSON.stringify(a); } catch { return String(a); }
            }).join(' ');
            window.parent.postMessage({ type: 'crazina-preview-log', bridgeId: ${JSON.stringify(bridgeId)}, level, message: msg }, '*');
          } catch {}
        };
        ['log', 'info', 'warn', 'error'].forEach((lvl) => {
          const orig = console[lvl].bind(console);
          console[lvl] = (...args) => { send(lvl, args); orig(...args); };
        });
        window.addEventListener('error', (e) => {
          send('error', [e.message || 'Script error']);
        });
      })();
    </script>`
    : '';

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <style>
      *, *::before, *::after { box-sizing: border-box; }
      body { margin: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; color: #14151a; background: #ffffff; padding: 16px; }
    </style>
    <style>${safeCss}</style>
    ${consoleBridge}
  </head>
  <body>
    ${files.html}
    <script>
      try {
        ${safeJs}
      } catch (err) {
        console.error(err && err.message ? err.name + ': ' + err.message : String(err));
      }
    </script>
  </body>
</html>`;
}

export function runWebTests(
  files: WebStarterFiles,
  testScript: string,
  timeoutMs = 3500
): Promise<ExecutionResult> {
  return new Promise((resolve) => {
    const startedAt = performance.now();
    const runId = 'web-run-' + Math.random().toString(36).slice(2);
    const safeJs = files.js.replace(/<\/script>/gi, '<\\/script>');
    const safeCss = files.css.replace(/<\/style>/gi, '<\\/style>');
    const safeTest = testScript.replace(/<\/script>/gi, '<\\/script>');

    const iframe = document.createElement('iframe');
    iframe.setAttribute('sandbox', 'allow-scripts');
    iframe.style.position = 'fixed';
    iframe.style.left = '-9999px';
    iframe.style.top = '0';
    iframe.style.width = '1024px';
    iframe.style.height = '768px';
    iframe.style.opacity = '0';
    iframe.style.pointerEvents = 'none';

    let settled = false;
    const cleanup = () => {
      window.removeEventListener('message', onMessage);
      clearTimeout(timer);
      if (iframe.parentNode) iframe.parentNode.removeChild(iframe);
    };

    const finish = (res: ExecutionResult) => {
      if (settled) return;
      settled = true;
      cleanup();
      resolve(res);
    };

    const onMessage = (event: MessageEvent) => {
      const data = event.data;
      if (!data || data.type !== 'crazina-web-test-result' || data.runId !== runId) return;
      const tests: TestCaseResult[] = data.tests || [];
      const logs: ConsoleEntry[] = data.logs || [];
      const runtimeError: string | undefined = data.runtimeError;
      const success = !runtimeError && (tests.length === 0 || tests.every((t) => t.passed));
      finish({
        success,
        tests,
        logs,
        runtimeError,
        durationMs: Math.round(performance.now() - startedAt),
      });
    };

    window.addEventListener('message', onMessage);

    const timer = window.setTimeout(() => {
      finish({
        success: false,
        tests: [],
        logs: [],
        runtimeError: 'Web lab test execution timed out.',
        durationMs: Math.round(performance.now() - startedAt),
      });
    }, timeoutMs);

    const doc = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <style>
      *, *::before, *::after { box-sizing: border-box; }
      body { margin: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; color: #14151a; background: #ffffff; padding: 16px; }
    </style>
    <style>${safeCss}</style>
  </head>
  <body>
    ${files.html}
    <script>
      const __logs = [];
      const __serialize = (a) => {
        if (typeof a === 'string') return a;
        try { return JSON.stringify(a); } catch { return String(a); }
      };
      ['log', 'info', 'warn', 'error'].forEach((lvl) => {
        console[lvl] = (...args) => __logs.push({ level: lvl, message: args.map(__serialize).join(' ') });
      });

      let __userError = undefined;
      try {
        ${safeJs}
      } catch (err) {
        __userError = err && err.message ? (err.name + ': ' + err.message) : String(err);
      }

      ${ASSERTION_HARNESS}

      const __tests = [];
      function test(name, fn) { __tests.push({ name, fn }); }

      (async () => {
        const results = [];
        try {
          if (__userError) throw new Error(__userError);
          ${safeTest}
          for (const t of __tests) {
            try {
              await t.fn();
              results.push({ name: t.name, passed: true });
            } catch (err) {
              results.push({
                name: t.name,
                passed: false,
                expected: err && err.expected,
                actual: err && err.actual,
                error: err && err.message ? err.message : String(err),
              });
            }
          }
          window.parent.postMessage({
            type: 'crazina-web-test-result',
            runId: ${JSON.stringify(runId)},
            tests: results,
            logs: __logs,
            runtimeError: undefined,
          }, '*');
        } catch (err) {
          window.parent.postMessage({
            type: 'crazina-web-test-result',
            runId: ${JSON.stringify(runId)},
            tests: results,
            logs: __logs,
            runtimeError: err && err.message ? err.message : String(err),
          }, '*');
        }
      })();
    </script>
  </body>
</html>`;

    iframe.srcdoc = doc;
    document.body.appendChild(iframe);
  });
}
