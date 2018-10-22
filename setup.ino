void setup() {
    Serial.begin(9600);
}

void loop() {
    int joystick = analogRead(A1);
    int mappedJoystickValue = map(joystick, 0, 1023, 0, 255);
    

    
    if (mappedJoystickValue < 90) {
        Serial.write(70);
    }

    int candySensor = analogRead(A0);

    
    if (candySensor > 30) {
        Serial.write(48);
    }

    delay(20);
}