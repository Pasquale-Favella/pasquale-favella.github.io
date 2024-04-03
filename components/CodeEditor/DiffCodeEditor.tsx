import { useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import { DiffEditor, useMonaco } from '@monaco-editor/react';
import { SingleValue } from 'react-select';
import { TailwindUtils } from '@/utils';
import { useTheme } from '@/hooks/use-theme';
import useIsMobile from '@/hooks/use-isMobile';
import CodeEditorLoader from './CodeEditorLoader';
 
const Select = dynamic(() => import('react-select'), { ssr: false });

type LangSelect = SingleValue<{value : string , label : string}>;

const DEFAULT_LANG_SELECTED : LangSelect = {
    value: "plaintext",
    label: "PLAIN TEXT"
}

const DiffCodeEditor = () => {

    const [selectedOption, setSelectedOption] = useState<LangSelect>(DEFAULT_LANG_SELECTED);
    const { isDarkMode } = useTheme();
    const isMobile = useIsMobile();
    const monaco = useMonaco();

    const daisyUiPalette = useMemo(()=> TailwindUtils.getDaisyUiPalette(isDarkMode) , [isDarkMode]);

    const options = useMemo(
        ()=> monaco?.languages.getLanguages().map(({ id, aliases }) => ({
            value: id,
            label: (aliases ? aliases[0] : id).toUpperCase()
        })),
        [monaco]
    );

    return (
        <>
            <Select
                defaultValue={selectedOption}
                onChange={selectedLang => setSelectedOption(selectedLang as LangSelect|null ?? DEFAULT_LANG_SELECTED)}
                isSearchable
                isClearable
                id="selectbox"
                instanceId="selectbox"
                placeholder="Select Language"
                options={options}
                theme={(theme) => ({
                    ...theme,
                    borderRadius: 5,
                    colors: {
                      ...theme.colors,
                      primary25: daisyUiPalette['primary-content'],
                      primary: daisyUiPalette['base-content'],
                      primary50 : daisyUiPalette['base-200'],
                      neutral0 : daisyUiPalette['base-100'],
                      neutral80 : daisyUiPalette['base-content'],
                    },
                  })}
            />

            <div className="divider"></div> 

            <DiffEditor
                className='h-[calc(85vh-100px)]'
                theme={isDarkMode ? 'vs-dark' : 'light'}
                language={selectedOption?.value ?? DEFAULT_LANG_SELECTED.value}
                loading={<CodeEditorLoader />}
                options={
                    {
                        minimap: { enabled: !isMobile },
                        domReadOnly: false,
                        readOnly: false,
                        originalEditable: true
                    }
                }
            />

        </>
    );
}

export default DiffCodeEditor