import { memo, FC } from 'react';
import useEditor from '@/hooks/use-editor';
import { EditorStateKey } from '@/store/editor.atom';
import { AiFillHtml5 } from 'react-icons/ai';
import { DiCss3 } from 'react-icons/di';
import { SiJavascript } from 'react-icons/si';
import { VscPreview } from 'react-icons/vsc';

type EditorTabsProps = {}
 
const EditorTabs : FC<EditorTabsProps> = ()=> {
    const { tabSelected , setTabSelected , setPreview } = useEditor();

    const handleSelectTab = (key : EditorStateKey)=> {
        setTabSelected(key);
        setPreview(false);
    }

    return (
        <header className='flex justify-between'>

            <div className="tabs">
                <button className={`tab gap-1 ${tabSelected === 'html' ? 'tab-active' : ''}`} onClick={()=> handleSelectTab('html')}>
                    <AiFillHtml5 /> html
                </button> 
                <button className={`tab gap-1 ${tabSelected === 'css' ? 'tab-active' : ''}`} onClick={()=> handleSelectTab('css')}>
                    <DiCss3 /> css
                </button> 
                <button className={`tab gap-1 ${tabSelected === 'js' ? 'tab-active' : ''}`}  onClick={()=> handleSelectTab('js')}>
                    <SiJavascript /> js
                </button>
            </div>

            <div className="tooltip tooltip-bottom before:text-xs before:content-[attr(data-tip)]" data-tip="preview">
                <button className="btn btn-ghost btn-circle normal-case btn-sm"
                    onClick={() => setPreview(prevPreview => !prevPreview)}
                >
                    <VscPreview size={20} />
                </button>
            </div>
            
        </header>
    );
}

export default memo(EditorTabs);
