import React, { useState, useEffect } from 'react';
import useSound from 'use-sound';
import Tempo from './components/Tempo';
import axios from 'axios'

// Sound effects

import Sidestick from './ressources/Click.wav';
import Cowbell from './ressources/Cowbell.mp3';
import Woodblock from './ressources/Woodblock.mp3';


const API_KEY = '93f2be180a4be75f06c1a7d2829e8bbc'

export default function App() {

    const [play, setPlay] = useState(false)
    const [bpm, setBpm] = useState(120)
    const [tempoInterval, setTempoInterval] = useState(null)
    const [tapped, setTapped] = useState()
    const [light, setLight] = useState(false)
    const [soundEffect, setSoundEffect] = useState(Sidestick)
    const [debouncedBpm, setDebouncedBpm] = useState(bpm)
    const [songs, setSongs] = useState([])

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
        

    useEffect(() => {
      (async () => {
        const res = await axios.get(`https://api.getsongbpm.com/tempo/`, {
          headers: {
            Authorization: API_KEY,
          },
          params: {
          bpm: debouncedBpm
        }})
        setSongs(res.data)
        console.log(res.data)
      })()
    }, [debouncedBpm])

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
        </div> <br />
        <div className="bottom">
          ©Philippe De Hovre 2021
        </div>
        {/* <div>
            <SongList songs={songs}/>
        </div> */}
        </>
    )
}
