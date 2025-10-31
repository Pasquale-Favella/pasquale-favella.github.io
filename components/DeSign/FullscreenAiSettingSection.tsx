import { FC, useState } from "react";
import { FiChevronDown, FiChevronUp, FiSettings } from "react-icons/fi";
import { useDesign } from "@/hooks/use-de-sign";
import DeSignAiSettings from "./DeSignAiSettings";

const FullscreenAiSettingsSection: FC = () => {
    const [isAiSettingsCollapsed, setIsAiSettingsCollapsed] = useState(true);
    const { apiKey } = useDesign();

    return (
        <div className="border-b border-base-300 flex-shrink-0">
            <button
                type="button"
                onClick={()=> setIsAiSettingsCollapsed(prev => !prev)}
                className="w-full p-4 flex items-center justify-between hover:bg-base-300/50 transition-colors"
            >
                <div className="flex items-center gap-2">
                    <FiSettings className="w-4 h-4 text-primary" />
                    <span className="font-semibold text-sm">AI Settings</span>
                    {!apiKey && (
                        <span className="badge badge-warning badge-sm">Not configured</span>
                    )}
                </div>
                {isAiSettingsCollapsed ? <FiChevronDown className="w-4 h-4" /> : <FiChevronUp className="w-4 h-4" />}
            </button>

            {!isAiSettingsCollapsed && (
                <div className="px-4 pb-4 space-y-3 animate-in slide-in-from-top-2 duration-200">
                    <DeSignAiSettings />
                </div>
            )}
        </div>
    );
};

export default FullscreenAiSettingsSection;