import MailEditor from '@/components/MailEditor/MailEditor';
import { NextSeo } from 'next-seo';
import { VscGear, VscLock } from 'react-icons/vsc';

type Props = {};

const MailEditorPage: React.FC<Props> = () => {
  return (
    <>
      <NextSeo
        title="AI-Powered Mail Editor"
        description="Create and edit beautiful, responsive emails with the help of AI. Choose your provider, model, and generate templates."
      />
      <div className="text-center p-4">
        <h1 className="text-4xl font-bold">Craft Your Perfect Email with AI</h1>
        <p className="text-lg text-muted-foreground mt-2 max-w-2xl mx-auto">
          Let our AI assistant help you design beautiful, responsive emails in
          minutes. Use the <VscGear className="inline-block" /> icon to select
          your AI provider and enter your API key.
        </p>
        <div className="flex items-center justify-center gap-2 mt-4 text-sm text-muted-foreground">
          <VscLock />
          <span>
            Your API key is stored securely in your browser and is never sent to
            our servers.
          </span>
        </div>
      </div>
      <MailEditor />
    </>
  );
};

export default MailEditorPage;
