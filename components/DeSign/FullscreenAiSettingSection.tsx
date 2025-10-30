import { useDesign } from "@/hooks/use-de-sign";
import { FiChevronDown, FiChevronUp, FiSettings } from "react-icons/fi";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../Select";
import InputWithIcon from "../InputWithIcon";
import { designSketchAiProviders, providerLinks, providerModels } from "@/store/de-sign.atom";
import { VscKey } from "react-icons/vsc";
import { FC, useState } from "react";

const AISettingsSection: FC<{ isCollapsed: boolean; onToggle: () => void }> = ({ isCollapsed, onToggle }) => {
    const {
        provider,
        model,
        apiKey,
        handleProviderChange,
        setModel,
        setApiKey,
    } = useDesign();

    return (
        <div className="border-b border-base-300 flex-shrink-0">
            <button
                type="button"
                onClick={onToggle}
                className="w-full p-4 flex items-center justify-between hover:bg-base-300/50 transition-colors"
            >
                <div className="flex items-center gap-2">
                    <FiSettings className="w-4 h-4 text-primary" />
                    <span className="font-semibold text-sm">AI Settings</span>
                    {!apiKey && (
                        <span className="badge badge-warning badge-sm">Not configured</span>
                    )}
                </div>
                {isCollapsed ? <FiChevronDown className="w-4 h-4" /> : <FiChevronUp className="w-4 h-4" />}
            </button>

            {!isCollapsed && (
                <div className="px-4 pb-4 space-y-3 animate-in slide-in-from-top-2 duration-200">
                    <div>
                        <label className="block text-xs font-medium mb-1.5 opacity-70">Provider</label>
                        <Select onValueChange={handleProviderChange} value={provider}>
                            <SelectTrigger className="h-9 text-sm">
                                <SelectValue placeholder="Select a provider" />
                            </SelectTrigger>
                            <SelectContent className="z-[9999]">
                                {designSketchAiProviders.map((p) => (
                                    <SelectItem key={p} value={p}>
                                        {p}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <label className="block text-xs font-medium mb-1.5 opacity-70">Model</label>
                        <Select onValueChange={setModel} value={model} >
                            <SelectTrigger className="h-9 text-sm">
                                <SelectValue placeholder="Select a model" />
                            </SelectTrigger>
                            <SelectContent className="z-[9999]">
                                {providerModels[provider].map((m) => (
                                    <SelectItem key={m} value={m}>
                                        {m}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <label className="block text-xs font-medium mb-1.5 opacity-70">API Key</label>
                        <InputWithIcon
                            Icon={VscKey}
                            type="password"
                            value={apiKey}
                            onChange={(e) => setApiKey(e.target.value)}
                            placeholder="Enter your API key"
                            className="input-sm bg-transparent"
                        />
                        <a
                            href={providerLinks[provider]}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-primary hover:underline mt-1.5 inline-block"
                        >
                            Get API key from {provider}
                        </a>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AISettingsSection;