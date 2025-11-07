import { FC } from "react";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { BsGithub } from "react-icons/bs";
import { MdFormatAlignLeft, MdError } from "react-icons/md";
import { encodingTypeAtom, EncodingType, errorAtom, formatJsonAtom, jsonInputAtom, statsAtom, toonOutputAtom } from "@/store/json-toon.store";

interface StatCardProps {
    label: string;
    value: string;
    valueColor?: string;
}

export const StatCard: React.FC<StatCardProps> = ({ label, value, valueColor = 'text-base-content' }) => {
    return (
        <div className="stat bg-base-200/50 rounded-lg border border-base-300 min-w-[160px]">
            <div className="stat-title">{label}</div>
            <div className={`stat-value text-3xl ${valueColor}`}>{value}</div>
        </div>
    );
};

const encodingOptions: { value: EncodingType; label: string }[] = [
    { value: 'cl100k_base', label: 'cl100k_base (GPT-4, GPT-3.5-turbo)' },
    { value: 'p50k_base', label: 'p50k_base (Code models)' },
    { value: 'r50k_base', label: 'r50k_base (GPT-3)' },
    { value: 'gpt2', label: 'gpt2 (GPT-2)' },
];

const JsonToonComparator: FC = () => {
    const [jsonInput, setJsonInput] = useAtom(jsonInputAtom);
    const [encodingType, setEncodingType] = useAtom(encodingTypeAtom);
    const toonOutput = useAtomValue(toonOutputAtom);
    const stats = useAtomValue(statsAtom);
    const error = useAtomValue(errorAtom);
    const formatJson = useSetAtom(formatJsonAtom);

    return (
        <main className="container mx-auto px-4 py-8">
            {/* Header */}
            <header className="text-center mb-8">
                <h1 className="text-4xl sm:text-5xl font-bold mb-3">
                    JSON vs. TOON Comparer
                </h1>
                <p className="text-lg text-base-content/70 max-w-3xl mx-auto mb-4">
                    Analyze the token efficiency of TOON (Token-Oriented Object Notation) compared to JSON for your LLM applications.
                </p>
                <a
                    href="https://github.com/Toon-Format/toon"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-ghost btn-sm gap-2"
                >
                    <BsGithub className="size-5" />
                    <span>TOON Project</span>
                </a>
            </header>

            {/* Encoding Selector */}
            <div className="max-w-4xl mx-auto mb-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                    <label className="label">
                        <span className="label-text font-medium">Token Encoding:</span>
                    </label>
                    <select
                        value={encodingType}
                        onChange={(e) => setEncodingType(e.target.value as EncodingType)}
                        className="select select-bordered select-sm w-full sm:w-auto"
                    >
                        {encodingOptions.map(option => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 max-w-4xl mx-auto">
                <StatCard label="JSON Tokens" value={stats.jsonTokens.toString()} />
                <StatCard label="TOON Tokens" value={stats.toonTokens.toString()} />
                <StatCard
                    label="Token Savings"
                    value={`${stats.savings.toFixed(1)}%`}
                    valueColor={stats.savings > 0 ? 'text-success' : stats.savings < 0 ? 'text-error' : 'text-base-content'}
                />
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* JSON Input Card */}
                <div className="card bg-base-100 border border-base-300 flex flex-col h-[600px]">
                    <div className="card-body p-0 flex flex-col h-full overflow-hidden">
                        {/* Header */}
                        <div className="flex justify-between items-center px-6 py-4 border-b border-base-300 shrink-0">
                            <h2 className="card-title text-xl">JSON Input</h2>
                            <div className="tooltip tooltip-left before:text-xs before:content-[attr(data-tip)]" data-tip="Format JSON">
                                <button
                                    onClick={formatJson}
                                    className="btn btn-ghost btn-sm btn-circle"
                                >
                                    <MdFormatAlignLeft className="w-5 h-5" />
                                </button>
                            </div>

                        </div>

                        {/* Textarea Container */}
                        <div className="flex-1 min-h-0 flex flex-col">
                            <textarea
                                value={jsonInput}
                                onChange={(e) => setJsonInput(e.target.value)}
                                placeholder="Paste your JSON here..."
                                className="textarea textarea-ghost w-full flex-1 resize-none font-mono text-sm leading-relaxed focus:outline-none p-6"
                            />
                        </div>

                        {/* Error Alert */}
                        {error && (
                            <div className="alert alert-error my-2 shrink-0">
                                <div className="flex items-center gap-2">
                                    <MdError className="h-5 w-5 shrink-0" />
                                    <span className="text-sm">{error}</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* TOON Output Card */}
                <div className="card bg-base-100 border border-base-300 flex flex-col h-[600px]">
                    <div className="card-body p-0 flex flex-col h-full overflow-hidden">
                        {/* Header */}
                        <div className="flex justify-between items-center px-6 py-4 border-b border-base-300 shrink-0">
                            <h2 className="card-title text-xl">TOON Output</h2>
                            <div className="badge badge-primary badge-sm">Read-only</div>
                        </div>

                        {/* Output Content */}
                        <div className="p-6 flex-1 min-h-0 overflow-auto">
                            {toonOutput ? (
                                <pre className="font-mono text-sm leading-relaxed">
                                    <code>{toonOutput}</code>
                                </pre>
                            ) : (
                                <div className="flex items-center justify-center h-full text-base-content/50">
                                    <p>Enter valid JSON to see TOON output</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default JsonToonComparator;