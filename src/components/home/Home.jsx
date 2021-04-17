import React from 'react'
import { PlayButton } from '../play-button'
import { PlayComputer } from '../play-computer-button';
import './style.css'

export function Home() {
    return (
        <div className='buttons'>
          <PlayButton />
          <PlayComputer />
        </div>
    )
}