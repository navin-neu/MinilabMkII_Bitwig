loadAPI(2);

host.defineController("Arturia", "MiniLab MKII", "1.0", "0f3f735d-c0b8-4eea-989a-0fd5f8be48a6", "nav.neu (Orig. Netsu)");
host.defineMidiPorts(1, 1);
host.addDeviceNameBasedDiscoveryPair(["Arturia MINILAB MKII"], ["Arturia MINILAB MKII"]);

STATUS_PAD_ON = 153;
STATUS_PAD_OFF = 137;
STATUS_KNOB = 176;
FIRST_PAD_MIDI = 36;

var PAD_FUNCTION =
{
	CONTROL:1
    //Could add more configurations for pads here.
};

var KnobsLeft = [112, 74, 71, 76, 114, 18, 19, 16];
var KnobsRight = [77, 93, 73, 75, 17, 91, 79, 72];

var knobClick1 = 113;
var knobClick9 = 115;

var modWheel        = 1;
var macroKnobSpeed  = 1.0;
var padFunction 	= PAD_FUNCTION.CONTROL;

var identityMap	 	= makeArray(128, -1);
var emptyMap	 	= makeArray(128, -1);

function makeArray(x, init)
{
	var table = new Array(x);
	for (var i = 0; i < x; i++)
	{
		table[i] = init;
	}
	return table;
}

function init()
{
	for (var i = 0; i < 128; i++)
	{
        identityMap[i] = i;
    }

	
    // Create the Note Inputs and their Settings
    MiniLabKeys = host.getMidiInPort(0).createNoteInput("MiniLab Keys", "80????", "90????", "B001??", "B002??", "B007??", "B00B??", "B040??", "C0????", "D0????", "E0????");
    MiniLabKeys.setShouldConsumeEvents(false);

    MiniLabPads = host.getMidiInPort(0).createNoteInput("MiniLab Pads", "?9????");
    MiniLabPads.setShouldConsumeEvents(false);
    MiniLabPads.assignPolyphonicAftertouchToExpression(0, NoteExpression.TIMBRE_UP, 2);
    MiniLabPads.setKeyTranslationTable(emptyMap);

    host.getMidiInPort(0).setMidiCallback(onMidi);

	transport = host.createTransport();
    cTrack = host.createCursorTrack(3, 0);
    uControl = host.createUserControls(8);
    prefs = host.getPreferences();
    
    deviceCursor = cTrack.createCursorDevice();
    controlPageCursor = deviceCursor.createCursorRemoteControlsPage(8);

    for (var i = 0; i < 8; i++)
    {
        uControl.getControl(i).setLabel("CC " + KnobsRight[i])
    }


    var macroSpeedSetting = prefs.getNumberSetting("Macro knob speed", "Knobs", -10, 10, 0.1, "", 1.0);
    macroSpeedSetting.addRawValueObserver(function(value)
    {
        macroKnobSpeed = value;
    });


    setIndications();
}


function MidiData(status, data1, data2)
{
   this.status = status;
   this.data1 = data1;
   this.data2 = data2;
}

function onPad(midi)
{
	if (midi.status == STATUS_PAD_ON)
	{
		var padNum = midi.data1 - FIRST_PAD_MIDI;
		
		if (padFunction == PAD_FUNCTION.CONTROL)
		{
			if (padNum == 0)
			{
                transport.togglePlay();
			}
			else if (padNum == 1)
			{
                transport.stop();
			}
			else if (padNum == 2)
			{
                transport.record();
			}
			else if (padNum == 3)
			{
                cTrack.arm.toggle();

			}
			else if (padNum == 4)
			{
                cTrack.solo.toggle();
			}
			else if (padNum == 5)
			{
                cTrack.mute.toggle();
			}
			else if (padNum == 6)
			{
                transport.rewind();
			}
            else if (padNum == 7)
            {
                transport.fastForward();
            }
            else if (padNum == 8)
            {
                deviceCursor.selectPrevious();
            }
            else if (padNum == 9)
            {
                deviceCursor.selectNext();
            }
            else if (padNum == 10)
            {
                controlPageCursor.selectPreviousPage(true);
            }
            else if (padNum == 11)
            {
                controlPageCursor.selectNextPage(true);
            }
            else if (padNum == 12)
            {
               transport.toggleClick();
            }
            else if (padNum == 13)
            {
                transport.toggleLoop();
            }

            //remaining two pads are freely mappable in Bitwig.

		}


	}
	else if (midi.status == STATUS_PAD_OFF)
	{
		var padNum = midi.data1 - FIRST_PAD_MIDI;
    }
}

function onMidi(status, data1, data2)
{
    var midi = new MidiData(status, data1, data2); //instantiate a MidiData object to handle

	if (midi.status == STATUS_PAD_ON || midi.status == STATUS_PAD_OFF)
	{
		onPad(midi);
	}

    if (midi.status == STATUS_KNOB)
    {
        var inc = (midi.data2 - 64) * macroKnobSpeed;

        for (var i = 0; i < 8; i++)
        {
            if (midi.data1 === KnobsLeft[i])
            {
				controlPageCursor.getParameter(i).inc(inc, 128);
            }
            else if (midi.data1 === KnobsRight[i])
            {
				uControl.getControl(i).inc(inc, 128);
            }
        }

        if (midi.data1 == knobClick1 && midi.data2 === 127) //each "click" actually clicks twice. Filter one out.
        {
            cTrack.selectPrevious();
        }
        if (midi.data1 == knobClick9 && midi.data2 === 127)
        {
            cTrack.selectNext();
        }

        else if (midi.data1 == modWheel)
        {
         //could make different functionality for mod wheel here.
        }
    }
}

function setIndications() //indicate the right half of the knobs as mapped in Bitwig.
{
    for (var i = 0; i < 8; i++)
    {
        controlPageCursor.getParameter(i).setIndication(true);
        uControl.getControl(i).setIndication(true);
    }
}

function getSign(x) //for testing
{
    return typeof x === 'number' ? x ? x < 0 ? -1 : 1 : x === x ? 0 : NaN : NaN;
}

function exit()
{
}
