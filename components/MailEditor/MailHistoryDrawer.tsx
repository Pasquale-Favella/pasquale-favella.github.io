import { FC, useCallback } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/Sheet';
import { VscHistory } from 'react-icons/vsc';
import { useMailEditor } from '@/hooks/use-mail-editor';

const MailHistoryDrawer: FC = () => {
  const { history, historyIndex, setHistoryIndex, setMailContent } = useMailEditor();

  const handleRollback = useCallback((index: number) => {
    setHistoryIndex(index);
    setMailContent(history[index]);
  }, [history, setHistoryIndex, setMailContent]);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <div className="tooltip" data-tip="AI Generation History">
            <button className="btn btn-sm btn-outline btn-primary">
                <VscHistory size={20} />
                <span className="font-semibold">History</span>
            </button>
        </div>
      </SheetTrigger>
      <SheetContent side="right" className="w-96" aria-description='AI Generation History'>
        <SheetHeader>
          <SheetTitle>AI Generation History</SheetTitle>
        </SheetHeader>
        <ul className="menu p-4 min-h-full flex-nowrap overflow-auto gap-2">
          {history.map((version, index) => (
            <li key={index} className="mb-3 px-2">
              <button
                className={`card w-full bg-base-100 shadow-md cursor-pointer transition-all duration-200 ease-in-out ${index === historyIndex ? 'border-2 border-primary ring-2 ring-primary' : 'hover:shadow-lg hover:scale-[1.01]'}`}
                onClick={() => handleRollback(index)}
              >
                <div className="card-body p-3">
                  <h3 className="card-title text-sm">Version {index + 1}</h3>
                  <div className="text-xs text-base-content opacity-60 line-clamp-2 text-ellipsis break-words">
                    <iframe
                      title={`History Version ${index + 1}`}
                      srcDoc={version}
                      className="w-full h-24 border-none"
                    />
                  </div>
                </div>
              </button>
            </li>
          ))}
        </ul>
      </SheetContent>
    </Sheet>
  );
};

export default MailHistoryDrawer;
