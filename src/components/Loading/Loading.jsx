import {AiOutlineLoading} from 'react-icons/ai'
import './loading.css'

const Loading = ({message}) => {
  return(
    <div className="loading">
      <AiOutlineLoading size = {150}/>
      <h2>{message}</h2>
    </div>
  )
}

export default Loading;