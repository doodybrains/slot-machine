const portName = '/dev/cu.usbmodem14311';
let serial;
let log;
const ImageArrayOne = ['images/1-1.png', 'images/1-2.png', 'images/1-3.png', 'images/2-1.png', 'images/2-2.png', 'images/2-3.png', 'images/3-1.png', 'images/3-2.png', 'images/3-3.png'];
const ImageArrayTwo = ['images/1-1.png', 'images/1-2.png', 'images/1-3.png', 'images/2-1.png', 'images/2-2.png', 'images/2-3.png', 'images/3-1.png', 'images/3-2.png', 'images/3-3.png'];
const ImageArrayThree = ['images/1-1.png', 'images/1-2.png', 'images/1-3.png', 'images/2-1.png', 'images/2-2.png', 'images/2-3.png', 'images/3-1.png', 'images/3-2.png', 'images/3-3.png'];

function setup() {
	createCanvas(windowWidth, windowHeight);
	addHTML();
	// serial = new p5.SerialPort();
	// serial.on('data', serialEvent);
	// serial.open(portName);
	createSlotSection(ImageArrayOne, '1');
	createSlotSection(ImageArrayTwo, '2');
	createSlotSection(ImageArrayThree, '3');
	
	let duration = 1;
	startSlotMachine(duration);
}

function createSlotSection(array, no) {
	const slotAngle = 360 / 9;

	let slotSectionWrapper = createDiv().size('100%', '100%');
	slotSectionWrapper.id(`slot-${no}`);
	slotSectionWrapper.class('slot');
	slotSectionWrapper.parent('window');

	for (let i=0; i<array.length; i++) {
		let slotItem = createDiv();
		slotItem.class('slot-item');
		let slotImage = createImg(array[i]);
		slotItem.style('transform', `rotateX(${slotAngle * i}deg) translateZ(460px)`);
		slotItem.child(slotImage);
		slotSectionWrapper.child(slotItem);
	}
}

function startSlotMachine(duration) {
	const landedSlots = [];

	for(var i = 1; i < 4; i++) {
		const slotReel = document.getElementById(`slot-${i}`);
		let randomSpinClassNo = randomize();

		slotReel.style.animation = `spin-${randomSpinClassNo} ${duration + i * 0.05}s`;
		slotReel.className += ` spin-${randomSpinClassNo}`;

		landedSlots.push(randomSpinClassNo);
	}
	
	const allThree = landedSlots[0] === landedSlots[1] === landedSlots[2];
	const firstTwo = landedSlots[0] === landedSlots[1];
	const lastTwo = landedSlots[1] === landedSlots[2];
	const firstLastTwo = landedSlots[0] === landedSlots[2];

	if ( allThree ) {
		showWinScreen();
	}
}

function showWinScreen() {
	console.log('you wonnn!');
}

function randomize() {
	return Math.floor(Math.random() * 9);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function addHTML() {
	log = document.getElementById('log');
	log.innerHTML = `data values: `;
}

function serialEvent() {
	let dataValue = Number(serial.read());
	log.innerHTML = `data values: ${dataValue}`;
}