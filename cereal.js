const portName = '/dev/cu.usbmodem14311';
const ImageArrayOne = ['images/1-1.png', 'images/1-2.png', 'images/1-3.png', 'images/2-1.png', 'images/2-2.png', 'images/2-3.png', 'images/3-1.png', 'images/3-2.png', 'images/3-3.png'];
const ImageArrayTwo = ['images/1-1.png', 'images/1-2.png', 'images/1-3.png', 'images/2-1.png', 'images/2-2.png', 'images/2-3.png', 'images/3-1.png', 'images/3-2.png', 'images/3-3.png'];
const ImageArrayThree = ['images/1-1.png', 'images/1-2.png', 'images/1-3.png', 'images/2-1.png', 'images/2-2.png', 'images/2-3.png', 'images/3-1.png', 'images/3-2.png', 'images/3-3.png'];
const imagesPerArray = 9;
const maxTrys = 3;
const totalArrays = 3;
let serial;
let log;
let numberOfTrys = [];
let landedSlots = [];
let video;
let candy = 1;
let joystick = 1;
let winScreen;

function setup() {
	winScreen = document.getElementById('winner');

	video = createVideo('images/scary.mp4');
	video.pause();

	createCanvas(windowWidth, windowHeight);
	addHTML();

	serial = new p5.SerialPort();
	serial.on('data', serialEvent);
	serial.open(portName);

	createSlotSection(ImageArrayOne, '1');
	createSlotSection(ImageArrayTwo, '2');
	createSlotSection(ImageArrayThree, '3');
}

function randomize(no) {
	return Math.floor(Math.random() * no);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function addHTML() {
	log = document.getElementById('log');
	log.innerHTML = 'data values: ';
}

function createSlotSection(array, no) {
	const slotAngle = 360 / imagesPerArray;

	let slotSectionWrapper = createDiv().size('100%', '100%');

	slotSectionWrapper.id(`slot-${no}`);
	slotSectionWrapper.class('slot');
	slotSectionWrapper.parent('window');

	for (let i=0; i<array.length; i++) {
		let slotItem = createDiv();
		let slotImage = createImg(array[i]);

		slotItem.class('slot-item');
		slotItem.style('transform', `rotateX(${slotAngle * i}deg) translateZ(460px)`);
		slotItem.child(slotImage);
		slotSectionWrapper.child(slotItem);
	}
}

function startSlotMachine(duration) {
	landedSlots = [];
	winScreen = document.getElementById('winner');

	joystick = 3;
	video.pause();
	winScreen.style.display = 'none';

	if (numberOfTrys.length < maxTrys) {
		for(let i = 1; i < totalArrays + 1; i++) {
			const slotReel = document.getElementById(`slot-${i}`);
			let randomSpinClassNo = randomize(imagesPerArray);

			slotReel.style = '';
			slotReel.className = `slot `;
			slotReel.style.animation = `spin-${randomSpinClassNo} ${duration}s`;
			slotReel.className += ` spin-${randomSpinClassNo}`;
	
			landedSlots.push(randomSpinClassNo);
		}

		setTimeout(function() { 
			if (landedSlots[0] + landedSlots[1] + landedSlots[2] === 12) {
				showScaryScreen();
			} else if (landedSlots[0] === landedSlots[1] === landedSlots[2]) {
				showCandyScreen();
			} else {
				showTryAgainScreen();
			}
		}, 2300);
	} else {
		let randomSpinClassNo = randomize(imagesPerArray);

		for(let i = 1; i < totalArrays + 1; i++) {
			const slotReel = document.getElementById(`slot-${i}`);

			slotReel.style = '';
			slotReel.className = `slot `;
			slotReel.style.animation = `spin-${randomSpinClassNo} ${duration}s`;
			slotReel.className += ` spin-${randomSpinClassNo}`;

			setTimeout(function() { showCandyScreen(); }, 2300);
		}
	}
}

function showScaryScreen() {
	winScreen = document.getElementById('winner');
	winScreen.innerHTML = '';
	winScreen.style.display = 'flex';

	video.parent('winner');
	video.loop();
	
	setTimeout(function() {
		video.pause();
		video.remove();

		winScreen.innerHTML = '<p>put another candy in!</p>';
	}, 1800);

	landedSlots = [];
	numberOfTrys = [];
}

function showCandyScreen() {
	winScreen = document.getElementById('winner');
	winScreen.innerHTML = '<p>press button for candy!!</p>';
	winScreen.style.display = 'flex';

	serial.write('x');
	landedSlots = [];

	setTimeout(function(){ winScreen.style.display = 'none'; }, 2000)
	empty();
}

function empty() {
	numberOfTrys = [];
}

function showTryAgainScreen() {
	winScreen = document.getElementById('winner');
	winScreen.innerHTML = '<p>tryyy again!!</p>';
	winScreen.style.display = 'flex';

	numberOfTrys.push('tried');
	landedSlots = [];
}

function candyIn() {
	winScreen = document.getElementById('winner');
	winScreen.style.display = 'none';
	joystick = 1;
	candy = 3;

	let lever = select('#lever');
	lever.addClass('animate');
	
	setTimeout(function() {
		candy = 1;
		lever.removeClass('animate');
	}, 2000);
}

function serialEvent() {
	const dataValue = Number(serial.read());
	console.log('serial event', dataValue, candy);

	if (candy === 1 && dataValue === 48) {
		candy = 2;
	}

	if (candy === 2) {
		candyIn(); 
	}

	if (joystick === 1 && dataValue === 70) {
		joystick = 2;
	}
	
	if (joystick === 2) {
		startSlotMachine(1);
	}
}
