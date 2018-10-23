#include <Servo.h>

Servo myservo;
int pos = 0;

void setup() {
    Serial.begin(9600);
    pinMode(2, INPUT);
    myservo.attach(8); 
}

void loop() {
    int joystick = analogRead(A1);
    int mappedJoystickValue = map(joystick, 0, 1023, 0, 255);
    int buttonState = digitalRead(2);
    

    if (buttonState == 1) {
     for (pos = 0; pos <= 160; pos += 1) { 
        myservo.write(pos);
        delay(10);  
      }
      delay(5000);
      for (pos = 160; pos >= 0; pos -= 1) { 
        myservo.write(pos);
        delay(10);
      }
    }

    if (mappedJoystickValue < 90) {
        Serial.write(70);
    }

    int candySensor = analogRead(A0);

    
    if (candySensor > 30) {
        Serial.write(48);
    }

    delay(20);
}