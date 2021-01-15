import React from 'react'
import './Tempo.css'

export default function Tempo({ 
  bpm, 
  setBpm, 
  startClick, 
  tapTempo, 
  light, 
  isPlaying, 
  soundEffect, 
  setSoundEffect,
}) {

const styleLeft = {
    backgroundColor: 'salmon',
}
const styleRight = {
    backgroundColor: 'salmon',
    }

const injectSpan = {
    gridColumnStart: 'span 2'
}

const soundEffects = ['sidestick', 'cowbell', 'woodblock']
const renderedSoundEffects = soundEffects.map(effect => {
    return (
        <option 
          key={effect} 
          className="item" 
          value={effect}>{`${effect[0].toUpperCase()}${effect.slice(1)}`}</option>
    )
  })
  
return (

  <div >
    <div className="metronome-box">
      <div className="ui header" style={injectSpan}>
        <h1 className="ui small header">
          <i className="play icon"></i>
            METRONOME
        </h1>
      </div>
        <div 
          className="beep left"
          style={light && isPlaying? styleLeft : null}
        >
        </div>
          <div 
            className="beep right"
            style={!light && isPlaying? styleRight : null}
            >
          </div>
          <input 
            style={injectSpan}
            type="number" 
            className="ui header bpm-display" 
            value={bpm} 
            min="40" max="220" 
            onChange={(e) => setBpm(Number(e.target.value))}
          />
          <label value="tempo selection slider"></label>
          <input 
              className="ui range" 
              style={injectSpan} 
              type="range" 
              min="40" 
              max="220" 
              value={bpm} 
              onChange={(e)=> {setBpm(Number(e.target.value))}}/>
          <label value="sound selection"></label>
            <select className="ui dropdown" style={injectSpan} value={soundEffect} onChange={(e) => {setSoundEffect(e.target.value)}}>
              {renderedSoundEffects}
            </select>
          <button className="ui button" onClick={e => setBpm(bpm - 1)} >-</button>
          <button className="ui button" onClick={e => setBpm(bpm + 1)} >+</button>
          <button className="ui button icon" onClick={startClick}>
            <i className="play icon"></i>
          </button>
          <button className="ui button"  onClick={tapTempo}>
            Tap
          </button>
    </div>
  </div>
 )
}
