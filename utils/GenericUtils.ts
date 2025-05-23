
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

const extractFirstPhrase = (str : string) =>  {
    // Find the index of the first period (.)
    const periodIndex = str.indexOf('.');
  
    // Extract the first phrase up to the period (if found)
    const firstPhrase = periodIndex !== -1 ? str.substring(0, periodIndex) : str;
  
    // Remove leading and trailing spaces
    const trimmedPhrase = firstPhrase.trim();
  
    return trimmedPhrase;
}

const withRetry = async <T>(fn: () => Promise<T>, retries = 3, delay = 1000): Promise<T> => {
    try {
      return await fn();
    } catch (error) {
      if (retries > 0) {
        await new Promise(resolve => setTimeout(resolve, delay));
        return withRetry(fn, retries - 1, delay);
      } 
      throw error;
    }
};

export default {
    uid ,
    returnBase64FromFile ,
    extractWords ,
    extractFirstPhrase ,
    withRetry
} as const