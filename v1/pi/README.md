# AIMPI Controller

![alt text](https://aliconnect.nl/shared/1/951/3565951/EA33113311484550AC759CD5EDD85FAD/paste.png)

## Autostart chromium in kiosk mode
In terminal
```
sudo nano /home/pi/.config/lxsession/LXDE-pi/autostart
```
In editor invoeren
```
@lxpanel -–profile LXDE-pi
@pcmanfm –-desktop -–profile LXDE-pi
#@xscreensaver -no-splash
#@point-rpi
@xset s off
@xset -dpms
@xset s noblank
@sed -i 's/"exited_cleanly":false/"exited_cleanly":true/' /home/pi/.config/chromium/Default/Preferences
@chromium-browser --start-fullscreen --disable-session-crashed-bubble --noerrdialogs --no-default-browser-check --no-first-run --disable-infobars -- kiosk https://aliconnect.nl/aliconnector 
```

# Create SD Card
1. [sdxc_formatting](https://www.raspberrypi.org/documentation/installation/sdxc_formatting.md)
1. [https://etcher.io/](https://etcher.io/)
1. [Burn SD Card](https://www.osforensics.com/tools/write-usb-images.html).

# Setup PI Wifi
1. Start PI Desktop
1. Stel WiFi via knop rechts boven. Selecteer WiFi.

# Command line PI
```
sudo apt-get update --fix-missing
sudo apt-get install -y nodejs npm
ifconfig
```
Note IP adres na net
```
sudo raspi-config
```
Configure PI
```
5 Interfacing Options
P2 SSH
<Ja>
<Ok>
```
Command line
```
npm install onoff
```

```
sudo apt-get install git
git clone https://github.com/richardghirst/PiBits.git cd PiBits cd ServoBlaster cd user make sudo make install
```

## Find IP Adres
```
ifconfig
```

zie IP adres achter inet

http://www.circuitbasics.com/access-raspberry-pi-desktop-remote-connection/

https://www.realvnc.com/en/connect/download/viewer/

https://www.distrelec.nl/en/arduino-tinkerkit-braccio-robot-arm-arduino-t050000/p/30101966?channel=b2c&price_gs=279.752&source=googleps&ext_cid=shgooaqnlen-blcss&kw=%7Bkeyword%7D&gclid=EAIaIQobChMI99WJ19r94wIVyYbVCh27XgQtEAQYAiABEgJaLfD_BwE

?

robot arm



Servo

wijzig home/pi/PiBits/ServoBlaster/user/servod.c

```
//static char *default_p1_pins = "7,11,12,13,15,16,18,22";
static char *default_p1_pins = "7";
```

op pi

```
cd PiBits/ServoBlaster/user
make
sudo make install
reboot
```



node servosweep



verwijderen piblaster

```
sudo rm /etc/init.d/servoblaster
```



```
npm install express
npm install websocket
```


Now reboot the Pi with `sudo reboot`.

Next we need to install RealVNC Viewer on the computer you want to access the Pi from. Download RealVNC Viewer here and open the .exe file. It’s a portable application, so you don’t need to install it:

Node.js Raspberry Pi GPIO - Blinking LED
What is GPIO?

GPIO stands for General Purpose Input Output.

The Raspberry Pi has two rows of GPIO pins, which are connections between the Raspberry Pi, and the real world.

Output pins are like switches that the Raspberry Pi can turn on or off (like turning on/off a LED light). But it can also send a signal to another device.

Input pins are like switches that you can turn on or off from the outside world (like a on/off light switch). But it can also be a data from a sensor, or a signal from another device.

That means that you can interact with the real world, and control devices and electronics using the Raspberry PI and its GPIO pins!

Taking a Closer Look at the GPIO Pins

This is an illustration of the Raspberry Pi 3.

The GPIO pins are the small red squares in two rows on the right side of the Raspberry Pi, on the actual Raspberry Pi they are small metal pins.

The Raspberry Pi 3 has 26 GPIO pins, the rest of the pins are power, ground or "other".

The pin placements correspond with the table below.

Raspberry Pi B+, 2, 3 & Zero

3V3125V

GPIO 2345V

GPIO 356GND

GPIO 478GPIO 14

GND910GPIO 15

GPIO 171112GPIO 18

GPIO 271314GND

GPIO 221516GPIO 23

3V31718GPIO 24

GPIO 101920GND

GPIO 92122GPIO 25

GPIO 112324GPIO 8

GND2526GPIO 7

DNC2728DNC

GPIO 52930GND

GPIO 63132GPIO 12

GPIO 133334GND

GPIO 193536GPIO 16

GPIO 263738GPIO 20

GND3940GPIO 21

Legend

Physical Pin Number

Power +

Ground

UART

I2C

SPI

GPIO

Do Not Connect



Taking a Closer Look at the Breadboard

A breadboard is used for prototyping electronics, it allows you to create circuits without soldering. It is basically a plastic board, with a grid of tie-points (holes). Inside the board there are metal strips connecting the different tie-points in specific ways.

In the illustration below we have highlighted some of the sections with different colors. This is to show you how the grid is connected.

The different sections of the breadboard:

On the left, and right, side there are 2 columns of tie-points. All the tie points in each of these columns are connected.

The Power Bus - The columns highlighted with red. There are usually used to connect power to the Breadboard. Since the entire column is connected, you can connect power to any of the tie-points in the column.

The Ground Bus - The columns highlighted with blue. There are usually used to connect Ground to the Breadboard. Since the entire column is connected, you can connect ground to any of the tie-points in the column.

Rows of connected Tie-Points - The rows highlighted with green. The tie-points of each of these rows are connected, but not the entire row! The left side tie-points are connected (A-B-C-D-E), and the right side tie-points are connected (F-G-H-I-J).

In the center of the Breadboard there is a Trench, this separates the left and right rows. The width of the trench is designed so that many Integrated Circuits fit across it.

Install the onoff Module

To interface with the GPIO on the Raspberry Pi using Node.js, we will use a Module called "onoff".

Install the onoff module using npm:

pi@raspberry:~ $ npm install onoff

Now onoff should be installed and we can interact with the GPIO of the Raspberry Pi.

Using the GPIO for Output

In this chapter we will use a Raspberry Pi and its GPIO to make a LED blink.

We use Node.js with the onoff module to control the GPIO.

To get a LED light to turn on, we use a GPIO pin as "Output", and create a script to turn it on and off (blinking).



What do we need?

In this chapter we will create a simple example where we control a LED light.

For this you need:

A Raspberry Pi with Raspian, internet, SSH, with Node.js installed

The onoff module for Node.js

1 x Breadboard

1 x 68 Ohm resistor

1 x Through Hole LED

2 x Female to male jumper wires

Click the links in the list above for descriptions of the different components.

Note: The resistor you need can be different from what we use depending on the type of LED you use. Most small LEDs only need a small resistor, around 200-500 ohms. It is generally not critical what exact value you use, but the smaller the value of the resistor, the brighter the LED will shine.

Building the Circuit

Now it is time to build the circuit on our Breadboard.

If you are new to electronics, we recommend you turn off the power for the Raspberry Pi. And use an anti-static mat or a grounding strap to avoid damaging it.

Shut down the Raspberry Pi properly with the command:

pi@w3demopi:~ $ sudo shutdown -h now

After the LEDs stop blinking on the Raspberry Pi, then pull out the power plug from the Raspberry Pi (or turn of the power strip it is connected to).

Just pulling the plug without shutting down properly may cause corruption of the memory card.

Look at the above illustration of the circuit.

On the Raspberry Pi, connect the female leg of the first jumper wire to Ground. You can use any GND pin. In this example we used Physical Pin 9 (GND, row 5, left column)

On the Breadboard, connect the male leg of the first jumper wire to the Ground Bus column on the right. That entire column of your breadboard is connected, so it doesn't matter which row. In this example we have attached it to row 1

On the Raspberry Pi, connect the female leg of the second jumper cable to a GPIO pin. In this example we used Physical Pin 7 (GPIO 4, row 4, left column)

On the Breadboard, connect the male leg of the second jumper wire to the Tie-Point row of your choice. In this example we connected it to row 5, column A

On the Breadboard, connect one leg of the resistor to the Ground Bus column on the right side. That entire column of your breadboard is connected, so it doesn't matter which row. In this example we have attached it to row 5

On the Breadboard, connect the other leg of the resistor to the right side Tie-Point row of your choice. In this example we have used row 5, column J

On the Breadboard, connect the cathode leg (the shortest leg) of the LED to the same Tie-Point row that you connected the resistor from GND to. In this example we used row 5, column F

On the Breadboard, connect the anode leg (the longest leg) of the LED to the same Tie-Point row that you connected the jumper from the GPIO pin to. In this example we used row 5, column E

Your circuit should now be complete, and your connections should look pretty similar to the illustration above.

Now it is time to boot up the Raspberry Pi, and write the Node.js script to interact with it.



Raspberry Pi and Node.js Blinking LED Script

Now that we have everything set up, we can write a script to turn the LED on and off.

Start by making a directory where we can keep our Node.js scripts:

```
pi@w3demopi:~ $ mkdir nodetest
```

Go to our new directory:

```
pi@w3demopi:~ $ cd nodetest
```

Now we will create a new file called "blink.js" using the Nano Editor:

```
pi@w3demopi:~ $ nano blink.js
```

The file is now open and can be edited with the built in Nano Editor.

Write, or paste the following code:

```
blink.js
```

```
var Gpio = require('onoff').Gpio; //include onoff to interact with the GPIO
var LED = new Gpio(4, 'out'); //use GPIO pin 4, and specify that it is output
var blinkInterval = setInterval(blinkLED, 250); //run the blinkLED function every 250ms

function blinkLED() { //function to start blinking
  if (LED.readSync() === 0) { //check the pin state, if the state is 0 (or off)
    LED.writeSync(1); //set pin state to 1 (turn LED on)
  } else {
    LED.writeSync(0); //set pin state to 0 (turn LED off)
  }
}

function endBlink() { //function to stop blinking
  clearInterval(blinkInterval); // Stop blink intervals
  LED.writeSync(0); // Turn LED off
  LED.unexport(); // Unexport GPIO to free resources
}

setTimeout(endBlink, 5000); //stop blinking after 5 seconds
```

Press "Ctrl+x" to save the code. Confirm with "y", and confirm the name with "Enter".

Run the code:

```
pi@w3demopi:~ $ node blink.js
```

Now the LED should blink for 5 seconds (10 times) before turning off again!

Enable WinSCP
Enable Remote Desktop
I2C ON PI
Hardware

MCP23017





MCP23017-9 VDD <-> PI J8-1 +3.3VDC

MCP23017-10 VSS <-> PI J8-6 GND

MCP23017-12 SCK <-> PI J8-5 GPIO3 SCL1 I2C

MCP23017-13 SDA <-> PI J8-3 GPIO2 SDA1 I2C

MCP23017-15 A0 <-> PI J8-6 GND

MCP23017-16 A0 <-> MCP23017-10 VSS

MCP23017-17 A1 <-> MCP23017-10 VSS

MCP23017-18 A2 <-> MCP23017-10 VSS

MCP23017-19 RESET <-> MCP23017-9 VDD

MCP23017-1 GPB0<-> R330Ohm <-> LED <-> MCP23017-9 VDD



adres select = 000 = adres 20



PI

```
sudo raspi -config
```

```
5 Interface Options
P5 I2C
<Ja>
<Ok>
```

```
sudo i2cdetect -y 1
```

resultaat

```
20: 20 -- -- -- -- -- -- -- -- --...
```

```
npm install i2c-bus
```


Instellen vast IP Adres
Download en installeer Raspbian
Download Raspbian PI with Desktop

https://www.raspberrypi.org/downloads/raspbian/



Overnemen scherm
Shut down PI form command window
sudo shutdown -h now

Sound Noise
When activating servo-blaster there is a noise on the speaker. This is the result of using PWM signal. This can't be resolved. You need to connect a sound system through the USB connector.

Other options





I2C IO Expansion with MCP23017
MCP23017-E/SP
I/O Expander, 16bit, 1.7 MHz, I2C, Serial, 1.8 V, 5.5 V, DIPI2C bus, 16 In/Out, 2x Interupt



?

http://ww1.microchip.com/downloads/en/devicedoc/20001952c.pdf



Create Input




How to write and run a programm in C
To demonstrate how to create a C program, compile it, and run it on the Raspberry Pi, we’ll make a simple program that will print “hello world” in the terminal.

The coding process in C consists of four steps:

Creating the source file
Compiling the program
Making the program executable
Executing the program
Ccreating th source file
To start, open the Nano text editor and create a new file with a “.c” extension by entering this at the command prompt:

sudo nano hello-world.c

This file is where you’ll write the C code. You can write the code in any text editor, just make sure to give the file a “.c” extension.

Now, enter this code into Nano:

#include <stdio.h>
int main()
{
   printf("Hello, World! \n");
   return 0;
}
After entering the code, enter Ctrl-X and Y to save and exit Nano.

Compiling the programm
Code written in C will need to be compiled before it can be run on a computer. Compiling is the process of converting the code you write into machine readable instructions that can be understood by the computer’s processor.

When you compile your source file, a new compiled file gets created. For example, entering the command below will compile hello-world.c into a new file called myfirstcprogram:

gcc hello-world.c -o myfirstcprogram

Making the programm executable
Now we need to make the compiled file executable. To do that, we just need to change the file permissions. Enter this at the command prompt:

chmod +x myfirstcprogram

Executing the program
Now all we need to do to run the compiled, executable, C program is enter this at the command prompt:

./myfirstcprogram

Hope this helps you get a basic idea on how to get started programming in C on the Raspberry Pi.

PWM Input on Raspberry PI
The long answer: You actually can! (well with a little help from our friends resistor and capacitor)

You can convert a PWM output to an analog voltage level, (DAC) and read it with ADC pin on your raspberry pi.

What you need is a 4k7 resistor and 0.1uF capacitor:



The simple RC low-pass filter above converts the PWM signal to a voltage proportional to the duty cycle which can be read by your raspberry pi as an analog value.

If you are happy with a slow response, you can read a fast PWM by undersampling. Simply read the GPIO in a loop and apply a low pass filter. The probability of reading a 1 each cycle is proportional to the pulse width. An easy to implement IIR low pass filter is:

double acc=0.5;
const double k=0.01;
for(;;) {
  bool x=GPIO.read();
  acc+=k*(x?1:0-acc);
}
As k decreases, the resolution improves but the bandwidth decreases.

PI Pin Layout
?

Power voltage regulation
L7805CV
Linear Voltage Regulator, 7805, Fixed, Positive, 10V To 35V In, 5V And 1.5A Out, TO-220-3



OKI-78SR-5
https://nl.farnell.com/murata-power-solutions/oki-78sr-5-1-5-w36h-c/dc-dc-converter-5v-1-5a/dp/2812636

3,91







Strompi 2
Electronic Housing, For Raspberry Pi-BC, Lower Part, Upper Part, Cover & PCB Holder, Light Gray

27,49



Overzetten van bestanden via WinSCP
sudo raspi-config



pi, enable interfacing-options/ssh



ifconfig voor ip adres



https://ninite.com/winscp/

Build RC Truck
Verbinden DX6i
sdfg sdfg sdf g



Verbinden DX6i
We starten met de DX6i Zender en de AR6200 ontvanger. Deze moeten we met elkaar verbinden.

Zet de zender uit
Plaats de bind plug op de BATT/BIND (of verbind pin 1 en 3)
Zet spanning op de omtvanger (de led zal gaan knipperen)
Zet de sticks in een neutrale positie. Gas (links) helemaal omlaag.
Trek de Trainer/Bind schakelaar (links achter op zender) omhoog en zet de zender aan.
Na enkele seconden brand de led continue en is de zender verbinden
Verwijder de bindplug (verbinding)
Knipperende ontvanger
Indien de AR6200 blijft knipperen komt dit doordat de spanning van de ontvanger is weggevallen/verwijderd en dit niet bij de zender is gebeurd. Verder geen problemen.

Aansluiten servo's
Op de RC TRuck sluiten we de servo's aan. We hanteren volgende indeling op de AR6200 ontvanger

BATT/BIND: Aansluiting voor Raspberry PI
THRO: ESC van Motor (Linker stick op/neer, op=voorrruit, neer=achteruit, midden=stop)
AILE: Servo stuur voor: (Rechter stick links/rechts)
ELEV: Servo Versnellingsbak, (Rechter stick op/neer, boven=1, midden=2, onder=3)
RUDD: (Linker stick links/rechts)
GEAR: Servo Ontkoppel schotel
AUX 1/FLAP: Servo 2e stuur inrichting achterassen
Volgende instellingen zijn nodig op de DX6i

SETUP LIST/REVERSE/AILE-r, GEAR-R, FLAP-R (=AUX 1)
SETUP LIST/WING TAIL MIX/DUALAILE=ACT
ADJUST LIST/TRAVEL ADJ/GEAR=0 (kleine slag voor ontkoppel servo)
ADJUST LIST/SUBTRIM/FLAP (AUX 1)=90 corrigeren stuurfout 2e stuuras
fasdfasdfadgs fgsdf gsdfg sdfgsd

Proefrijden
Hier volgt misschien een filmpje

Download PI software
Download Raspbian PI with Desktop van de Raspberry PI website. Zie https://www.raspberrypi.org/downloads/raspbian/

Maak een bootable PI memmory SD card
https://www.raspberrypi.org/documentation/installation/sdxc_formatting.md
Wij gebruiken SD Card formatter

Setup zie SD_CardFormatter0500SetupEN

??

https://etcher.io/

voor branden SD Card

https://www.osforensics.com/tools/write-usb-images.html

voor maken SD card


Plaats de stick in de PI, sluit een scherm aan via de HDMI port en een toetsenbord en muis.

Schakel de PI aan en alle software wordt geinstalleerd. Updates worden opgehaald.
Toevoegen IP adres op PC
We stellen een vast IP adres in om de PI ten alle tijden te kunnen bereiken. We gebruiken 192.168.1.131. Indien jouw eigen PC niet in het domein 192.168.1 sit moet je deze toevoegen aan je PC. Bekijk je eigen IP adres door te gaan naar de MS-DOS command promt middel CTRL+R en type 
cmd
Type in je command scherm

ipconfig

en bekijk je IP adres. Voeg indien nodig een eigen IP adres toe in de range 192.168.1.*
Klik in je dahsbord op de prompt icon links boven.

Instellen vast IP adres op PI
sudo nano /etc/dhcpcd.conf

You’ll now carry out the configuration of the static IP address. If your Raspberry Pi is connected to the internet via an Ethernet or network cable, then enter the command ‘interface eth0’; if it takes place over Wi-Fi, then use the ‘interface wlan’ command.

To assign an IP address to Raspberry Pi, use the command ‘static ip_address=’ followed by the desired IPv4 address and the suffix ‘/24’ (an abbreviation of the subnet mak 255.255.255.0). For example, if you want to link a computer with the IPv4 address 192.168.0.4, then you need to use the command ‘static ip_address=192.168.0.4/24’. It goes without saying that the address used here is not yet used anywhere else. As such, it also can’t be located in the address pool of a DHCP server.

You still then need to specify the address of your gateway and domain name server (usually both are the router). Raspberry Pi turns to the gateway address if an IP address to which it wants to send something is outside of the subnet mask (in the example, this would mean outside of the range 192.168.0). In the following command, the IPv4 address 192.168.0.1 is used as an example as both the gateway and DNS server. The complete command looks like this in our example (where a network cable is used for the internet connection):

interface eth0
static ip_address=192.168.1.131/24
static routers=192.168.1.1
static domain_name_servers=192.168.1.1

interface wlan0
static ip_address=192.168.1.132/24
static routers=192.168.1.1
static domain_name_servers=192.168.1.1
sudo reboot
Kijk op de PC of the Raspberry pi berijkbaar is op het nieuwe IP Adres
Ping 192.168.1.131
?Bestandbeheer via WinSCP en Remote command line
We activeren SSH op de Raspberry PI
```
sudo raspi-config
```
```
5 Interfacing Options
P2 SSH
<Ja>
<Ok>
<Finish>
```

We installeren op de PC WinSCP

Ga naar de website https://winscp.net/eng/docs/lang:nl en download WinSCP via de link https://winscp.net/download/WinSCP-5.15.3-Setup.exe

Installer WInSCP en start het programma
Maak verbinding met 192.168.1.132
Overnemen van scherm PI op je PC
Om vanuit je PC op de PI te werken gaan we het scherm oveneen op de PC. We actieverenVNC op de PI. Type:
sudo raspi-config

5 Interfacing Options
P3 VNC
<Ja>
<Ok>
<Finish>
We installeren de VNC Viewer op de PC
Download Real VNC op https://www.realvnc.com/en/connect/download/viewer/ en installer de applicatie.

Aanpassen scherm resolutie VNC
sudo nano /boot/config.txt
Invoeren
hdmi_force_hotplug=1
hdmi_ignore_edid=0xa5000080
hdmi_group=2

hdmi_mode=16

Maak verbinding met je PI via adres 192.168.1.132, Gebruiker pi en wachtwoord {pi_password}
Nu kunnen we het Scherm van de PI en toetsenbord en muis ontkoppelen.
Installeer Atom voor het schrijven van code
Dit nog beschrijven door MVK

Installeer nodejs en npm
We installern node js en npm. Node is onze webserver en websocket server.

sudo apt-get update --fix-missing
sudo apt-get install -y nodejs npm
Voor het bouwen van een website op de PI met node hebben we express. Deze installeren we m.b.v. npm.

npm install express

Hierna kunnen we een klein website programma maken met hello world. Maak een bestand aan app.js en zet hierin volgende tekst.
var express = require('express');
var app = express();
app.get('/', function (req, res) {
       res.send('Hello World!');
});
app.listen(3000, function () {
       console.log('Example app listening on port 3000!');
});
Start de app door invoeren op de prompt

node app

Ga naar je PC en start een browser. Type hier in de addressbalk

http://192.168.1.132

In het scherm verschijnt Hello World!

De weberver werkt nu op je PI

IO Aansturen vanuit je PI
Pin layout van de PI
Voor het aansturen van IO bekijken we eerste de pin layout van de J8 aansluiting.





Type

npm install onoff

Schakel de PI uit voordat je de spanning weghaalt

sudo shutdown -h now

Aansturen van een uitgang op de PI
Verbind een LED X8-7 GPIO4 - 

Enzovoort

Maak blink.js

var Gpio = require('onoff').Gpio; //include onoff to interact with the GPIO
var LED = new Gpio(4, 'out'); //use GPIO pin 4, and specify that it is output
var blinkInterval = setInterval(blinkLED, 250); //run the blinkLED function every 250ms

function blinkLED() { //function to start blinking
  if (LED.readSync() === 0) { //check the pin state, if the state is 0 (or off)
    LED.writeSync(1); //set pin state to 1 (turn LED on)
  } else {
    LED.writeSync(0); //set pin state to 0 (turn LED off)
  }
}

function endBlink() { //function to stop blinking
  clearInterval(blinkInterval); // Stop blink intervals
  LED.writeSync(0); // Turn LED off
  LED.unexport(); // Unexport GPIO to free resources
}

setTimeout(endBlink, 5000); //stop blinking after 5 seconds?



Inlezen van een ingang op de PI
var Gpio = require('onoff').Gpio; //include onoff to interact with the GPIO
var LED = new Gpio(4, 'out'); //use GPIO pin 4 as output
var pushButton = new Gpio(17, 'in', 'both'); //use GPIO pin 17 as input, and 'both' button presses, and releases should be handled

pushButton.watch(function (err, value) { //Watch for hardware interrupts on pushButton GPIO, specify callback function
  if (err) { //if an error
    console.error('There was an error', err); //output error message to console
  return;
  }
  LED.writeSync(value); //turn LED on or off depending on the button state (0 or 1)
});

function unexportOnClose() { //function to run when exiting program
  LED.writeSync(0); // Turn LED off
  LED.unexport(); // Unexport LED GPIO to free resources
  pushButton.unexport(); // Unexport Button GPIO to free resources
};

process.on('SIGINT', unexportOnClose); //function to run when user closes using ctrl+c



Automatisch starten van app.js bij aanzetten PI
Hiervoor moeten we een service installeen genaamd forever.

sudo npm -i install forever g

Nu kunnen we kijken of de app start met

forever start app.js

We stoppen de service met

forever stop app.js

Dit commando plaatsen we in de autostart. Dit bestand passen we aan met nano.

sudo nano /home/pi/.config/lxsession/LXDE-pi/autostart
Voer nu als laatste commando in

@forever start app.js
Sla op met [CTRL]+[O], [Enter]

Sluit af met [CTRL]+[X]

Na het opstarten zal de app starten. Type daarvoor

reboot





Aanpassen pin bezetting servo-blaster
cd
cd PiBits/ServoBlaster/user
sudo nano servod.c
Pas aan in de file

static char *default_p1_pins = "7,11,12,13,15,16,18,22"
in

static char *default_p1_pins = "12"
Sluit af met [CTRL]+[X], [Y], [Enter]

Bestand maken en installeren en voor het ingaan van de wijzigingen moet je opnieuw opstarten

make
sudo make install
reboot



Belangrijke functies zijn niet meer beschikbaar over HTTP. Hiervoor is een beveiligde SSL verbinding nodig. Hieronder vallen

Geolocation — requires secure origins as of M50
Device motion / orientation
EME
getUserMedia
AppCache
Notifications
Voor testen bestaan volgende mogelijkheden

Secure the server with a publicly-trusted certificate. If the server is reachable from the Internet, several public CAs offer free, automatically-renewed server certificates.

http://localhost is treated as a secure origin, so if you're able to run your server from localhost, you should be able to test the feature on that server.

You can run chrome with the --unsafely-treat-insecure-origin-as-secure="http://example.com" flag (replacing "example.com" with the origin you actually want to test), which will treat that origin as secure for this session. Note that on Android and ChromeOS this requires having a device with root access/dev mode. (This flag is broken in Chrome 63 but fixed in Chrome 64 and later. Prior to Chrome 62, you must also include the --user-data-dir=/test/only/profile/dir to create a fresh testing profile for the flag to work.) 

Create a self-signed certificate for temporary testing. Direct use of such a certificate requires clicking through an invalid certificate interstitial, which is otherwise not recommended. Note that because of this interstitial click-through (which also prevents HTTPS-response caching), we recommend options (1) and (2) instead, but they are difficult to do on mobile. See this post on setting up a self-signed certificate for a server for more information on how to do this.

An alternative approach is to generate a self-signed root certificate which you place into the trust store of the developer PC/devices, and then issue one or more certificates for the test servers. Trusting the root certificate means that Chrome will treat the site as secure and load it without interstitials or impacting caching. One easy way of setting up and using a custom root certificate is to use the open source mkcert tool.

On a local network, you can test on your Android device using port forwarding to access a remote host as localhost.




Adres selectie MCP23017


Instellen configuratie
sudo raspi-config

5 Interfacing Options
P5 I2C
<Ja>
<Ok>
<Finish>

5 Interfacing Options
P2 SSH
<Ja>
<Ok>
<Finish>

5 Interfacing Options
P3 VNC
<Ja>
<Ok>
<Finish>





Uitschakelen van PI middels de prompt
sudo shutdown -h now
Opstarten van de website in kiosk mode

In terminal

sudo nano /home/pi/.config/lxsession/LXDE-pi/autostart
In editor invoeren

@lxpanel -–profile LXDE-pi
@pcmanfm –-desktop -–profile LXDE-pi
#@xscreensaver -no-splash
#@point-rpi
@xset s off
@xset -dpms
@xset s noblank
@sed -i 's/"exited_cleanly":false/"exited_cleanly":true/' /home/pi/.config/chromium/Default/Preferences
@chromium-browser --start-fullscreen --disable-session-crashed-bubble --noerrdialogs --no-default-browser-check --no-first-run --disable-infobars -- kiosk https://aliconnect.nl/aliconnector 



Overnemen van het PI scherm



Activeer I2C op de PI

sudo raspi-config

5 Interfacing Options
P5 I2C
<Ja>
<Ok>
<Finish>
Kijk met WinSCP of bestand /dev/i2c-1 bestaat. Dit bestand maken we lees en schrijfbaar.

sudo chmod o+rw /dev/i2c*
Nu kunnen we een testprogramma maken en starten

Voorbeeld voor het gebruik
var MCP23017 = require('node-mcp23017');
var mcp = new MCP23017({
  address: 0x20, //default: 0x20
  device: '/dev/i2c-1', // '/dev/i2c-1' on model B | '/dev/i2c-0' on model A
  debug: true //default: false
});
/*
  By default all GPIOs are defined as INPUTS.
  You can set them all the be OUTPUTs by using the pinMode-Methode (see below),
  You can also disable the debug option by simply not passing it to the constructor
  or by setting it to false
*/
//set all GPIOS to be OUTPUTS
for (var i = 0; i < 16; i++) {
  mcp.pinMode(i, mcp.OUTPUT);
  //mcp.pinMode(i, mcp.INPUT);  //if you want them to be inputs
  //mcp.pinMode(i, mcp.INPUT_PULLUP);  //if you want them to be pullup inputs
}
mcp.digitalWrite(0, mcp.HIGH); //set GPIO A Pin 0 to state HIGH
mcp.digitalWrite(0, mcp.LOW); //set GPIO A Pin 0 to state LOW
/*
 to read an input use the following code-block.
  This reads pin Nr. 0 (GPIO A Pin 0)
  value is either false or true
*/
mcp.digitalRead(0, function (err, value) {
  console.log('Pin 0', value);
});
Voorbeeld (Blink 16 LEDs)

var MCP23017 = require('node-mcp23017');
 
var mcp = new MCP23017({
  address: 0x20, //all address pins pulled low
  device: '/dev/i2c-1', // Model B
  debug: false
});
 
/*
  This function blinks 16 LED, each hooked up to an port of the MCP23017
*/
var pin = 0;
var max = 16;
var state = false;
 
var blink = function() {
  if (pin >= max) {
    pin = 0; //reset the pin counter if we reach the end
  }
 
  if (state) {
    mcp.digitalWrite(pin, mcp.LOW); //turn off the current LED
    pin++; //increase counter
  } else {
    mcp.digitalWrite(pin, mcp.HIGH); //turn on the current LED
    console.log('blinking pin', pin);
  }
  state = !state; //invert the state of this LED
};
 
//define all gpios as outputs
for (var i = 0; i < 16; i++) {
  mcp.pinMode(i, mcp.OUTPUT);
}
 
setInterval(blink, 100); //blink all LED's with a delay of 100ms


Servo aansturen









5 Interfacing Options
P2 SSH
<Ja>
<Ok>
<Finish>

5 Interfacing Options
P3 VNC
<Ja>
<Ok>
<Finish>



Aanpassen I2C Adres

Verbind A0,A1 en/of A2 met de GND of de VDD (+3.3V) om een binaire code te maken

111 = Adres 20







Activeer I2C





Bekijk alle I2C aangesloten modules

i2cdetect -y 1



npm install node-mcp23017 --save












Build RC 2
Verbinden DX6i
We starten met de DX6i Zender en de AR6200 ontvanger. Deze moeten we met elkaar verbinden.

Zet de zender uit
Plaats de bind plug op de BATT/BIND (of verbind pin 1 en 3)
Zet spanning op de omtvanger (de led zal gaan knipperen)
Zet de sticks in een neutrale positie. Gas (links) helemaal omlaag.
Trek de Trainer/Bind schakelaar (links achter op zender) omhoog en zet de zender aan.
Na enkele seconden brand de led continue en is de zender verbinden
Verwijder de bindplug (verbinding)
Knipperende ontvanger
Indien de AR6200 blijft knipperen komt dit doordat de spanning van de ontvanger is weggevallen/verwijderd en dit niet bij de zender is gebeurd. Verder geen problemen.

Aansluiten servo's
Op de RC TRuck sluiten we de servo's aan. We hanteren volgende indeling op de AR6200 ontvanger

BATT/BIND: Aansluiting voor Raspberry PI
THRO: ESC van Motor (Linker stick op/neer, op=voorrruit, neer=achteruit, midden=stop)
AILE: Servo stuur voor: (Rechter stick links/rechts)
ELEV: Servo Versnellingsbak, (Rechter stick op/neer, boven=1, midden=2, onder=3)
RUDD: (Linker stick links/rechts)
GEAR: Servo Ontkoppel schotel
AUX 1/FLAP: Servo 2e stuur inrichting achterassen
Volgende instellingen zijn nodig op de DX6i

SETUP LIST/REVERSE/AILE-r, GEAR-R, FLAP-R (=AUX 1)
SETUP LIST/WING TAIL MIX/DUALAILE=ACT
ADJUST LIST/TRAVEL ADJ/GEAR=0 (kleine slag voor ontkoppel servo)
ADJUST LIST/SUBTRIM/FLAP (AUX 1)=90 corrigeren stuurfout 2e stuuras







Build PI Controller
Opbouwen van een Standaard PI
Download PI software
Download Raspbian PI with Desktop van de Raspberry PI website. Zie https://www.raspberrypi.org/downloads/raspbian/

Maak een bootable PI memmory SD card
https://www.raspberrypi.org/documentation/installation/sdxc_formatting.md

Wij gebruiken SD Card formatter

Setup zie SD_CardFormatter0500SetupEN

??

https://etcher.io/

voor branden SD Card

https://www.osforensics.com/tools/write-usb-images.html

voor maken SD card

Plaats de stick in de PI, sluit een scherm aan via de HDMI port en een toetsenbord en muis.

Schakel de PI aan en alle software wordt geinstalleerd. Updates worden opgehaald.

Static/Vast IP adress op PI
We stellen een vast IP adres in om de PI ten alle tijden te kunnen bereiken. In deze beschrijving gebruiken we 192.168.1.131 voor LAN en 192.168.1.132 voor WAN (Wi-Fi). Deze laatste is het belangrijkste omdat we de PI gebruiken voor een RC Truck en dus moet de PI via Wi-Fi te bereiken zijn. 

Bepalen IP adres op PC
Indien jouw eigen PC niet in het domein 192.168.1 zit moet je deze toevoegen aan je PC. Bekijk je eigen IP adres door te gaan naar de MS-DOS command promt middel CTRL+R en type 
cmd

Type in je DOS command scherm

ipconfig /all

en bekijk je IP adres. Voeg indien nodig een eigen IP adres toe in de range 192.168.1.*, bijvoorbeeld 192.168.1.201.

Bekijk tevens je DNS (Domain Name Server) IP adres. Deze is belangrijk om goed in te voeren op de PI omdat deze anders geen internet meer kan vinden.

Instellen vast IP adres op PI
Het instellen van een vast IP adres op de PI doen we in de dhcpcd.conf file.

Klik in je PI dashbord op de prompt icon links boven en voer in.

sudo nano /etc/dhcpcd.conf

Youâ€™ll now carry out the configuration of the static IP address. If your Raspberry Pi is connected to the internet via an Ethernet or network cable, then enter the command â€˜interface eth0â€™; if it takes place over Wi-Fi, then use the â€˜interface wlanâ€™ command.

To assign an IP address to Raspberry Pi, use the command â€˜static ip_address=â€™ followed by the desired IPv4 address and the suffix â€˜/24â€™ (an abbreviation of the subnet mak 255.255.255.0). For example, if you want to link a computer with the IPv4 address 192.168.0.4, then you need to use the command â€˜static ip_address=192.168.0.4/24â€™. It goes without saying that the address used here is not yet used anywhere else. As such, it also canâ€™t be located in the address pool of a DHCP server.

You still then need to specify the address of your gateway and domain name server (usually both are the router). Raspberry Pi turns to the gateway address if an IP address to which it wants to send something is outside of the subnet mask (in the example, this would mean outside of the range 192.168.0). In the following command, the IPv4 address 192.168.0.1 is used as an example as both the gateway and DNS server. The complete command looks like this in our example (where a network cable is used for the internet connection):

interface eth0
static ip_address=192.168.1.131/24
static routers=192.168.1.1
static domain_name_servers=192.168.1.1

interface wlan0
static ip_address=192.168.1.132/24
static routers=192.168.1.1
static domain_name_servers=192.168.1.1 
sudo reboot
 Kijk op de PC of the Raspberry pi berijkbaar is op het nieuwe IP Adres 
Ping 192.168.1.131

Bestandbeheer via WinSCP en Remote command line
We activeren SSH op de Raspberry PI
sudo raspi-config

5 Interfacing Options
P2 SSH
<Ja>
<Ok>
<Finish>

We installeren op de PC WinSCP



Ga naar de website https://winscp.net/eng/docs/lang:nl en download WinSCP via de link https://winscp.net/download/WinSCP-5.15.3-Setup.exe



Installer WInSCP en start het programma

Maak verbinding met 192.168.1.132

Overnemen van scherm PI op je PC
Om vanuit je PC op de PI te werken gaan we het scherm oveneen op de PC. We actieverenVNC op de PI. Type:

sudo raspi-config

5 Interfacing Options
P3 VNC
<Ja>
<Ok>
<Finish>
We installeren de VNC Viewer op de PC

Download Real VNC op https://www.realvnc.com/en/connect/download/viewer/ en installer de applicatie.



Aanpassen scherm resolutie VNC

sudo nano /boot/config.txt
Invoeren

hdmi_force_hotplug=1
hdmi_ignore_edid=0xa5000080
hdmi_group=2

hdmi_mode=16

Maak verbinding met je PI via adres 192.168.1.132, Gebruiker pi en wachtwoord {pi_password}

Nu kunnen we het Scherm van de PI en toetsenbord en muis ontkoppelen.

Installeer Atom voor het schrijven van code
Dit nog beschrijven door MVK

Installeer nodejs en npm
We installeren node js en npm. Node is onze webserver en websocket server.

sudo apt-get update --fix-missing
sudo apt-get install -y nodejs npm
Voor het bouwen van een website op de PI met node hebben we express. Deze installeren we m.b.v. npm.

npm install express

Hierna kunnen we een klein website programma maken met hello world. Maak een bestand aan app.js en zet hierin volgende tekst.
var express = require('express');
var app = express();
app.get('/', function (req, res) {
       res.send('Hello World!');
});
app.listen(3000, function () {
       console.log('Example app listening on port 3000!');
});
Start de app door invoeren op de prompt

node app

Ga naar je PC en start een browser. Type hier in de addressbalk

http://192.168.1.132

In het scherm verschijnt Hello World!

De weberver werkt nu op je PI

IO Aansturen vanuit je PI
Pin layout van de PI
Voor het aansturen van IO bekijken we eerste de pin layout van de J8 aansluiting.





Type

npm install onoff

Schakel de PI uit voordat je de spanning weghaalt

sudo shutdown -h now

Aansturen van een uitgang op de PI
Verbind een LED X8-7 GPIO4 - 

Enzovoort

Maak blink.js

var Gpio = require('onoff').Gpio; //include onoff to interact with the GPIO
var LED = new Gpio(4, 'out'); //use GPIO pin 4, and specify that it is output
var blinkInterval = setInterval(blinkLED, 250); //run the blinkLED function every 250ms

function blinkLED() { //function to start blinking
  if (LED.readSync() === 0) { //check the pin state, if the state is 0 (or off)
    LED.writeSync(1); //set pin state to 1 (turn LED on)
  } else {
    LED.writeSync(0); //set pin state to 0 (turn LED off)
  }
}

function endBlink() { //function to stop blinking
  clearInterval(blinkInterval); // Stop blink intervals
  LED.writeSync(0); // Turn LED off
  LED.unexport(); // Unexport GPIO to free resources
}

setTimeout(endBlink, 5000); //stop blinking after 5 seconds?

Inlezen van een ingang op de PI
var Gpio = require('onoff').Gpio; //include onoff to interact with the GPIO
var LED = new Gpio(4, 'out'); //use GPIO pin 4 as output
var pushButton = new Gpio(17, 'in', 'both'); //use GPIO pin 17 as input, and 'both' button presses, and releases should be handled

pushButton.watch(function (err, value) { //Watch for hardware interrupts on pushButton GPIO, specify callback function
  if (err) { //if an error
    console.error('There was an error', err); //output error message to console
  return;
  }
  LED.writeSync(value); //turn LED on or off depending on the button state (0 or 1)
});

function unexportOnClose() { //function to run when exiting program
  LED.writeSync(0); // Turn LED off
  LED.unexport(); // Unexport LED GPIO to free resources
  pushButton.unexport(); // Unexport Button GPIO to free resources
};

process.on('SIGINT', unexportOnClose); //function to run when user closes using ctrl+c

Automatisch starten van app.js bij aanzetten PI
Hiervoor moeten we een service installeen genaamd forever.

sudo npm -i install forever g

Nu kunnen we kijken of de app start met

forever start app.js

We stoppen de service met

forever stop app.js

Dit commando plaatsen we in de autostart. Dit bestand passen we aan met nano.

sudo nano /home/pi/.config/lxsession/LXDE-pi/autostart
Voer nu als laatste commando in 
@forever start app.js
Sla op met [CTRL]+[O], [Enter]

Sluit af met [CTRL]+[X]

Na het opstarten zal de app starten. Type daarvoor

reboot

Aanpassen pin bezetting servo-blaster
cd
cd PiBits/ServoBlaster/user
sudo nano servod.c
Pas aan in de file 
static char *default_p1_pins = "7,11,12,13,15,16,18,22"
in 
static char *default_p1_pins = "12"
Sluit af met [CTRL]+[X], [Y], [Enter]

Bestand maken en installeren en voor het ingaan van de wijzigingen moet je opnieuw opstarten

make
sudo make install
reboot



Belangrijke functies zijn niet meer beschikbaar over HTTP. Hiervoor is een beveiligde SSL verbinding nodig. Hieronder vallen

Geolocation â€” requires secure origins as of M50
Device motion / orientation
EME
getUserMedia
AppCache
Notifications
Voor testen bestaan volgende mogelijkheden

Secure the server with a publicly-trusted certificate. If the server is reachable from the Internet, several public CAs offer free, automatically-renewed server certificates.

http://localhost is treated as a secure origin, so if you're able to run your server from localhost, you should be able to test the feature on that server.

You can run chrome with the --unsafely-treat-insecure-origin-as-secure="http://example.com" flag (replacing "example.com" with the origin you actually want to test), which will treat that origin as secure for this session. Note that on Android and ChromeOS this requires having a device with root access/dev mode. (This flag is broken in Chrome 63 but fixed in Chrome 64 and later. Prior to Chrome 62, you must also include the --user-data-dir=/test/only/profile/dir to create a fresh testing profile for the flag to work.) 

Create a self-signed certificate for temporary testing. Direct use of such a certificate requires clicking through an invalid certificate interstitial, which is otherwise not recommended. Note that because of this interstitial click-through (which also prevents HTTPS-response caching), we recommend options (1) and (2) instead, but they are difficult to do on mobile. See this post on setting up a self-signed certificate for a server for more information on how to do this.

An alternative approach is to generate a self-signed root certificate which you place into the trust store of the developer PC/devices, and then issue one or more certificates for the test servers. Trusting the root certificate means that Chrome will treat the site as secure and load it without interstitials or impacting caching. One easy way of setting up and using a custom root certificate is to use the open source mkcert tool.

On a local network, you can test on your Android device using port forwarding to access a remote host as localhost.




Adres selectie MCP23017


Instellen configuratie

sudo raspi-config

5 Interfacing Options
P5 I2C
<Ja>
<Ok>
<Finish>

5 Interfacing Options
P2 SSH
<Ja>
<Ok>
<Finish>

5 Interfacing Options
P3 VNC
<Ja>
<Ok>
<Finish>





Uitschakelen van PI middels de prompt

sudo shutdown -h now

Opstarten van de website in kiosk mode



In terminal

sudo nano /home/pi/.config/lxsession/LXDE-pi/autostart
In editor invoeren

@lxpanel -â€“profile LXDE-pi
@pcmanfm â€“-desktop -â€“profile LXDE-pi
#@xscreensaver -no-splash
#@point-rpi
@xset s off
@xset -dpms
@xset s noblank
@sed -i 's/"exited_cleanly":false/"exited_cleanly":true/' /home/pi/.config/chromium/Default/Preferences
@chromium-browser --start-fullscreen --disable-session-crashed-bubble --noerrdialogs --no-default-browser-check --no-first-run --disable-infobars -- kiosk https://aliconnect.nl/aliconnector





Overnemen van het PI scherm



Activeer I2C op de PI

sudo raspi-config

5 Interfacing Options
P5 I2C
<Ja>
<Ok>
<Finish>
Kijk met WinSCP of bestand /dev/i2c-1 bestaat. Dit bestand maken we lees en schrijfbaar.

sudo chmod o+rw /dev/i2c*
Nu kunnen we een testprogramma maken en starten

Voorbeeld voor het gebruik
var MCP23017 = require('node-mcp23017');
var mcp = new MCP23017({
  address: 0x20, //default: 0x20
  device: '/dev/i2c-1', // '/dev/i2c-1' on model B | '/dev/i2c-0' on model A
  debug: true //default: false
});
/*
  By default all GPIOs are defined as INPUTS.
  You can set them all the be OUTPUTs by using the pinMode-Methode (see below),
  You can also disable the debug option by simply not passing it to the constructor
  or by setting it to false
*/
//set all GPIOS to be OUTPUTS
for (var i = 0; i < 16; i++) {
  mcp.pinMode(i, mcp.OUTPUT);
  //mcp.pinMode(i, mcp.INPUT);  //if you want them to be inputs
  //mcp.pinMode(i, mcp.INPUT_PULLUP);  //if you want them to be pullup inputs
}
mcp.digitalWrite(0, mcp.HIGH); //set GPIO A Pin 0 to state HIGH
mcp.digitalWrite(0, mcp.LOW); //set GPIO A Pin 0 to state LOW
/*
 to read an input use the following code-block.
  This reads pin Nr. 0 (GPIO A Pin 0)
  value is either false or true
*/
mcp.digitalRead(0, function (err, value) {
  console.log('Pin 0', value);
});
Voorbeeld (Blink 16 LEDs)

var MCP23017 = require('node-mcp23017');
 
var mcp = new MCP23017({
  address: 0x20, //all address pins pulled low 
  device: '/dev/i2c-1', // Model B 
  debug: false
});
 
/* 
  This function blinks 16 LED, each hooked up to an port of the MCP23017 
*/ 
var pin = 0;
var max = 16;
var state = false;
 
var blink = function() {
  if (pin >= max) {
    pin = 0; //reset the pin counter if we reach the end 
  }
 
  if (state) {
    mcp.digitalWrite(pin, mcp.LOW); //turn off the current LED 
    pin++; //increase counter 
  } else {
    mcp.digitalWrite(pin, mcp.HIGH); //turn on the current LED 
    console.log('blinking pin', pin);
  }
  state = !state; //invert the state of this LED 
};
 
//define all gpios as outputs 
for (var i = 0; i < 16; i++) {
  mcp.pinMode(i, mcp.OUTPUT);
}
 
setInterval(blink, 100); //blink all LED's with a delay of 100ms 


Servo aansturen









5 Interfacing Options
P2 SSH
<Ja>
<Ok>
<Finish>

5 Interfacing Options
P3 VNC
<Ja>
<Ok>
<Finish>



Aanpassen I2C Adres

Verbind A0,A1 en/of A2 met de GND of de VDD (+3.3V) om een binaire code te maken

111 = Adres 20







Activeer I2C





Bekijk alle I2C aangesloten modules

i2cdetect -y 1



npm install node-mcp23017 --save

Test



# Remote Control

## Bind AR6200 ann DX6i
1. Zet de zender uit
1. Plaats de bind plug op de BATT/BIND (of verbind pin 1 en 3)
1. Zet spanning op de omtvanger (de led zal gaan knipperen)
1. Zet de sticks in een neutrale positie. Gas (links) helemaal omlaag.
1. Trek de Trainer/Bind schakelaar (links achter op zender) omhoog en zet de zender aan.
1. Na enkele seconden brand de led continue en is de zender verbinden
1. Verwijder de bindplug (verbinding)
1. Indien de AR6200 blijft knipperen komt dit doordat de spanning van de ontvanger is weggevallen/verwijderd en dit niet bij de zender is gebeurd. Verder geen problemen.

## Configuration of the control (receiver)
Voor de truck hanteer ik volgende indeling
- BATT/BIND
- THROD = Left joystick: up-down = THROD/AUX 1 = Motor/Speed/Gas => Motor ESC
- AILE = Right joystick: left-right = Steering left/right => Steering Servo 
- ELEV = Right joystick: up-down = Switch gear, up=gear 1, middle=gear 2, down=gear 3 => Gear Servo
- RUDD = Left joystick: left-right 
- GEAR = Unlock aanhanger => Servo
- AUX 1 = Right joystick: left-right (DUALAILE Active & REVERSE AILE) = Steering left/right => Steering Servo back wheels

## Setup DX6i
1. SETUP LIST
		1. REVERSE/AILE-r, GEAR-R, FLAP-R (= AUX 1)
		1. WING TAIL MIX/DUALAILE=ACT
1. ADJUST LIST
		1. TRAVEL ADJ/GEAR=0 (kleine slag voor ontkoppel servo)
		1. SUBTRIM/FLAP (AUX 1)=90 corrigeren stuurfout 2e stuuras

