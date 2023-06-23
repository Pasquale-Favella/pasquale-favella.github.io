
const uid = ()=> crypto.getRandomValues(new Uint32Array(1)).toString()

const returnBase64FromFile = async(file: File) : Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function(event) {
            return resolve(event.target?.result as string);
        };
        reader.onerror = error => reject(error);
    })
}

const extractWords = (text : string , wordsAmount : number) => {
    const words = text.trim().split(/\s+/);
    const preview = words.slice(0, wordsAmount).join(' ');
    return preview;
  };

export default {
    uid ,
    returnBase64FromFile ,
    extractWords
} as const