import './style.css'
import FlagIcon from '@material-ui/icons/Flag';

export function Clock() {
    
    return (
        <div className="clock-container">
            <div className='clock-top'>
                <div className="time">
                    05 <span className='sep'>:</span> 00
                </div>
            </div>
            <div className='icons'>
                <span className='draw'>½</span>
                <span className='resign'><FlagIcon className='flag' /></span>
            </div>
            <div className='clock-bottom'>
                <div className="time">
                    05 <span className='sep'>:</span> 00
                </div>
            </div>
        </div>
    )
}