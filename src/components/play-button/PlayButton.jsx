import Button from 'react-bootstrap/Button';
import './style.css';
import { useHistory } from "react-router-dom";

export const PlayButton = () => {
    const history = useHistory();
    const goplay = () => history.push('game');

    return (
        <Button
            className='playButton' 
            variant="dark" 
            onClick={goplay}
            >
            Play with friend
        </Button>
    )
}