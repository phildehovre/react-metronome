import React, { useState, useEffect } from 'react';
import useSound from 'use-sound';
import Tempo from './components/Tempo';
import SongList from './components/SongList';
import Sidestick from './ressources/Click.wav';
import Cowbell from './ressources/Cowbell.mp3';
import Woodblock from './ressources/Woodblock.mp3';
import axios from 'axios';


// const clientId = '1b6e57ce73a04adba0cb72a6173d6604'
// const clientSecret = '3bf95ba17c284904861793c63188b074'

export default function App() {

    const [play, setPlay] = useState(false)
    const [bpm, setBpm] = useState(120)
    const [tempoInterval, setTempoInterval] = useState(null)
    const [tapped, setTapped] = useState()
    const [light, setLight] = useState(false)
    const [soundEffect, setSoundEffect] = useState(Sidestick)
    const [debouncedBpm, setDebouncedBpm] = useState(bpm)

    const [cowbell] = useSound(Cowbell)
    const [woodblock] = useSound(Woodblock)
    const [sidestick] = useSound(Sidestick)

    // Tap Tempo Logic:

    const tapTempo = () => {
        if (tapped) {
            let elapsed = (new Date().getTime()) - tapped
            if (elapsed < 3000) {
                const tappedBpm = Math.round((6000/elapsed)*10)
                setBpm(tappedBpm)
            }
            else {
                setTapped(new Date().getTime())
            } 
        } 
        setTapped(new Date().getTime())

    } 

    // Tempo selection range limiter:

    const checkBpm = () => {
        if (bpm <= 40) {
            setBpm(40)
        } else if (bpm >= 220) {
            setBpm(220)
        }
    }  

    const playSound = () => {
        if (soundEffect === 'cowbell') {
            cowbell()
        } else if (soundEffect === 'woodblock') {
            woodblock()
        } else {
            sidestick()
        }
    }
        
    
    // Sound and Visual:

    const trigger = (duration) => {
        if (play) {
            playSound()
            setLight(!true)
            setTimeout(() => {setLight(!false)}, duration/2)
        } else {
            return;
        }
    }
    
    const startClick = () => {
        setPlay(!play)      
    }
    
    // Tempo setter:

    useEffect(() => {
        const intervalId = setInterval(() => {
            trigger(tempoInterval);
        }, tempoInterval)

        return (() => {clearInterval(intervalId)})
    }, [play, tempoInterval, soundEffect ])
    

    useEffect(() => {
        setTempoInterval((60/bpm)*1000);
        checkBpm();
        const intervalId = setTimeout(() => {
            setDebouncedBpm(bpm)
            }, 1000);
        return (() => {
            (clearTimeout(intervalId))
        })
    }, [bpm])
        
    

    return (
        <>
        <div className="metronome">
            <Tempo 
                bpm={bpm} 
                setBpm={setBpm} 
                startClick={startClick} 
                tapTempo={tapTempo}
                light={light}
                isPlaying={play}
                setSoundEffect={setSoundEffect}
                soundEffect={soundEffect}
                />
        </div> <hr className="ui divider"/>
        <div className="ui container song-list">
            <SongList />
        </div>
        </>
    )
}
