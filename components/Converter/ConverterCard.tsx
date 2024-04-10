import { FC } from "react"
import { BiError } from "react-icons/bi";
import { MdDone } from "react-icons/md";
import { HiOutlineDownload } from "react-icons/hi";
import { RiDeleteBinLine } from "react-icons/ri";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../Select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../Tabs';
import { ConverterAction } from "@/types"
import { ConverterUtils } from "@/utils";
import { useStateWithPartialUpdates } from "@/hooks/use-stateWithPartialUpdate";

type ConverterCardProps = {
    action: ConverterAction,
    onRemove: ()=> void,
    onToFileTypeChange: (to: String)=> void
}

const ConverterCard: FC<ConverterCardProps> = ({ action , onRemove , onToFileTypeChange}) => {

    const DEFAULT_TAB = "video";

    const [{selected , defaultValues}, stateChange] = useStateWithPartialUpdates({
        selected : '',
        defaultValues : DEFAULT_TAB
    });

    const Icon = ConverterUtils.fileToIcon(action.fileType);

    return (

        <div className="rounded-xl border bg-card text-card-foreground shadow p-4">
            <div className="flex items-center justify-between space-x-4 flex-col sm:flex-row gap-4">
                <div className="flex items-center space-x-4">
                    <Icon className="relative flex h-10 w-10 shrink-0 overflow-hidden" />
                    <div className='flex flex-col items-start justify-center'>
                        <span className="text-sm font-medium truncate">{ConverterUtils.compressFileName(action.fileName)}</span>
                        <span className="text-sm">({ConverterUtils.bytesToSize(action.fileSize)})</span>
                    </div>
                </div>

                <div className="flex items-center justify-between space-x-4 ">

                    {action.isError ? (

                        <div className="badge badge-error gap-2">
                            <span>Error Converting File</span>
                            <BiError />
                        </div>

                    ) : action.isConverted ? (

                        <div className="badge badge-success gap-2">
                            <span>Done</span>
                            <MdDone />
                        </div>

                    ) : action.isConverting ? (

                        <div className="badge badge-outline gap-2">
                            <span>Converting</span>
                            <span className="loading loading-spinner w-4"></span>
                        </div>

                    ) : (
                        <div className="flex items-center gap-2">
                            <span className='text-sm'>Convert to</span>
                            <Select
                                onValueChange={(value) => {
                                    stateChange({
                                        selected : value ,
                                        defaultValues : ConverterUtils.allowedExtensions.audio.includes(value) 
                                                        ? 'audio'
                                                        : ConverterUtils.allowedExtensions.video.includes(value)
                                                        ? 'video'
                                                        : DEFAULT_TAB
                                    })
                                    onToFileTypeChange(value);
                                }}
                                value={selected}
                            >
                                <SelectTrigger className="w-32 outline-none focus:outline-none focus:ring-0 text-center bg-base-100 text-md font-medium">
                                    <SelectValue placeholder="..." />
                                </SelectTrigger>
                                <SelectContent className="h-fit">
                                    {action.fileType.includes("image") && (
                                        <div className="grid grid-cols-2 gap-2 w-fit">
                                            {ConverterUtils.allowedExtensions.image.map((elt, i) => (
                                                <div key={i} className="col-span-1 text-center">
                                                    <SelectItem value={elt} className="mx-auto">
                                                        {elt}
                                                    </SelectItem>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    {action.fileType.includes("video") && (
                                        <Tabs defaultValue={defaultValues} className="w-full">
                                            <TabsList className="w-full">
                                                <TabsTrigger value="video" className="w-full">
                                                    Video
                                                </TabsTrigger>
                                                <TabsTrigger value="audio" className="w-full">
                                                    Audio
                                                </TabsTrigger>
                                            </TabsList>
                                            <TabsContent value="video">
                                                <div className="grid grid-cols-3 gap-2 w-fit">
                                                    {ConverterUtils.allowedExtensions.video.map((elt, i) => (
                                                        <div key={i} className="col-span-1 text-center">
                                                            <SelectItem value={elt} className="mx-auto">
                                                                {elt}
                                                            </SelectItem>
                                                        </div>
                                                    ))}
                                                </div>
                                            </TabsContent>
                                            <TabsContent value="audio">
                                                <div className="grid grid-cols-3 gap-2 w-fit">
                                                    {ConverterUtils.allowedExtensions.audio.map((elt, i) => (
                                                        <div key={i} className="col-span-1 text-center">
                                                            <SelectItem value={elt} className="mx-auto">
                                                                {elt}
                                                            </SelectItem>
                                                        </div>
                                                    ))}
                                                </div>
                                            </TabsContent>
                                        </Tabs>
                                    )}
                                    {action.fileType.includes("audio") && (
                                        <div className="grid grid-cols-2 gap-2 w-fit">
                                            {ConverterUtils.allowedExtensions.audio.map((elt, i) => (
                                                <div key={i} className="col-span-1 text-center">
                                                    <SelectItem value={elt} className="mx-auto">
                                                        {elt}
                                                    </SelectItem>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </SelectContent>
                            </Select>
                        </div>
                    )}

                    {action.isConverted ? (
                        <button className="btn btn-sm btn-ghost gap-1" onClick={() => ConverterUtils.download(action)}>
                            Download
                            <HiOutlineDownload />
                        </button>
                    ) : (
                        <button className="btn btn-circle btn-ghost btn-sm" onClick={() => onRemove()}>
                           <RiDeleteBinLine/>
                        </button>
                    )}

                </div>
            </div>

        </div>
       
    )
}

export default ConverterCard