import { GISCUS_CONFIG } from '@/config/giscus'
import { useRef , useEffect , useState} from 'react'
import Giscus from '@giscus/react'



const Comments = () => {

  const mountRef = useRef(false);

  const [giscusTheme , setGiscusTheme] = useState('dark');

  useEffect(() => {

    if(mountRef.current) return;

   const current =  document.documentElement.getAttribute('data-theme');

   if(current) setGiscusTheme(current)

    mountRef.current = true;
  }, []);

  
  if (!mountRef.current) return null


  return (
    <div className='my-8'>
      <Giscus {...GISCUS_CONFIG} theme={giscusTheme} />
    </div>
  )
}

export default Comments
