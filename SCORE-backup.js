// SCORE
//
// Notes
// make default duration be 60 or something
// make blue flash over whole screen, or just text or something
//
//
// look at screenshots to find code for these... or were saved in notepad?
//
// Sections:
// Buzz => Gamut
// Count 789 + (4) Bass
// Gamut with (3) bass
// Secret Garden w/ Wandering baseline
// 4-9 and thud
// 4-9 2-8 alternation, speeding up
// Very fast count stuff with (0) bass
//      (counter)
//
//
/* SECTION
Buzz => Gamut
*/

a = sound(7).dur(0).vol(0)
// no duration or volume!?
// this is going to be an exciting sound!!

queue[0](a)

ms(100)
    => ms(tri(100,150,1))





/* SECTION
Count 7-8-9
+ 4 bass
*/

first:
a = sound(count(7,9)).dur(1).vol(0.7)
//

a = sound(count(ri(5,8),9,1)).dur(1).vol(0.7)
b = sound(pick(3,4)).rep(4).beat(30).vol(0.8).dur(20)


queue[0](a)
queue[1](b)


ms(bounce(100,150,1))




/* SECTION
3 bass gamut
*/


?
a = sound([4,7,8,9]).after(40).dur(40).vol(0.8)

queue[0](a)

ms(120)





/* SECTION
Secret Garden
Wandering baseline
*/

// this can be clarified into
// low notes
a = sound(ri(1,4)).after(ri(20,40))

// gamut
b = sound(6).dur(0).vol(1).after(20)
c = sound(7,8).rev(pick(0,1)).vol(0.7).after(ri(20))
d = sound(7).vol(0.8).rep(ri(10)).after(20)
e = sound([3,4]).vol(0.8).after(30)

// pattern
g = sound(sine(4,8,5)).vol(tri(0.2,0.9))

queue[0](a)
queue[1](pick(b,c,d,e))
queue[2](g)

ms(bounce(150,100,1))





/* SECTION 5
4-9 and thud
then 4-9 2-8 alternation
*/

a = sound(4,9).after(70).dur(10)
b = sound(5).dur(0).beat(ri(80,60))

queue[0](a)
queue[1](b)
queue[2]()

ms(120)

====



/* SECTION 6
counting patterns
root 0 low
*/

a = sound(count(ri(4,8),9)).vol(tri(0.9,0.3,0.05)).dur(10)
b = sound(pick(0)).vol(0.8).dur(10).after(60)
c = sound(count(ri(4,7),9)).vol(tri(0.3,0.9,0.09)).dur(10)

queue[0](a)
queue[1](b)
queue[2](c)

ms(120)






/*
Maybe later....
 */

 a = sound([7,8,9]).after(tri(1,30,5)).dur(10).vol(1,0.3,0.1)
 b = sound([5,6,7]).after(tri(1,30,7)).dur(10).vol(1,0.3,0.1)

 queue[0](a)
 queue[1](b)

 ms(tri(150,100,1))


 /*
 Maybe a sine-y section
  */


  a = sound(sine(4,9,3)).dur(10).vol(0.5)
  b = sound(sine(ri(4,6),9,5)).dur(10).vol(0.5)

  queue[0](a)
  queue[1](b)
  queue[2]()
  queue[3]()

  ms(100)


/*
A hammery low chord section
 */

 a = sound([0,3,4,5]).beat(20).vol(0.6).dur(20)
 b = sound(5,7,8,9).vol(tri(0,1,0.05))

 queue[0](a)
 queue[1](b)
 queue[2]()
 queue[3]()

 ms(100)


 /*
Also cool
  */

  a = sound(pick(0,4,7)).dur(1).vol(0.2).rep(ri(10))
 b = sound([7,8,9]).after(ri(20,60)).dur(20)
 c = sound(count(4,9,1)).vol(0.8).rep(5)
 d = sound(5).after(10)

 queue[0](pick(a,c,d))
 queue[1]()
 queue[2]()
 queue[3]()

 ms(bounce(120,70,10))
