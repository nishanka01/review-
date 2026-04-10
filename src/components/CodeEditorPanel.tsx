import { Play, Code2, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import CodeEditor from "@uiw/react-textarea-code-editor";
import { useState, useRef, useEffect } from "react";

interface CodeEditorPanelProps {
  code: string;
  language: string;
  onCodeChange: (code: string) => void;
  onLanguageChange: (lang: string) => void;
  onReview: () => void;
  isReviewing: boolean;
}

const LANGUAGES = [
  { value: "python", label: "Python" },
  { value: "javascript", label: "JavaScript" },
  { value: "typescript", label: "TypeScript" },
  { value: "java", label: "Java" },
  { value: "cpp", label: "C++" },
  { value: "c", label: "C" },
  { value: "csharp", label: "C#" },
  { value: "go", label: "Go" },
  { value: "rust", label: "Rust" },
  { value: "ruby", label: "Ruby" },
  { value: "php", label: "PHP" },
  { value: "swift", label: "Swift" },
  { value: "kotlin", label: "Kotlin" },
  { value: "scala", label: "Scala" },
  { value: "r", label: "R" },
  { value: "dart", label: "Dart" },
  { value: "haskell", label: "Haskell" },
  { value: "elixir", label: "Elixir" },
  { value: "perl", label: "Perl" },
  { value: "lua", label: "Lua" },
  { value: "shell", label: "Shell/Bash" },
  { value: "sql", label: "SQL" },
  { value: "html", label: "HTML" },
  { value: "css", label: "CSS" },
];

const editorLangMap: Record<string, string> = {
  cpp: "cpp",
  csharp: "csharp",
  shell: "bash",
  r: "r",
};

const CodeEditorPanel = ({
  code,
  language,
  onCodeChange,
  onLanguageChange,
  onReview,
  isReviewing,
}: CodeEditorPanelProps) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const currentLabel = LANGUAGES.find((l) => l.value === language)?.label || language;

  return (
    <div className="flex flex-1 flex-col terminal-border rounded-lg overflow-hidden">
      <div className="flex items-center justify-between border-b border-border px-3 py-2">
        <div className="flex items-center gap-2">
          <Code2 className="h-4 w-4 text-primary" />
          <span className="text-sm font-mono text-foreground">Code Input</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-1 rounded-md border border-border bg-secondary px-3 py-1 text-xs font-mono text-secondary-foreground hover:bg-muted transition-colors"
            >
              {currentLabel}
              <ChevronDown className="h-3 w-3" />
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 top-full z-50 mt-1 max-h-64 w-44 overflow-auto rounded-md border border-border bg-card shadow-lg">
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang.value}
                    onClick={() => {
                      onLanguageChange(lang.value);
                      setDropdownOpen(false);
                    }}
                    className={`block w-full px-3 py-1.5 text-left text-xs font-mono transition-colors ${
                      language === lang.value
                        ? "bg-primary text-primary-foreground"
                        : "text-card-foreground hover:bg-muted"
                    }`}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
            )}
          </div>
          <Button size="sm" onClick={onReview} disabled={isReviewing} className="gap-1 font-mono text-xs">
            <Play className="h-3 w-3" />
            {isReviewing ? "Reviewing..." : "Review Code"}
          </Button>
        </div>
      </div>
      <div className="flex-1 overflow-auto">
        <CodeEditor
          value={code}
          language={editorLangMap[language] || language}
          onChange={(e) => onCodeChange(e.target.value)}
          padding={16}
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 13,
            backgroundColor: "transparent",
            minHeight: "100%",
          }}
          className="min-h-full"
        />
      </div>
    </div>
  );
};

export default CodeEditorPanel;
