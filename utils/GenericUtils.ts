
const uid = ()=> crypto.getRandomValues(new Uint32Array(1)).toString()

const returnBase64FromFile = async(file: File) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function(event) {
            return  resolve(event.target?.result);
        };
        reader.onerror = error => reject(error);
    })
}

export default {
    uid ,
    returnBase64FromFile
} as const