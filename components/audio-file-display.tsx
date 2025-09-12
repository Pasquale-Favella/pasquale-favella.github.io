import { IoVolumeMediumOutline } from "react-icons/io5";


interface AudioFileDisplayProps {
  fileUrl: string;
  fileName: string;
}

export function AudioFileDisplay({ fileUrl, fileName }: AudioFileDisplayProps) {
  return (
    <div className="relative p-3 rounded-lg border bg-base-100 shadow-sm max-w-fit">
      <div className="absolute top-2 right-2 p-1.5 rounded-full bg-base-100/30">
        <IoVolumeMediumOutline className="size-3.5 bg-primary" />
      </div>

      <audio src={fileUrl} className="hidden">
        Your browser does not support the audio element.
      </audio>

      <span className="text-sm text-base-200 font-medium pr-8 block truncate max-w-[200px]">
        {fileName}
      </span>
    </div>
  );
}
