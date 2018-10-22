const portName = '/dev/cu.usbmodem14311';
let serial;
let log;
const ImageArrayOne = ['images/1-1.png', 'images/1-2.png', 'images/1-3.png', 'images/2-1.png', 'images/2-2.png', 'images/2-3.png', 'images/3-1.png', 'images/3-2.png', 'images/3-3.png'];
const ImageArrayTwo = ['images/1-1.png', 'images/1-2.png', 'images/1-3.png', 'images/2-1.png', 'images/2-2.png', 'images/2-3.png', 'images/3-1.png', 'images/3-2.png', 'images/3-3.png'];
const ImageArrayThree = ['images/1-1.png', 'images/1-2.png', 'images/1-3.png', 'images/2-1.png', 'images/2-2.png', 'images/2-3.png', 'images/3-1.png', 'images/3-2.png', 'images/3-3.png'];
let numberOfTrys = [];
let video;

function setup() {
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
	const winScreen = document.getElementById('winner');
	winScreen.style.display = 'none';
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
	video.pause();
	const landedSlots = [];
	const winScreen = document.getElementById('winner');
	winScreen.style.display = 'none';

	if (numberOfTrys.length < 6) {
		for(var i = 1; i < 4; i++) {
			const slotReel = document.getElementById(`slot-${i}`);
			let randomSpinClassNo = randomize(9);
			slotReel.style = '';
			slotReel.className = `slot `;
			slotReel.style.animation = `spin-${randomSpinClassNo} ${duration}s`;
			slotReel.className += ` spin-${randomSpinClassNo}`;
	
			landedSlots.push(randomSpinClassNo);
		}

		setTimeout(function() { 
			if (landedSlots[0] + landedSlots[1] + landedSlots[2] === 12 || landedSlots[0] + landedSlots[1] + landedSlots[2] === 9) {
				showScaryScreen();
			} else if (landedSlots[0] === landedSlots[1] === landedSlots[2]) {
				showCandyScreen();
			} else {
				showTryAgainScreen();
			}
		}, 2300);
	} else {
		let randomSpinClassNo = randomize(9);

		for(var i = 1; i < 4; i++) {
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
	const winScreen = document.getElementById('winner');
	winScreen.innerHTML = '';
	winScreen.style.display = 'flex';
	video.parent('winner');
	video.loop();
	
	setTimeout(function() {
		video.pause();
		video.remove();
		winScreen.innerHTML = '<p>Add another candy!</p>';
	}, 1800);

}

function showCandyScreen() {
	const winScreen = document.getElementById('winner');
	winScreen.innerHTML = '<p>press button for candy!!</p>';
	winScreen.style.display = 'flex';
}

function showTryAgainScreen() {
	const winScreen = document.getElementById('winner');
	winScreen.innerHTML = '<p>tryyy again!!</p>';
	winScreen.style.display = 'flex';

	numberOfTrys.push('tried');
	console.log(numberOfTrys.length);
}

function randomize(no) {
	return Math.floor(Math.random() * no);
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

	const above = dataValue === 26;
	log.innerHTML = `data values: ${dataValue}`;

	// if coinData === HIGH 
	// shakeLever function 

	// if dataValue === 26 

	
	if (!above) return;

	if (dataValue === 26) {
		initMachine();
		return;
	}
}

function initMachine() {
	startSlotMachine(2);
	return;
}