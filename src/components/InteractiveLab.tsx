import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  CheckCircle2,
  Eye,
  Lightbulb,
  Play,
  RotateCcw,
  Sparkles,
  Terminal,
  XCircle,
  FlaskConical,
  Code2,
} from 'lucide-react';
import { CodeEditor } from './CodeEditor';
import {
  buildWebPreviewDocument,
  runJavaScriptTests,
  runWebTests,
} from '../engine/runner';
import type { ExecutionResult, LessonMode, WebStarterFiles } from '../types';

interface InteractiveLabProps {
  labKey: string;
  mode: LessonMode;
  title: string;
  prompt: string;
  requirements: string[];
  starterCode?: string;
  solutionCode?: string;
  starterFiles?: WebStarterFiles;
  solutionFiles?: WebStarterFiles;
  testScript: string;
  hints: string[];
  savedDraft?: string | WebStarterFiles;
  isCompleted: boolean;
  xpReward: number;
  onDraftChange: (value: string | WebStarterFiles) => void;
  onPassAllTests: () => void;
  nextActionLabel?: string;
  onNextAction?: () => void;
}

export function InteractiveLab({
  labKey,
  mode,
  title,
  prompt,
  requirements,
  starterCode = '',
  solutionCode = '',
  starterFiles,
  solutionFiles,
  testScript,
  hints,
  savedDraft,
  isCompleted,
  xpReward,
  onDraftChange,
  onPassAllTests,
  nextActionLabel,
  onNextAction,
}: InteractiveLabProps) {
  const initialJs =
    mode === 'js'
      ? typeof savedDraft === 'string'
        ? savedDraft
        : starterCode
      : '';

  const initialWeb: WebStarterFiles =
    mode === 'web'
      ? savedDraft && typeof savedDraft === 'object'
        ? savedDraft
        : starterFiles || { html: '', css: '', js: '' }
      : { html: '', css: '', js: '' };

  const [jsCode, setJsCode] = useState<string>(initialJs);
  const [webFiles, setWebFiles] = useState<WebStarterFiles>(initialWeb);
  const [activeWebTab, setActiveWebTab] = useState<'html' | 'css' | 'js'>(() => {
    if (!starterFiles) return 'html';
    if (starterFiles.js.includes('// Wire up') || starterFiles.js.includes('// Listen')) return 'js';
    if (starterFiles.css.includes('/* Add') || starterFiles.css.includes('/* Set')) return 'css';
    return 'html';
  });

  const [outputTab, setOutputTab] = useState<'tests' | 'preview' | 'console'>(
    mode === 'web' ? 'preview' : 'tests'
  );
  const [result, setResult] = useState<ExecutionResult | null>(null);
  const [running, setRunning] = useState(false);
  const [revealedHints, setRevealedHints] = useState(0);
  const [showSolutionConfirm, setShowSolutionConfirm] = useState(false);

  // Sync state when switching between lessons or challenges
  useEffect(() => {
    if (mode === 'js') {
      setJsCode(typeof savedDraft === 'string' ? savedDraft : starterCode);
      setOutputTab('tests');
    } else {
      const files =
        savedDraft && typeof savedDraft === 'object'
          ? savedDraft
          : starterFiles || { html: '', css: '', js: '' };
      setWebFiles(files);
      if (files.js.includes('// Wire up') || files.js.includes('// Listen')) {
        setActiveWebTab('js');
      } else if (files.css.includes('/* Add') || files.css.includes('/* Set')) {
        setActiveWebTab('css');
      } else {
        setActiveWebTab('html');
      }
      setOutputTab('preview');
    }
    setResult(null);
    setRevealedHints(0);
    setShowSolutionConfirm(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [labKey, mode]);

  const handleJsChange = useCallback(
    (val: string) => {
      setJsCode(val);
      onDraftChange(val);
    },
    [onDraftChange]
  );

  const handleWebFileChange = useCallback(
    (val: string) => {
      setWebFiles((prev) => {
        const next = { ...prev, [activeWebTab]: val };
        onDraftChange(next);
        return next;
      });
    },
    [activeWebTab, onDraftChange]
  );

  const handleRun = useCallback(async () => {
    setRunning(true);
    try {
      const execResult =
        mode === 'js'
          ? await runJavaScriptTests(jsCode, testScript)
          : await runWebTests(webFiles, testScript);
      setResult(execResult);
      setOutputTab('tests');
      if (execResult.success && execResult.tests.length > 0) {
        onPassAllTests();
      }
    } finally {
      setRunning(false);
    }
  }, [mode, jsCode, webFiles, testScript, onPassAllTests]);

  const handleReset = () => {
    if (mode === 'js') {
      setJsCode(starterCode);
      onDraftChange(starterCode);
    } else if (starterFiles) {
      setWebFiles(starterFiles);
      onDraftChange(starterFiles);
    }
    setResult(null);
  };

  const handleApplySolution = () => {
    if (mode === 'js' && solutionCode) {
      setJsCode(solutionCode);
      onDraftChange(solutionCode);
    } else if (mode === 'web' && solutionFiles) {
      setWebFiles(solutionFiles);
      onDraftChange(solutionFiles);
    }
    setShowSolutionConfirm(false);
  };

  const previewDoc = useMemo(() => {
    if (mode !== 'web') return '';
    return buildWebPreviewDocument(webFiles);
  }, [mode, webFiles]);

  const passedCount = result ? result.tests.filter((t) => t.passed).length : 0;
  const totalTests = result ? result.tests.length : 0;

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] shadow-sm">
      {/* Lab Prompt Header */}
      <div className="border-b border-[var(--border-subtle)] bg-[var(--bg-subtle)]/60 px-4 py-3.5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-md bg-emerald-600/12 px-2 py-0.5 text-xs font-bold text-emerald-700 dark:bg-emerald-400/15 dark:text-emerald-300">
              <Code2 className="h-3.5 w-3.5" />
              Interactive Lab
            </span>
            <h3 className="text-sm font-bold text-[var(--ink-primary)]">{title}</h3>
          </div>
          {isCompleted && (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-600 px-2.5 py-0.5 text-xs font-bold text-white">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Completed
            </span>
          )}
        </div>
        <p className="mt-1.5 text-xs leading-relaxed text-[var(--ink-secondary)]">
          {prompt}
        </p>
        <ul className="mt-2 space-y-1">
          {requirements.map((req, idx) => (
            <li
              key={idx}
              className="flex items-start gap-1.5 text-xs text-[var(--ink-secondary)]"
            >
              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
              <span>{req}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Editor Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 bg-[#0d1016] px-3 py-2 text-xs text-slate-300">
        <div className="flex items-center gap-1">
          {mode === 'js' ? (
            <span className="rounded-md bg-white/10 px-2.5 py-1 font-mono text-xs font-semibold text-emerald-300">
              solution.js
            </span>
          ) : (
            (['html', 'css', 'js'] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveWebTab(tab)}
                className={`rounded-md px-2.5 py-1 font-mono text-xs font-semibold transition-colors ${
                  activeWebTab === tab
                    ? 'bg-emerald-500/20 text-emerald-300'
                    : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
                }`}
              >
                {tab === 'html' ? 'index.html' : tab === 'css' ? 'styles.css' : 'script.js'}
              </button>
            ))
          )}
        </div>

        <div className="flex items-center gap-1.5">
          {hints.length > 0 && (
            <button
              type="button"
              onClick={() => setRevealedHints((h) => Math.min(hints.length, h + 1))}
              disabled={revealedHints >= hints.length}
              className="inline-flex items-center gap-1 rounded-md border border-white/10 bg-white/5 px-2.5 py-1 text-xs font-medium text-amber-300 transition-colors hover:bg-white/10 disabled:opacity-45"
              title="Reveal next hint"
            >
              <Lightbulb className="h-3.5 w-3.5" />
              Hint {revealedHints > 0 ? `(${revealedHints}/${hints.length})` : ''}
            </button>
          )}

          {(solutionCode || solutionFiles) && (
            <button
              type="button"
              onClick={() => setShowSolutionConfirm((v) => !v)}
              className="inline-flex items-center gap-1 rounded-md border border-white/10 bg-white/5 px-2.5 py-1 text-xs font-medium text-slate-300 transition-colors hover:bg-white/10"
            >
              <Eye className="h-3.5 w-3.5" />
              Solution
            </button>
          )}

          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-1 rounded-md border border-white/10 bg-white/5 px-2 py-1 text-xs font-medium text-slate-300 transition-colors hover:bg-white/10"
            title="Reset to starter code"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>

          <button
            type="button"
            onClick={handleRun}
            disabled={running}
            className="inline-flex items-center gap-1.5 rounded-md bg-emerald-600 px-3 py-1 text-xs font-bold text-white shadow-sm transition-colors hover:bg-emerald-500 disabled:opacity-60"
            title="Run Tests (Ctrl+Enter)"
          >
            <Play className="h-3.5 w-3.5 fill-current" />
            {running ? 'Running...' : 'Run & Check'}
          </button>
        </div>
      </div>

      {/* Progressive Hints / Solution Confirmation Bar */}
      {(revealedHints > 0 || showSolutionConfirm) && (
        <div className="space-y-2 border-b border-[var(--border-subtle)] bg-amber-500/8 px-4 py-2.5 text-xs">
          {revealedHints > 0 && (
            <div className="space-y-1.5">
              {hints.slice(0, revealedHints).map((hint, i) => (
                <div key={i} className="flex items-start gap-2 text-[var(--ink-primary)]">
                  <span className="rounded bg-amber-500/20 px-1.5 py-0.5 font-mono text-[10px] font-bold text-amber-800 dark:text-amber-200">
                    HINT {i + 1}
                  </span>
                  <span className="leading-relaxed">{hint}</span>
                </div>
              ))}
            </div>
          )}

          {showSolutionConfirm && (
            <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-amber-500/30 bg-[var(--bg-surface)] px-3 py-2">
              <span className="text-[var(--ink-secondary)]">
                Load the reference solution into the editor? (Try hints first for best learning!)
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowSolutionConfirm(false)}
                  className="rounded-md px-2.5 py-1 font-semibold text-[var(--ink-muted)] hover:bg-[var(--bg-subtle)]"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleApplySolution}
                  className="rounded-md bg-amber-600 px-2.5 py-1 font-bold text-white hover:bg-amber-500"
                >
                  Load Solution
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Code Editor Area */}
      <div className="min-h-[240px] flex-1 overflow-hidden">
        {mode === 'js' ? (
          <CodeEditor
            value={jsCode}
            onChange={handleJsChange}
            language="js"
            onRun={handleRun}
            minHeight="240px"
          />
        ) : (
          <CodeEditor
            value={webFiles[activeWebTab]}
            onChange={handleWebFileChange}
            language={activeWebTab}
            onRun={handleRun}
            minHeight="240px"
          />
        )}
      </div>

      {/* Output Pane Tabs */}
      <div className="flex items-center justify-between border-t border-[var(--border-subtle)] bg-[var(--bg-subtle)]/70 px-3 py-1.5 text-xs">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setOutputTab('tests')}
            className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 font-semibold transition-colors ${
              outputTab === 'tests'
                ? 'bg-[var(--bg-surface)] text-[var(--ink-primary)] shadow-xs'
                : 'text-[var(--ink-muted)] hover:text-[var(--ink-primary)]'
            }`}
          >
            <FlaskConical className="h-3.5 w-3.5" />
            Tests
            {result && totalTests > 0 && (
              <span
                className={`rounded-full px-1.5 py-0.2 text-[10px] font-bold ${
                  result.success
                    ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300'
                    : 'bg-rose-500/15 text-rose-700 dark:text-rose-300'
                }`}
              >
                {passedCount}/{totalTests}
              </span>
            )}
          </button>

          {mode === 'web' && (
            <button
              type="button"
              onClick={() => setOutputTab('preview')}
              className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 font-semibold transition-colors ${
                outputTab === 'preview'
                  ? 'bg-[var(--bg-surface)] text-[var(--ink-primary)] shadow-xs'
                  : 'text-[var(--ink-muted)] hover:text-[var(--ink-primary)]'
              }`}
            >
              <Eye className="h-3.5 w-3.5" />
              Live Preview
            </button>
          )}

          <button
            type="button"
            onClick={() => setOutputTab('console')}
            className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 font-semibold transition-colors ${
              outputTab === 'console'
                ? 'bg-[var(--bg-surface)] text-[var(--ink-primary)] shadow-xs'
                : 'text-[var(--ink-muted)] hover:text-[var(--ink-primary)]'
            }`}
          >
            <Terminal className="h-3.5 w-3.5" />
            Console
            {result && result.logs.length > 0 && (
              <span className="rounded-full bg-[var(--border-subtle)] px-1.5 text-[10px] font-bold text-[var(--ink-secondary)]">
                {result.logs.length}
              </span>
            )}
          </button>
        </div>

        <span className="hidden font-mono text-[11px] text-[var(--ink-muted)] sm:inline">
          {result ? `${result.durationMs}ms` : 'Press Ctrl+Enter to run'}
        </span>
      </div>

      {/* Output Pane Body */}
      <div className="h-[220px] overflow-y-auto bg-[var(--bg-surface)] p-3.5">
        {outputTab === 'preview' && mode === 'web' ? (
          <iframe
            title="Live web lab preview"
            sandbox="allow-scripts"
            srcDoc={previewDoc}
            className="h-full w-full rounded-lg border border-[var(--border-subtle)] bg-white"
          />
        ) : outputTab === 'console' ? (
          <div className="font-mono text-xs">
            {!result || result.logs.length === 0 ? (
              <p className="text-[var(--ink-muted)]">
                No console output yet. Use <code className="text-emerald-600 dark:text-emerald-400">console.log(...)</code> and run your code to inspect values here.
              </p>
            ) : (
              <div className="space-y-1.5">
                {result.logs.map((entry, idx) => (
                  <div
                    key={idx}
                    className={`rounded-md px-2.5 py-1.5 whitespace-pre-wrap ${
                      entry.level === 'error'
                        ? 'bg-rose-500/10 text-rose-700 dark:text-rose-300'
                        : entry.level === 'warn'
                          ? 'bg-amber-500/10 text-amber-700 dark:text-amber-300'
                          : 'bg-[var(--bg-subtle)] text-[var(--ink-primary)]'
                    }`}
                  >
                    {entry.message}
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          /* Test Results Tab */
          <div className="space-y-2.5">
            {!result ? (
              <div className="flex h-full flex-col items-center justify-center py-8 text-center">
                <p className="text-sm font-semibold text-[var(--ink-secondary)]">
                  Ready to verify your code
                </p>
                <p className="mt-1 text-xs text-[var(--ink-muted)]">
                  Click <strong>Run &amp; Check</strong> (or press Ctrl+Enter) to run the automated test suite.
                </p>
              </div>
            ) : (
              <>
                {result.runtimeError && (
                  <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-700 dark:text-rose-300">
                    <div className="font-bold">Runtime / Syntax Error</div>
                    <pre className="mt-1 whitespace-pre-wrap font-mono">{result.runtimeError}</pre>
                  </div>
                )}

                {result.success && result.tests.length > 0 && (
                  <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-2.5">
                    <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-200">
                      <Sparkles className="h-4 w-4 shrink-0" />
                      <span className="text-xs font-bold">
                        All {result.tests.length} tests passed! +{xpReward} XP unlocked
                      </span>
                    </div>
                    {onNextAction && nextActionLabel && (
                      <button
                        type="button"
                        onClick={onNextAction}
                        className="rounded-lg bg-emerald-600 px-3 py-1 text-xs font-bold text-white hover:bg-emerald-500"
                      >
                        {nextActionLabel}
                      </button>
                    )}
                  </div>
                )}

                <div className="space-y-2">
                  {result.tests.map((t, idx) => (
                    <div
                      key={idx}
                      className={`rounded-xl border px-3 py-2 text-xs ${
                        t.passed
                          ? 'border-emerald-500/25 bg-emerald-500/6'
                          : 'border-rose-500/30 bg-rose-500/8'
                      }`}
                    >
                      <div className="flex items-center gap-2 font-semibold">
                        {t.passed ? (
                          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                        ) : (
                          <XCircle className="h-4 w-4 shrink-0 text-rose-600 dark:text-rose-400" />
                        )}
                        <span className="text-[var(--ink-primary)]">{t.name}</span>
                      </div>
                      {!t.passed && t.error && (
                        <div className="mt-1.5 pl-6 font-mono text-[11px] text-rose-700 dark:text-rose-300">
                          {t.error}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
