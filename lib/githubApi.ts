import axios from "axios";

const api = axios.create({
    baseURL: 'https://api.github.com/',
    auth:{
        username : process.env.NEXT_PUBLIC_GITHUB_CLIENTID || '',
        password : process.env.NEXT_PUBLIC_GITHUB_SECRET || ''
    },
    headers: {
            
        Accept: 'application/vnd.github.v3.text-match+json',
        
    }
});

export default api;