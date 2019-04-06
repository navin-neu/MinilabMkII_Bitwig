This is a Bitwig control script for the Arturia Minilab MkII.
It is a modified version of Netsu's script, available here:
https://github.com/Nettsu/minilab-mkII-bitwig

I have made a number of changes to the script to better suit my own workflow, and removed some of the extras that I
didn't need. This configuration makes it pretty easy to get a loop going and layer parts without having to touch your
mouse and keyboard.

The controls are as follows:

Pad 1/9: Transport Play/Previous Device
Pad 2/10: Transport Stop/Next Device
Pad 3/11: Transport Record/Previous Device Page
Pad 4/12: Track Arm/Next Device Page
Pad 5/13: Track Solo/Metronome
Pad 6/14: Track Mute/Loop
Pad 7/15: Transport Rewind/Freely Assignable Toggle
Pad 8/16: Transport Fast Fwd/CC64 (Sustain)
Knob 1/9 Click: Prev/Next Track

Note: Modwheel functionality must be assigned inside whichever VST you have armed. It is not mappable in Bitwig itself.

As with Netsu's script, knobs 1-4 and 9-12 control the selected device macros, while the others are freely assignable.

Also included is the Minilab control profile, which you can upload to the Minilab hardware via the Midi Control Center.
I recommend Colour coding the pads in a way that helps you remember the functions, and reassigning pad 16 if you already
have a sustain pedal.