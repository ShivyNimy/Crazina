import { useState, useEffect, useMemo } from 'react';
import { Eye, Play, RotateCcw, Terminal, Trash2 } from 'lucide-react';
import { CodeEditor } from './CodeEditor';
import { PLAYGROUND_TEMPLATES } from '../data/playgroundTemplates';
import { buildWebPreviewDocument, runJavaScriptTests } from '../engine/runner';
import type { ConsoleEntry, WebStarterFiles } from '../types';

export function PlaygroundView() {
  const [templateId, setTemplateId] = useState(PLAYGROUND_TEMPLATES[0].id);
  const activeTemplate =
    PLAYGROUND_TEMPLATES.find((t) => t.id === templateId) || PLAYGROUND_TEMPLATES[0];

  const [mode, setMode] = useState<'web' | 'js'>(activeTemplate.mode);
  const [jsCode, setJsCode] = useState<string>(
    PLAYGROUND_TEMPLATES.find((t) => t.mode === 'js')?.jsCode || ''
  );
  const [webFiles, setWebFiles] = useState<WebStarterFiles>(
    activeTemplate.webFiles || { html: '', css: '', js: '' }
  );
  const [activeWebTab, setActiveWebTab] = useState<'html' | 'css' | 'js'>('html');

  const [logs, setLogs] = useState<ConsoleEntry[]>([]);
  const [runtimeError, setRuntimeError] = useState<string | null>(null);
  const [durationMs, setDurationMs] = useState<number | null>(null);
  const [running, setRunning] = useState(false);
  const [previewNonce, setPreviewNonce] = useState(0);

  const bridgeId = useMemo(() => 'pg-' + Math.random().toString(36).slice(2), []);

  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      if (e.data && e.data.type === 'crazina-preview-log' && e.data.bridgeId === bridgeId) {
        setLogs((prev) => [
          ...prev.slice(-80),
          { level: e.data.level || 'log', message: String(e.data.message) },
        ]);
      }
    };
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, [bridgeId]);

  const loadTemplate = (id: string) => {
    const tpl = PLAYGROUND_TEMPLATES.find((t) => t.id === id);
    if (!tpl) return;
    setTemplateId(id);
    setMode(tpl.mode);
    setLogs([]);
    setRuntimeError(null);
    setDurationMs(null);
    if (tpl.mode === 'js' && tpl.jsCode) {
      setJsCode(tpl.jsCode);
    } else if (tpl.mode === 'web' && tpl.webFiles) {
      setWebFiles(tpl.webFiles);
      setActiveWebTab('html');
      setPreviewNonce((n) => n + 1);
    }
  };

  const handleRun = async () => {
    setLogs([]);
    setRuntimeError(null);
    if (mode === 'web') {
      setPreviewNonce((n) => n + 1);
      return;
    }
    setRunning(true);
    try {
      const res = await runJavaScriptTests(jsCode, '');
      setLogs(res.logs);
      setRuntimeError(res.runtimeError || null);
      setDurationMs(res.durationMs);
    } finally {
      setRunning(false);
    }
  };

  const previewDoc = useMemo(() => {
    if (mode !== 'web') return '';
    return buildWebPreviewDocument(webFiles, bridgeId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, webFiles, bridgeId, previewNonce]);

  return (
    <div className="mx-auto max-w-[1440px] px-4 pb-12 pt-6 sm:px-6">
      {/* Header & Template Picker */}
      <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-[var(--ink-primary)]">
            Interactive Sandbox Playground
          </h1>
          <p className="text-xs text-[var(--ink-secondary)]">
            Build freely in HTML/CSS/JS or run pure JavaScript algorithms with zero setup.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {PLAYGROUND_TEMPLATES.map((tpl) => (
            <button
              key={tpl.id}
              type="button"
              onClick={() => loadTemplate(tpl.id)}
              className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-colors ${
                templateId === tpl.id
                  ? 'bg-emerald-600 text-white'
                  : 'border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--ink-secondary)] hover:bg-[var(--bg-subtle)]'
              }`}
            >
              {tpl.name}
            </button>
          ))}
        </div>
      </div>

      {/* Split Workspace */}
      <div className="grid gap-5 lg:grid-cols-12">
        {/* Editor Pane */}
        <div className="flex h-[560px] flex-col overflow-hidden rounded-2xl border border-[var(--border-subtle)] bg-[#11141b] lg:col-span-6">
          <div className="flex items-center justify-between border-b border-white/10 bg-[#0c0e13] px-3 py-2 text-xs">
            <div className="flex items-center gap-1">
              {mode === 'js' ? (
                <span className="rounded-md bg-emerald-500/20 px-2.5 py-1 font-mono font-semibold text-emerald-300">
                  sandbox.js
                </span>
              ) : (
                (['html', 'css', 'js'] as const).map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveWebTab(tab)}
                    className={`rounded-md px-2.5 py-1 font-mono font-semibold ${
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
              <button
                type="button"
                onClick={() => loadTemplate(templateId)}
                className="rounded-md border border-white/10 bg-white/5 px-2 py-1 text-slate-300 hover:bg-white/10"
                title="Reset template"
              >
                <RotateCcw className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={handleRun}
                disabled={running}
                className="inline-flex items-center gap-1.5 rounded-md bg-emerald-600 px-3 py-1 font-bold text-white hover:bg-emerald-500"
              >
                <Play className="h-3.5 w-3.5 fill-current" />
                {running ? 'Running...' : mode === 'web' ? 'Reload Preview' : 'Run (Ctrl+Enter)'}
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-hidden">
            {mode === 'js' ? (
              <CodeEditor
                value={jsCode}
                onChange={setJsCode}
                language="js"
                onRun={handleRun}
                minHeight="480px"
              />
            ) : (
              <CodeEditor
                value={webFiles[activeWebTab]}
                onChange={(val) =>
                  setWebFiles((prev) => ({ ...prev, [activeWebTab]: val }))
                }
                language={activeWebTab}
                onRun={handleRun}
                minHeight="480px"
              />
            )}
          </div>
        </div>

        {/* Output Pane */}
        <div className="flex h-[560px] flex-col overflow-hidden rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] lg:col-span-6">
          {mode === 'web' ? (
            <>
              <div className="flex items-center justify-between border-b border-[var(--border-subtle)] bg-[var(--bg-subtle)]/70 px-4 py-2.5 text-xs font-bold text-[var(--ink-primary)]">
                <span className="inline-flex items-center gap-1.5">
                  <Eye className="h-3.5 w-3.5 text-emerald-600" /> Live Rendered Preview
                </span>
                <span className="font-mono text-[11px] font-normal text-[var(--ink-muted)]">
                  Sandboxed iframe
                </span>
              </div>
              <div className="flex-1 bg-white p-2">
                <iframe
                  key={previewNonce}
                  title="Playground live preview"
                  sandbox="allow-scripts"
                  srcDoc={previewDoc}
                  className="h-full w-full rounded-lg border border-slate-200 bg-white"
                />
              </div>
              <div className="h-36 overflow-y-auto border-t border-[var(--border-subtle)] bg-[#0f1218] p-3 font-mono text-xs text-slate-200">
                <div className="mb-1.5 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="inline-flex items-center gap-1">
                    <Terminal className="h-3 w-3 text-emerald-400" /> Console
                  </span>
                  <button
                    type="button"
                    onClick={() => setLogs([])}
                    className="inline-flex items-center gap-1 hover:text-white"
                  >
                    <Trash2 className="h-3 w-3" /> Clear
                  </button>
                </div>
                {logs.length === 0 ? (
                  <p className="text-slate-500">Interact with your preview or call console.log()...</p>
                ) : (
                  logs.map((l, i) => (
                    <div
                      key={i}
                      className={
                        l.level === 'error' ? 'text-rose-400' : 'text-emerald-300'
                      }
                    >
                      {l.message}
                    </div>
                  ))
                )}
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center justify-between border-b border-[var(--border-subtle)] bg-[var(--bg-subtle)]/70 px-4 py-2.5 text-xs font-bold text-[var(--ink-primary)]">
                <span className="inline-flex items-center gap-1.5">
                  <Terminal className="h-3.5 w-3.5 text-emerald-600" /> JavaScript Console Output
                </span>
                <div className="flex items-center gap-3">
                  {durationMs !== null && (
                    <span className="font-mono text-[11px] font-normal text-[var(--ink-muted)]">
                      Executed in {durationMs}ms
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      setLogs([]);
                      setRuntimeError(null);
                    }}
                    className="inline-flex items-center gap-1 text-[var(--ink-muted)] hover:text-[var(--ink-primary)]"
                  >
                    <Trash2 className="h-3.5 w-3.5" /> Clear
                  </button>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto bg-[#0f1218] p-4 font-mono text-xs">
                {runtimeError && (
                  <div className="mb-3 rounded-lg border border-rose-500/30 bg-rose-500/15 p-3 text-rose-300">
                    {runtimeError}
                  </div>
                )}
                {logs.length === 0 && !runtimeError ? (
                  <p className="text-slate-500">
                    Click <strong>Run (Ctrl+Enter)</strong> to execute your JavaScript and inspect output here.
                  </p>
                ) : (
                  <div className="space-y-1.5">
                    {logs.map((entry, idx) => (
                      <div
                        key={idx}
                        className={`rounded-md px-2.5 py-1.5 whitespace-pre-wrap ${
                          entry.level === 'error'
                            ? 'bg-rose-500/15 text-rose-300'
                            : 'bg-white/5 text-emerald-200'
                        }`}
                      >
                        {entry.message}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
