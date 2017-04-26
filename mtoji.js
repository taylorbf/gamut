var tuning = [1/1, 16/15, 9/8, 6/5, 5/4, 4/3, 11/8, 3/2, 8/5, 5/3, 9/5, 15/8, 2/1];
var middleC = 130.81279;


inlets=1;
outlets=2;

function msg_int(v) {
	var octave = ~~(v/12)-4;
	var octaveMultiplier = Math.pow(2,octave);
	var scaleIndex = v%12;
	var ratio = tuning[scaleIndex] * octaveMultiplier;
	var frequency = ratio * middleC;
	post(tuning[scaleIndex] + '\n')
	outlet(0, frequency);
	outlet(1, ratio);
}