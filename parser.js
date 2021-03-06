
inlets = 1
outlets = 3



function anything() {
	var arr = arrayfromargs(arguments);
	post(messagename);
	post('\n')
	try {
		eval(messagename)
	} catch (e) {
		outlet(2,1);
		post(e);
		post('\n')
	}
}

function clear() {
	for (var i=0;i<queue.length;i++) {
		queue[i]();
	}
	//queue.forEach(function(thisqueue) {
	//	thisqueue();
	//})
}

var _ms = 200;

function ms(time) {
	_ms = time
}

// ============================================================
// GENERATORS
// ============================================================

function rf(min, max) {
  if(!max && !min) {
    min = 0;
    max = 1;
  } else if(!max) {
    max = min;
    min = 0;
  }
  return function() {
    var _max = getValue(max)
    var _min = getValue(min)
    return Math.random() * (_max - _min) + _min;
  };
}

function ri(min, max) {
  if(!max) {
    max = min;
    min = 0;
  }
  return function() {
    var _max = getValue(max)
    var _min = getValue(min)
    return Math.floor( Math.random() * ((_max+1) - _min) + _min );
  };
}

// interpolate between two numbers over several steps.
// hang out at the `end` value once it is reached unless it repeats.

function count(start, end, step, repeat) {
  // safeguard against bad usage by returning zero
  if(start === undefined || end === undefined) {
    return function() { return 0; };
  }
  step = step || 1;
  if (repeat!==false) {
    repeat = true;
  }
  var current = false;
  var _start, _end, _step, direction;
  return function() {
    if (current===false) {
      _start = getValue(start)
      _end = getValue(end)
      _step = getValue(step)
      direction = _start < _end ? 1 : -1;
      current = _start
    } else {
      current += _step * direction;
    }
    var _current = current
    if (direction>0) {
      if (current >= _end) {
				if (repeat) {
	        current = false;
					_current = _end
				} else {
					current -= _step * direction;
				}

      }
    } else {
      if (current <= end) {
				if (repeat) {
        	current = false;
        	_current = _end
				} else {
					current -= _step * direction;
				}
      }
    }
    return _current;
  };
}

/*

if(current === iterations && !repeat) {
  return start + (current * ( (end - start) / iterations ));
} else if(current === iterations && repeat) {

  current = -1;
}
*/
function tri(start, end, step) {
  // safeguard against bad usage by returning zero
  if(start === undefined || end === undefined) {
    return function() { return 0; };
  }
  step = step || 1;

  var current = false;
  var _start, _end, _step, direction;

  return function() {
    if (current===false) {
      _start = getValue(start)
      _end = getValue(end)
      _step = getValue(step)
      direction = _start <= _end ? 1 : -1
      current = _start
    } else {
      current += _step * direction;
    }
    var _current = current
    if (_start<=_end) {
      if (current >= _end && direction == 1) {
        _current = _end
        direction *= -1
      } else if (current <= _start && direction == -1) {
        current = false;
        _current = _start
        direction *= -1
      }
    } else {
      if (current <= end && direction == -1) {
        _current = _end
        direction *= -1
      }else if (current >= _start && direction == 1) {
        current = false;
        _current = _start
        direction *= -1
      }
    }
    return _current;
  };
}

// choose an array item randomly
function pick() {
  if(!arguments.length) return function() { return 0; };

  var items = parseArguments(arguments);

  return function() {
    return getValue( items[ Math.floor( Math.random() * items.length ) ] );
  };
}


function ramp(destination, step) {
  // safeguard against bad usage by returning zero
  if(destination === undefined) {
    return function() { return 0; };
  }
  step = step || 1;
  var current = false;
  var _destination, _step, direction;
  return function() {
    if (current===false) {
      _start = getValue(start)
      _end = getValue(end)
      _step = getValue(step)
      direction = _start < _end ? 1 : -1;
      current = _start
    } else {
      current += _step * direction;
    }
    var _current = current
    if (direction>0) {
      if (current >= _end) {
        current = false;
        _current = _end
      }
    } else {
      if (current <= end) {
        current = false;
        _current = _end
      }
    }
    return _current;
  };
}



function sine(min, max, steps) {
  // safeguard against bad usage by returning zero
  if(min === undefined || max === undefined || steps === undefined) {
    return function() { return 0; };
  }

  var restart = true;

	var pattern = []

	var _min, _max, _steps;

	var counter;

  return function() {
    if (restart===true) {

			_steps = getValue(steps)

			_min = getValue(min);
			_max = getValue(max);

			if (_steps < 1) {
				_steps = 1
			} else if (_steps > 100) {
				_steps = 100
			}

			for (var i=0;i<_steps;i++) {
				var raw = ((Math.sin( (i/_steps)*Math.PI*2 )/2)+0.5)
				var value = raw * (_max-_min) + _min;
				value = Math.round(value);
				pattern.push(value)
			}

			counter = count(0,_steps,1)
			restart = false;

    }
		var index = getValue(counter);
		var _current = pattern[ index ];
    if (index >= _steps-1) {
      restart = true;
    }
    return _current;
  };
}



// new gens...
// cycle(1,2) or pattern(1,2,3)
// drunk ?


/**

PARSE ARGUMENTS

**/

// new method of array flattening
function parseArguments(args) {
  args = Array.prototype.slice.call(args);
  //var flattened = [];
  //args.forEach( function(item) {
  //  flattened = flattened.concat( item );
  //});
  //return flattened;
  return args;
}

function getValue(v) {

  var value = false;

	if(typeof v === 'function') {
    value = v();
  } else if (Array.isArray(v)){
    value = []
    v.forEach(function(preval) {
      value.push( getValue(preval) )
    })
  } else {
    value = v;
  }
  return value

}





/**

Cycle

**/

var Cycle = function(pattern) {
  this.pattern = pattern;
  this.position = -1;
  this.direction = 1;
  this.value;
  this.length = this.pattern.length;
}

Cycle.prototype.next = function() {
	try {
		this.position += this.direction;
	  var previous = this.position;
	  this.position %= this.pattern.length;

		if(typeof this.pattern[this.position] === 'function') {
	      this.value = this.pattern[this.position]();
	  } else {
	    this.value = this.pattern[this.position];
	  }

	  if (this.position===this.pattern.length-1) {
	    //this.render();
	  	this.done();
	  }

		return this.value;
	} catch(e) {

	}
}

Cycle.prototype.update = function(values) {
  this.pattern = values;
  this.length = this.pattern.length;
}

Cycle.prototype.done = function() { }








//
// SOUND DESCRIPTION
//

function SoundDescription(args) {
  this.pattern = parseArguments(args)
  this.velocities = [1]
  this.durations = [100]
  this._beats = [1]
  this._after = [0]
  this._before = [0]
  this._loop = false
  this._rev = false;

  this.notes = function() {
    this.pattern = parseArguments(arguments);
    return this;
  }
  this.dur = function() {
    this.durations = parseArguments(arguments);
    return this;
  }
  this.beat = function() {
    this._beats = parseArguments(arguments);
    return this;
  }
  this.vol = function() {
    this.velocities = parseArguments(arguments);
    return this;
  }
  this.loop = function() {
    this._loop = parseArguments(arguments);
    return this;
  }
  this.after = function() {
    this._after = parseArguments(arguments);
    return this;
  }
  this.before = function() {
    this._before = parseArguments(arguments);
    return this;
  }
  this.rev = function() {
    this._rev = parseArguments(arguments);
    return this;
  }
  this.inv = function() {
    this._inv = parseArguments(arguments);
    return this;
  }
  this.trans = function() {
    this._trans = parseArguments(arguments);
    return this;
  }
  this.cycle = function() {
    this._cycle = parseArguments(arguments);
    return this;
  }
  this.rotate = function() {
    this._rotate = parseArguments(arguments);
    return this;
  }
  this.mode = function() {
    this._mode = parseArguments(arguments);
    return this;
  }
  this.skip = function() {
    this._skip = parseArguments(arguments);
    return this;
  }
  this.block = function() {
    this._block = parseArguments(arguments);
    return this;
  }
  this.rep = function() {
    this._repeat = parseArguments(arguments);
    return this;
  }

}

function sound() {
  var _sd = new SoundDescription(arguments);
  return _sd;
}


var silence = sound();






/**

Sound

**/

var Sound = function() {
  this.original = new Cycle( [1] );
  this.beats = new Cycle( [1] );
  this.durations = new Cycle( [1] );
  this.velocities = new Cycle( [1] );
  this.wait = 0;
  this.before = 0;
  this.after = 0;
  return this;
}

Sound.prototype.next = function() {
  if (this.before>0) {
    this.before--;
    return false;
  }
  if (this.after>0) {
    this.after--;
    if (this.after==0) {
      this.done();
    }
    return false;
  }
  if (this.wait>0) {
    this.wait--;
    return false;
  } else {
    var note = this.pattern.next();
    if (Array.isArray(note)) {
      note.forEach(function(thisnote) {
        thisnote += this.transposition
      })
    } else {
      note += this.transposition;
      note = [note];
    }
    var beats = this.beats.next();
    var vel = this.velocities.next();
    var dur = this.durations.next();
    this.wait += (beats-1);
    return [note, vel, dur];
  }
};

Sound.prototype.load = function(settings) {

    this.original.update( settings.pattern );
    this.beats.update( settings._beats );
    this.durations.update( settings.durations );
    this.velocities.update( settings.velocities );
    this.transposition = 0;
    this.wait = 0;


    // rotate
    if (settings._rotate) {
      this.rotation = new Cycle( settings._rotate )
      var amount = this.rotation.next();

      amount %= this.original.pattern.length;
      if (amount < 0) {
        amount = this.original.pattern.length + amount;
      }
      var cut = this.original.pattern.splice( this.original.pattern.length - amount, amount );
      this.original.update( cut.concat( this.original.pattern ) );
      settings.pattern = this.original.pattern;
    }

    var patt = this.original.pattern.slice(0)


    // loop
    if (settings._loop) {

        this.loopStart = new Cycle( [ settings._loop[0] ] )
        this.loopEnd = new Cycle( [ settings._loop[1] ] )

        patt = patt.slice( this.loopStart.next(), this.loopEnd.next() )

    }



    //after and before
    if (!settings._before) {
      settings._before = [ 0 ]
    }
    if (!settings._after) {
      settings._after = [ 0 ]
    }

    this.beforeGen = new Cycle( settings._before );
    this.before = this.beforeGen.next();

    this.afterGen = new Cycle( settings._after );



    // rev

    if (settings._rev) {

          this.reverse = new Cycle( settings._rev)

        //  var question = this.reverse.next();

          if (this.reverse.next()) {
            patt = patt.reverse();
          }
    }


    // inv


    // trans
    if (settings._trans) {

        this.trans = new Cycle( settings._trans)
        this.transposition = this.trans.next()

    }


    // repeat
    if (settings._repeat) {

        this.repetition = new Cycle( settings._repeat)
        var repetitions = this.repetition.next()
        var base = patt.slice(0)
        for (var i=0;i<repetitions;i++) {
          patt = patt.concat(base);
        }

    }


    // avoid
    // mode
    // skip
    // block




    // load into this.pattern

    this.pattern = new Cycle( patt );
    this.pattern.done = function() {
      this.after = this.afterGen.next() + this.beats.next() - 1;
      if(this.after == 0) {
        this.done()
      }
    }
    this.pattern.done = this.pattern.done.bind(this)

}
















// ============================================================
// QUEUE
// ============================================================

var numberOfQueues = 10;

function Queue() {
  this.pattern = new Cycle( [] );
  this.sound = false;
}

Queue.prototype.update = function() {

	// test for undefined ones... and don't use them.

  var sounds = parseArguments(arguments)
  /*var newsounds = []
  for (var i=0;i<sounds.length;i++) {
    var newsound = new Sound();
    newsound.load(sounds[i])
    newsounds.push(newsound);
  } */

	 post("====")
	 post(sounds.length)
	 var faulty = false;
	 for (var i=0;i<sounds.length;i++) {
		post(sounds[i].constructor == SoundDescription);
 		// post(typeof sounds[i] != "function");
		if (sounds[i].constructor != SoundDescription && typeof sounds[i] != "function") {
			faulty = true;
		}
		//if (sounds[i] == undefined) {
		//	return;
		//}
		//if (sounds[i].)
	 }
	 if (!faulty) {
	   post("\n updating pattern \n");
		 this.pattern.update( sounds );
	 	 if (!this.sound) {
	 		 this.createSound();
	 	 }
	 }

  	//var self = this;

	// this.pattern is a cycle of Sound objects
	// this.pattern.pattern is the actual array of Sound objects
  // this.pattern.value is a single Sound object (current)
  // this.pattern.value.pattern is the current Sound object's Cycle of notes

  /* // WHEN a sound ends, move to the next sound
  for (var i=0;i<this.pattern.pattern.length;i++) {
  	this.pattern.pattern[i].pattern.done = function() {
      self.sound = new Sound()
      self.sound.load( self.pattern.next() );
      console.log(self.sound);
  	}
  } */

  // IF the queue just started, move to the first sound


}

Queue.prototype.createSound = function() {
	var nextsound = this.pattern.next()
	if (!nextsound) {
		nextsound = sound()
	}
  this.sound = new Sound()
  this.sound.load( nextsound );
  this.sound.done = this.createSound.bind(this);
}

Queue.prototype.next = function() {
  // pattern.value is a Sound object
  // so this gets the next note/velo pair in a sound
  // = Sound.next()
	return this.sound.next();
}








var Queues = []

for (var i=0;i<numberOfQueues;i++) {
	Queues.push( new Queue() );
}



var queue = []

for (var i=0;i<numberOfQueues;i++) {
	queue.push( Queues[i].update.bind(Queues[i]) );
}








function bang() {

	outlet(1, getValue(_ms) );

	for (var i=0;i<Queues.length;i++) {
		try {
			if (Queues[i].pattern.pattern.length) {

	      var note = Queues[i].next()

	      if (note) {
	        var vel = note[1]
	        var dur = note[2]
	        note[0].forEach(function(thisnote) {
						thisnote = getValue(thisnote);

						outlet(0, [ thisnote, vel, dur] )
	        })
	      }

			}
		} catch(e) {
			post('PROBLEM\n')
		}
	}
}
