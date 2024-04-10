import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile , toBlobURL} from '@ffmpeg/util';
import { IconType } from 'react-icons';
import {
    BsFillImageFill,
    BsFileEarmarkTextFill,
    BsFillCameraVideoFill,
} from 'react-icons/bs';
import { AiFillFile } from 'react-icons/ai';
import { PiSpeakerSimpleHighFill } from 'react-icons/pi';
import { ConverterAction } from '@/types';

const bytesToSize = (bytes: number): String => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  
    if (bytes === 0) return '0 Byte';
  
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    const size = (bytes / Math.pow(1024, i)).toFixed(2);
  
    return `${size} ${sizes[i]}`;
}

const compressFileName = (fileName: any): string => {
    // Define the maximum length for the substring
    const maxSubstrLength = 18;
  
    // Check if the fileName is longer than the maximum length
    if (fileName.length > maxSubstrLength) {
      // Extract the first part of the fileName (before the extension)
      const fileNameWithoutExtension = fileName.split('.').slice(0, -1).join('.');
  
      // Extract the extension from the fileName
      const fileExtension = fileName.split('.').pop();
  
      // Calculate the length of characters to keep in the middle
      const charsToKeep =
        maxSubstrLength -
        (fileNameWithoutExtension.length + fileExtension.length + 3);
  
      // Create the compressed fileName
      const compressedFileName =
        fileNameWithoutExtension.substring(
          0,
          maxSubstrLength - fileExtension.length - 3,
        ) +
        '...' +
        fileNameWithoutExtension.slice(-charsToKeep) +
        '.' +
        fileExtension;
  
      return compressedFileName;
    }
    // If the fileName is shorter than the maximum length, return it as is
    return fileName.trim();
}

function getFileExtension(file_name: string) {
  const regex = /(?:\.([^.]+))?$/; // Matches the last dot and everything after it
  const match = regex.exec(file_name);
  if (match && match[1]) {
    return match[1];
  }
  return ''; // No file extension found
}

function removeFileExtension(file_name: string) {
  const lastDotIndex = file_name.lastIndexOf('.');
  if (lastDotIndex !== -1) {
    return file_name.slice(0, lastDotIndex);
  }
  return file_name; // No file extension found
}

const convert = async (
  ffmpeg: FFmpeg,
  action: ConverterAction,
): Promise<any> => {
  const { file, to, fileName, fileType } = action;
  const input = getFileExtension(fileName);
  const output = removeFileExtension(fileName) + '.' + to;
  ffmpeg.writeFile(input, await fetchFile(file));

  // FFMEG COMMANDS
  let ffmpeg_cmd: any = [];
  // 3gp video
  if (to === '3gp')
    ffmpeg_cmd = [
      '-i',
      input,
      '-r',
      '20',
      '-s',
      '352x288',
      '-vb',
      '400k',
      '-acodec',
      'aac',
      '-strict',
      'experimental',
      '-ac',
      '1',
      '-ar',
      '8000',
      '-ab',
      '24k',
      output,
    ];
  else ffmpeg_cmd = ['-i', input, output];

  // execute cmd
  await ffmpeg.exec(ffmpeg_cmd);

  const data = (await ffmpeg.readFile(output)) as any;
  const blob = new Blob([data], { type: fileType.split('/')[0] });
  const url = URL.createObjectURL(blob);
  return { url, output };
}

const fileToIcon = (file_type: any): IconType => {
    if (file_type.includes('video')) return BsFillCameraVideoFill;
    if (file_type.includes('audio')) return PiSpeakerSimpleHighFill;
    if (file_type.includes('text')) return BsFileEarmarkTextFill;
    if (file_type.includes('image')) return BsFillImageFill;
    else return AiFillFile;
}

const loadFFmpeg = async (): Promise<FFmpeg> => {
    const ffmpeg = new FFmpeg();
    const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.2/dist/umd';
    await ffmpeg.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
      wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
    });
    return ffmpeg;
}

const allowedExtensions = {
  image: [
    "jpg",
    "jpeg",
    "png",
    "gif",
    "bmp",
    "webp",
    "ico",
    "tif",
    "tiff",
    "svg",
    "raw",
    "tga",
  ],
  video: [
    "mp4",
    "m4v",
    "mp4v",
    "3gp",
    "3g2",
    "avi",
    "mov",
    "wmv",
    "mkv",
    "flv",
    "ogv",
    "webm",
    "h264",
    "264",
    "hevc",
    "265",
  ],
  audio: ["mp3", "wav", "ogg", "aac", "wma", "flac", "m4a"],
};

const download = (action: ConverterAction) => {
  const a = document.createElement("a");
  a.style.display = "none";
  a.href = action.url;
  a.download = action.output;

  document.body.appendChild(a);
  a.click();

  // Clean up after download
  URL.revokeObjectURL(action.url);
  document.body.removeChild(a);
};

export default {
    bytesToSize ,
    compressFileName ,
    convert ,
    fileToIcon ,
    loadFFmpeg ,
    allowedExtensions ,
    download
} as const