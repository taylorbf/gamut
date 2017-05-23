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


//=====
//1
// no duration or volume!?
// this is going to be an exciting sound!!

a = sound(7).dur(0).vol(0)

queue[0](a)

ms(100)

//


a = sound(7).dur(0).vol(0).rep(ri(20))
b = sound([7,8,9]).after(30)

queue[0](pick(a,b))

ms(100)

// gamut

a = sound(7).dur(0).vol(0).rep(ri(20))
b = sound([7,8,9]).after(40)
c = sound(6).rep(ri(2,8)).vol(0.7)
d = sound(sine(5,9,ri(6))).rep(ri(10))

queue[0](pick(a,b,c,d))

ms(100)


//Count 7-8-9
// + 4 bass
// transition

a = sound(7).dur(0).vol(0).rep(ri(20)).after(ri(0,20))
b = sound(7,8,9)
c = sound(6).rep(ri(2,8)).vol(0.7).after(ri(0,20))
d = sound(sine(5,9,ri(6))).rep(ri(10)).after(ri(0,20))

queue[0](pick(a,b,c,d))
queue[1](b)

ms(tri(100,150,1))

//

a = sound(7).dur(0).vol(0).rep(ri(20)).after(ri(0,20))
b = sound(7,8,9).vol(tri(0.8,0.3,0.01))
c = sound(6).rep(ri(2,8)).vol(0.7).after(ri(0,20))
d = sound(sine(5,9,ri(6))).rep(ri(10)).after(ri(0,20))
e = sound(4).after(30).vol(0.6)

queue[0](pick(a,b,c,d))
queue[1](b)
queue[2](e)

ms(tri(100,150,1))



/* SECTION
*/

a = sound([4,7,8,9]).after(40).dur(40).vol(0.8)

queue[0](a)
queue[1]()
queue[2]()

ms(tri(100,150,1))


//
a = sound(pick(0,4,7)).dur(1).vol(0.2).rep(ri(10))
b = sound([4,7,8,9]).after(ri(20,40))
c = sound(count(4,9,1)).vol(0.8).rep(ri(5))
d = sound(5).after(10)

queue[0](pick(a,b,c,d))
queue[1]()
queue[2]()
queue[3]()

ms(bounce(120,70,10))



//TRANSFORM to secret garden
/* SECTION
Secret Garden
Wandering baseline
*/


// 1st: gamut
a = sound(6).dur(0).vol(1).after(20)
b = sound(7,8).rev(pick(0,1)).vol(0.7).after(ri(20))
c = sound(7).vol(0.8).rep(ri(10)).after(20)
d = sound([3,4]).vol(0.8).after(30)

// 2nd: pattern
e = sound(sine(4,8,5)).vol(tri(0.2,0.9))

// 3rd: low notes
f = sound(ri(1,4)).after(ri(20,40))



queue[0](pick(a,b,c,d))
queue[1](e)
queue[2](f)

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

h = sound(4,9).after(0).vol(0.7)
i = sound(5).dur(1).after(ri(40,80))
j = sound(2,8).after(0).vol(0.7)
k = sound(sine(4,8,7)).vol(tri(1,0.8))

queue[0](h,j)
queue[1](k)
queue[2]()
queue[3]()

ms(tri(100,150,10))



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

 ms(tri(120,70,10))


 // structure
 //
// sines:
// intro section: sine(5,9,ri(4,7))
// garden section: sine(4,9,7)
// last section: sine(4,8,7)

// sections: buzz, [789], (789), [4789], garden, 4-9, 4928+sine, count
//
//
//
//
//
//
//
//
//
