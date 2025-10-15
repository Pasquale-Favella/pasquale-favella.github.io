import { designSketchAiProviders, providerLinks, providerModels } from "@/store/sketch.atom";
import { FC } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../Select";
import InputWithIcon from "../InputWithIcon";
import { VscKey } from "react-icons/vsc";
import { useDesign } from "@/hooks/use-de-sign";

const DeSignAiSettings: FC = () => {
    const {
        provider,
        model,
        apiKey,
        handleProviderChange,
        setModel,
        setApiKey,
    } = useDesign();

    return (
        <div className="space-y-4">
            <div>
                <label className="block text-sm font-medium mb-1">Provider</label>
                <Select onValueChange={handleProviderChange} value={provider}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select a provider" />
                    </SelectTrigger>
                    <SelectContent>
                        {designSketchAiProviders.map((p) => (
                            <SelectItem key={p} value={p}>
                                {p}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <div>
                <label className="block text-sm font-medium mb-1">Model</label>
                <Select onValueChange={setModel} value={model}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select a model" />
                    </SelectTrigger>
                    <SelectContent>
                        {providerModels[provider].map((m) => (
                            <SelectItem key={m} value={m}>
                                {m}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <div>
                <label className="block text-sm font-medium mb-1">API Key</label>
                <InputWithIcon
                    Icon={VscKey}
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="Enter your API key"
                />
                <a
                    href={providerLinks[provider]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline mt-1 block"
                >
                    Get your API key from {provider}
                </a>
            </div>
        </div>
    );
};

export default DeSignAiSettings;