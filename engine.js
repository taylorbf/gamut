

// ============================================================
// SETUP
// ============================================================

inlets = 1;
outlets = 1;


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
    return Math.random() * (max - min) + min;
  };
}

function ri(min, max) {
  if(!max) {
    max = min;
    min = 0;
  }
  return function() {
    return Math.floor( Math.random() * ((max+1) - min) + min );
  };
}

// interpolate between two numbers over several steps.
// hang out at the `end` value once it is reached unless it repeats.

function counter(start, end, iterations, repeat) {
  // safeguard against bad usage by returning zero
  if(start === undefined || end === undefined || !iterations) {
    return function() { return 0; };
  }
  if (repeat!==false) {
    repeat = true;
  }

  iterations--;
  var current = -1;
  return function() {
    if(current === iterations && !repeat) {
      return start + (current * ( (end - start) / iterations ));
    } else if(current === iterations && repeat) {
      current = -1;
    }
    current++;
    return start + (current * ( (end - start) / iterations ));
  };
}

function bounce(start, end, iterations) {
  if(start === undefined || end === undefined || !iterations) {
    return function() { return 0; };
  }

  iterations--;
  var current = 0;
  var direction = -1;
  return function() {
    var result = start + (current * ( (end - start) / iterations ));
    if(current === 0 || current === iterations ) {
      direction *= -1;
    }
    current += direction;
    return result;
  };
}

// choose an array item randomly
function pick() {
  if(!arguments.length) return function() { return 0; };

  var items = parseArguments(arguments);

  return function() {
    return items[ Math.floor( Math.random() * items.length ) ];
  };
}





/**

PARSE ARGUMENTS

**/

// new method of array flattening
function parseArguments(args) {
  args = Array.prototype.slice.call(args);
  var flattened = [];
  args.forEach( function(item) {
    flattened = flattened.concat(item);
  });
  return flattened;
}


/**

Cycle

**/

var Cycle = function(pattern) {
  this.pattern = pattern;
  this.position = -1;
  this.direction = 1;
  this.low = 0
  this.high = this.pattern.length-1;
  this.value;
}

Cycle.prototype.next = function(cb) {
	this.position += this.direction;
	if (this.position < this.low) {
		this.position = this.high+1;
	} else if (this.position > this.high) {
		this.position = this.low-1;
	}
	if(typeof this.pattern[this.position] === 'function') {
      this.value = this.pattern[this.position]();
    } else {
      this.value = this.pattern[this.position];
    }
	return this.value;
	if (this.position > this.high || this.position < this.low) {
		this.done();
	}
}

Cycle.prototype.update = function(values) {
  this.pattern = values;
}

Cycle.prototype.loop = function(low,high) {
  	this.low = low;
	this.high = high;
}

Cycle.prototype.done = function() {}

/**

Define Sound

**/

var Sound = function() {
  this.pattern = new Cycle( parseArguments(arguments[0]));
  this.durations = new Cycle( [1] );
  this.velocities = new Cycle( [1] );
  this.wait = 0;
  return this;
}

Sound.prototype.next = function() {
  if (this.wait>0) {
    this.wait--;
    return false;
  } else {
    var note = this.pattern.next();
    var dur = this.durations.next();
    var vel = this.velocities.next();
    this.wait += (dur-1);
    return [note, vel];
  }
};

Sound.prototype.notes = function() {
  this.pattern = new Cycle( parseArguments(arguments) );
  return this;
}

Sound.prototype.dur = function() {
  this.durations.update(parseArguments(arguments));
  return this;
}

Sound.prototype.vol = function() {
  this.velocities.update(parseArguments(arguments));
  return this;
}

Sound.prototype.loop = function() {
  this.pattern.loop(parseArguments(arguments));
  return this;
}


function sound() {
  var _gen = new Sound(arguments);
  return _gen;
}














// ============================================================
// QUEUE
// ============================================================

var numberOfQueues = 10;

function Queue() {
  this.pattern = new Cycle( [] );
}

Queue.prototype.update = function() {

	this.pattern.update( parseArguments(arguments) );
	// this.pattern is a cycle of Sound objects
	// this.pattern.pattern is the Sound's cycle of notes.
	this.pattern.pattern.done = function() {
		this.pattern.next();
	}
	post(this.pattern.pattern);
		
}
Queue.prototype.next = function() {
	return this.pattern.value.next();
}
	

var Queues = []

for (var i=0;i<numberOfQueues;i++) {
	Queues.push( new Queue() );
}



var queue = []

for (var i=0;i<numberOfQueues;i++) {
	queue.push( Queues[i].update.bind(Queues[i]) );
}

queue[0](10,20,30);




function bang() {
  //console.clear();
  //console.log( a.next() );
	post(Queues.length);
  //	for (var i=0;i<Queues.length;i++) {
//		post(Queues[i].pattern);
//		if (Queues[i].pattern.pattern.length) {
			outlet(0, Queues[0].next());
//			post(Queues[i].value);
//		}
  		
//	}
}

// API
// a = sound( [2,3], pick(4,5) ).dur(1,2).vol(bounce(0,1,0.05)).loop(2,4).drunk().after(5)
// b = sound(1,2,3).cycle(1).trans(ri(10)).avoid(6,11,12,13)
// c = sound(1,2).repeat(4).dur(0.2);
// .rotate ... .
// queue[0](a,b).rate(2)..

/* Action items
- bounce/counter takes step instead of iterations
- other methods: loop, drunk, after, cycle, trans, avoid, mode, 
main:
-- ability to play chords
	-- a recursive array processor?
-- need to create queue structure, 
	-- it should create shallow copies of each item
    -- and a callback when each thing finishes that re-clones/renders each item in the queue.
*/



/* Demo */

a = sound(counter(0,100,3)).notes(2,3,4).dur(1,3).vol(0,1,0.5);



