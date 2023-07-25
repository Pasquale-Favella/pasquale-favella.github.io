import { memo, FC } from 'react';

type CodeEditorLoaderProps = {}

const CodeEditorLoader: FC<CodeEditorLoaderProps> = () => {

    return (
        <div className="flex justify-center px-4 py-16">
            <span className="loading loading-ring loading-lg"></span>
        </div>
    )
}

export default memo(CodeEditorLoader);