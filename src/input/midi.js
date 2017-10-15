import MIDIFile from 'midifile'
import fs from 'fs'
import Promise from 'bluebird'
import harmonics from 'chamberlib/dist/harmonics'
import events from 'chamberlib/dist/events'

class MIDI {
  static readFile (filename) {
    return Promise.promisify(fs.readFile)(filename)
      .then(function (buffer) {
        const ab = new ArrayBuffer(buffer.length),
          view = new Uint8Array(ab)
        for (let i = 0; i < buffer.length; ++i) {
          view[i] = buffer[i]
        }
        const midiFile = new MIDIFile(ab),
          header = midiFile.header,
          time = {}
        switch (midiFile.header.getTimeDivision()) {
          case MIDIFile.Header.FRAMES_PER_SECONDS:
            time.type = 'fps'
            time.frames = header.getSMPTEFrames()
            time.ticksPerFrame = header.getTicksPerFrame()
            break
          case MIDIFile.Header.TICKS_PER_BEAT:
            time.type = 'tpb'
            time.resolution = header.getTickResolution()
            time.ticksPerBeat = header.getTicksPerBeat()
            break
        }
        const midiEvents = midiFile.getEvents(),
          openEvents = [],
          tracks = new Array(midiFile.header.getTracksCount())
            .fill(null).map(() => { return [] })
        midiEvents.forEach(event => {
          let out = null
          if (event.type === 8) {
            event.track = event.track || 0
            out = Object.assign({}, event)
            if (out && typeof out.playTime === 'number') {
              if (event.subtype === 9) { // note on
                openEvents.push(out)
              }
              else if (event.subtype === 8) { // note off
                let on = null, index = 0
                while (index < openEvents.length && !on) {
                  const evt = openEvents[index]
                  if (evt.track === out.track && evt.param1 === out.param1 && evt.param2 === out.param2) {
                    on = openEvents.splice(index, 1)[0]
                  }
                  index++
                }
                if (on) {
                  const note = new harmonics.Note()
                  note.fromMidi(on.param1)
                  note.velocity = on.param2
                  const te = new events.TonalEvent(`${on.playTime} ms`, note, `${event.playTime - on.playTime}`)
                  tracks[out.track].push(te)
                }
              }
            }
            else {
              console.log('Missing ms time on midi event')
            }
          }
        })
        return { tracks, time }
      })
  }
}

export default MIDI
