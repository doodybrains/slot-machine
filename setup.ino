void setup() {
    Serial.begin(9600);
}

void loop() {
    int joystick = analogRead(A1);
    int mappedValue = map(joystick, 0, 1023, 0, 255);
    Serial.write(mappedValue);
}
