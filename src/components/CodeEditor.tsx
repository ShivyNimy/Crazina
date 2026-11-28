import { useEffect, useRef } from 'react';
import { EditorState } from '@codemirror/state';
import { EditorView, keymap, lineNumbers, highlightActiveLine, highlightActiveLineGutter } from '@codemirror/view';
import { defaultKeymap, history, historyKeymap, indentWithTab } from '@codemirror/commands';
import { bracketMatching, indentOnInput } from '@codemirror/language';
import { closeBrackets, closeBracketsKeymap } from '@codemirror/autocomplete';
import { javascript } from '@codemirror/lang-javascript';
import { html } from '@codemirror/lang-html';
import { css } from '@codemirror/lang-css';
import { oneDark } from '@codemirror/theme-one-dark';

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language: 'js' | 'html' | 'css';
  onRun?: () => void;
  minHeight?: string;
}

export function CodeEditor({
  value,
  onChange,
  language,
  onRun,
  minHeight = '260px',
}: CodeEditorProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const viewRef = useRef<EditorView | null>(null);
  const onChangeRef = useRef(onChange);
  const onRunRef = useRef(onRun);

  onChangeRef.current = onChange;
  onRunRef.current = onRun;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const langExt =
      language === 'html'
        ? html()
        : language === 'css'
          ? css()
          : javascript();

    const runShortcut = keymap.of([
      {
        key: 'Mod-Enter',
        run: () => {
          if (onRunRef.current) {
            onRunRef.current();
            return true;
          }
          return false;
        },
      },
    ]);

    const state = EditorState.create({
      doc: value,
      extensions: [
        lineNumbers(),
        highlightActiveLineGutter(),
        highlightActiveLine(),
        history(),
        indentOnInput(),
        bracketMatching(),
        closeBrackets(),
        langExt,
        oneDark,
        EditorView.lineWrapping,
        runShortcut,
        keymap.of([
          ...closeBracketsKeymap,
          ...defaultKeymap,
          ...historyKeymap,
          indentWithTab,
        ]),
        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            onChangeRef.current(update.state.doc.toString());
          }
        }),
        EditorView.theme({
          '&': {
            backgroundColor: '#11141b',
            height: '100%',
            minHeight,
          },
          '.cm-gutters': {
            backgroundColor: '#0e1016',
            color: '#5a6378',
          },
          '.cm-activeLine': {
            backgroundColor: 'rgba(52, 211, 153, 0.06)',
          },
          '.cm-activeLineGutter': {
            backgroundColor: 'rgba(52, 211, 153, 0.09)',
            color: '#94a3b8',
          },
          '.cm-content': {
            padding: '12px 0',
          },
        }),
      ],
    });

    const view = new EditorView({
      state,
      parent: container,
    });
    viewRef.current = view;

    return () => {
      view.destroy();
      viewRef.current = null;
    };
    // Re-initialize only when language changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language, minHeight]);

  // Keep external updates (like Reset / Solution / Switching Lesson) synced cleanly
  useEffect(() => {
    const view = viewRef.current;
    if (!view) return;
    const current = view.state.doc.toString();
    if (current !== value) {
      view.dispatch({
        changes: { from: 0, to: current.length, insert: value },
      });
    }
  }, [value]);

  return (
    <div
      ref={containerRef}
      className="h-full w-full overflow-hidden bg-[#11141b]"
      style={{ minHeight }}
    />
  );
}
