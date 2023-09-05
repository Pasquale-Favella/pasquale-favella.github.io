import { GISCUS_CONFIG } from '@/config/giscus'
import Giscus from '@giscus/react'



const Comments = () => {

  return (
    <div className='my-8'>
      <Giscus {...GISCUS_CONFIG} theme={'transparent_dark'} />
    </div>
  )
}

export default Comments
