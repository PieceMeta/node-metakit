'use strict';

exports.__esModule = true;

var _midifile = require('midifile');

var _midifile2 = _interopRequireDefault(_midifile);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _harmonics = require('chamberlib/dist/harmonics');

var _harmonics2 = _interopRequireDefault(_harmonics);

var _events = require('chamberlib/dist/events');

var _events2 = _interopRequireDefault(_events);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class MIDI {
  static readFile(filename) {
    return _bluebird2.default.promisify(_fs2.default.readFile)(filename).then(function (buffer) {
      const ab = new ArrayBuffer(buffer.length),
            view = new Uint8Array(ab);
      for (let i = 0; i < buffer.length; ++i) {
        view[i] = buffer[i];
      }
      const midiFile = new _midifile2.default(ab),
            header = midiFile.header,
            time = {};
      switch (midiFile.header.getTimeDivision()) {
        case _midifile2.default.Header.FRAMES_PER_SECONDS:
          time.type = 'fps';
          time.frames = header.getSMPTEFrames();
          time.ticksPerFrame = header.getTicksPerFrame();
          break;
        case _midifile2.default.Header.TICKS_PER_BEAT:
          time.type = 'tpb';
          time.resolution = header.getTickResolution();
          time.ticksPerBeat = header.getTicksPerBeat();
          break;
      }
      const midiEvents = midiFile.getEvents(),
            openEvents = [],
            tracks = new Array(midiFile.header.getTracksCount()).fill(null).map(() => {
        return [];
      });
      midiEvents.forEach(event => {
        let out = null;
        if (event.type === 8) {
          event.track = event.track || 0;
          out = Object.assign({}, event);
          if (out && typeof out.playTime === 'number') {
            if (event.subtype === 9) {
              // note on
              openEvents.push(out);
            } else if (event.subtype === 8) {
              // note off
              let on = null,
                  index = 0;
              while (index < openEvents.length && !on) {
                const evt = openEvents[index];
                if (evt.track === out.track && evt.param1 === out.param1 && evt.param2 === out.param2) {
                  on = openEvents.splice(index, 1)[0];
                }
                index++;
              }
              if (on) {
                const note = new _harmonics2.default.Note();
                note.fromMidi(on.param1);
                note.velocity = on.param2;
                const te = new _events2.default.TonalEvent(`${on.playTime} ms`, note, `${event.playTime - on.playTime}`);
                tracks[out.track].push(te);
              }
            }
          } else {
            console.log('Missing ms time on midi event');
          }
        }
      });
      return { tracks, time };
    });
  }
}

exports.default = MIDI;