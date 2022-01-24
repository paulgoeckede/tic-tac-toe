# tic-tac-toe

Tic Tac Toe Game as part of The Odin Projects curriculum

Goals going into this:
The goal was to try to use as few global variables as possible. Instead, I tried to use only factory functions and modules, which succeeded in the end. This was a great way to manifest what I had learned in the previous lessons about IIFEs and module usage in JS, aswell as concepts like scope and closure.

Experience:
This was definitely a tough one. I had the basic functionality of a two player tic tac toe game running pretty quickly, however there were always a few more details I didn't think about which a few times led me to rewriting huge chunks of my code. After finishing the two player mode, I tried to do the bonus task of adding an AI.

The AI:
I added two difficulties which admittedly are not very balanced. The easy one just has the AI pick a random open field on the playing board as its selection. Coding this was not too much of a problem. There were a few bugs here and there, but I quickly found the problem and managed to get it running.

The hard difficulty however is where it got tricky. This difficulty is essentially unbeatable, the computer will either draw you or win. To do this, I learned about Game Theory and the min max algorithm, which uses recursion to (in this case) check for all possible outcomes and pick the move that is best in each situation. I did not ad any depth limit here, as the game itself does not have a very high maximum depth. I was lucky that I still remembered how recursive functions work from high school, so after refreshing my memory a bit I did understand what I had to do.

I wanted to solve this as much as possible on my own, so before even looking up the min max function I thought about how I would solve the problem and what could make an AI like this work. I actually did have the right idea in mind. Afterwards I researched a bit and avoided all articles where the min max function is explained using tic tac toe (which there were a lot of). When I thought I had at least a little bit of an idea of what I needed to do, I started coding, but I never got it to properly work. After a few hours I gave in and checked out articles which were using tic tac toe as a reference. Turns out I had all of the right ideas and my function was already built so it would almost work, but I had a few logical errors. After cleaning those up, I got it to work and am very happy with the result!

Future:
I also tried using the \_underscore for private variables in this code but I think I did not quite follow the rules on when to use them and when you should't, so it feels like a mess in that regard. I will have to read a bit more about this and try to better implement this practice in future projects.

---

Total time: 8 hours 13 minutes. (Tracked using clockify).

---

PG
