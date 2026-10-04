#include <Servo.h>

// =================================
// CONFIGURATION DES BROCHES (PINS)
// =================================
//Boutons
const int pinGearButton = 2;
const int pinFlapIncButton = 3;
const int pinFlapDecButton = 4;

//LEDs
const int pinRedLed = 5;
const int pinYellowLed = 6;
const int pinGreenLed = 7;

//Servos
const int pinServoPropeller = 9;
const int pinServoHead = 10;
const int pinServoFlapInc = 11;
const int pinServoFlapDec = 12;
const int pinServoGear = 13;

//Potentiomètre
const int pinPotHead = A0;
const int pinPotThrottle = A1;

// =================================
// INITIALISATION DE SERVOs
// =================================
Servo servoPropeller;
Servo servoHead;
Servo servoFlapInc;
Servo servoFlapDec;
Servo servoGear;

// =================================
// VARIABLES D'AFFICHAGE
// =================================
bool dashboardChanged = true;

int angleFlap = 0;
int angleHead = 90;
int throttle = 0;

// =================================
// INITIALISATION NÉCESSAIRE
// =================================
enum GearState {
  GEAR_CLOSED,
  GEAR_OPENING,
  GEAR_OPEN,
  GEAR_CLOSING
};

GearState gearState = GEAR_CLOSED;

unsigned long previousGearMillis = 0;
const unsigned long gearInterval = 15;

// =================================
// MISE À JOUR DE LEDs
// =================================
void updateLeds() {
  switch (gearState) {
    case GEAR_OPEN:
      digitalWrite(pinGreenLed, HIGH);
      digitalWrite(pinYellowLed, LOW);
      digitalWrite(pinRedLed, LOW);
      break;

    case GEAR_CLOSED:
      digitalWrite(pinGreenLed, LOW);
      digitalWrite(pinYellowLed, LOW);
      digitalWrite(pinRedLed, HIGH);
      break;

    case GEAR_OPENING:
    case GEAR_CLOSING:
      digitalWrite(pinGreenLed, LOW);
      digitalWrite(pinYellowLed, HIGH);
      digitalWrite(pinRedLed, LOW);
      break;
  }
}

// =================================
// MISE À JOUR DE TRAIN D'ATTERRISSAGE
// =================================
void updateGear() {
  //static giữ lại giá trị lần trước
  static bool lastButtonState = HIGH;
  bool currentButtonState = digitalRead(pinGearButton);
  //Phát hiện lúc vừa nhấn button
  if (lastButtonState == HIGH && currentButtonState == LOW) {
    if (gearState == GEAR_CLOSED) {
      gearState = GEAR_OPENING;
      dashboardChanged = true;
    } else if (gearState == GEAR_OPEN) {
      gearState = GEAR_CLOSING;
      dashboardChanged = true;
    }
  }
  lastButtonState = currentButtonState;

  unsigned long currentMillis = millis();

  if (currentMillis - previousGearMillis >= gearInterval) {
    previousGearMillis = currentMillis;
    //90° --> 0°
    if (gearState == GEAR_OPENING) {
      int angle = servoGear.read();
      if (angle > 0) {
        servoGear.write(angle - 1);
      } else {
        gearState = GEAR_OPEN;
        dashboardChanged = true;
      }
    }

    //0° --> 90°
    else if (gearState == GEAR_CLOSING) {
      int angle = servoGear.read();
      if (angle < 90) {
        servoGear.write(angle + 1);
      } else {
        gearState = GEAR_CLOSED;
        dashboardChanged = true;
      }
    }

  }
}

// =================================
// MISE À JOUR DE VOLETS
// =================================
void updateFlaps() {
  static bool lastIncState = HIGH;
  static bool lastDecState = HIGH;

  bool currentIncState = digitalRead(pinFlapIncButton);
  bool currentDecState = digitalRead(pinFlapDecButton);

  static unsigned long lastIncMillis = 0;
  static unsigned long lastDecMillis = 0;

  unsigned long currentMillis = millis();

  // FLAPS +
  if (lastIncState == HIGH && currentIncState == LOW) {
    if (currentMillis - lastIncMillis >= 250) {
      lastIncMillis = currentMillis;

      if (angleFlap < 40) {
        angleFlap += 10;
        servoFlapInc.write(angleFlap);
        servoFlapDec.write(180 - angleFlap);
        dashboardChanged = true;
      }
    }
  }

  // FLAPS -
  if (lastDecState == HIGH && currentDecState == LOW) {
    if (currentMillis - lastDecMillis >= 250) {
      lastDecMillis = currentMillis;

      if (angleFlap > 0) {
        angleFlap -= 10;
        servoFlapInc.write(angleFlap);
        servoFlapDec.write(180 - angleFlap);
        dashboardChanged = true;
      }
    }
  }

  lastIncState = currentIncState;
  lastDecState = currentDecState;
}

// =================================
// CHANGEMENT DU NEZ DE L'AVION
// =================================
void updateHead() {
  int oldAngleHead = angleHead;
  int potValue = analogRead(pinPotHead);
  angleHead = map(potValue, 0, 1023, 50, 130);
  angleHead = constrain(angleHead, 50, 130);
  servoHead.write(angleHead);

  if (angleHead != oldAngleHead) {
    dashboardChanged = true;
  }
}

// =================================
// MISE À JOUR DE MANETTE DES GAZ
// =================================
void updateThrottle() {
  int oldThrottle = throttle;
  int potValue = analogRead(pinPotThrottle);
  throttle = map(potValue, 0, 1023, 0, 100);
  throttle = constrain(throttle, 0, 100);

  if (throttle != oldThrottle) {
    dashboardChanged = true;
  }
}

// =================================
// INTERFACE
// =================================
void displayDashboard() {
  Serial.println();
  Serial.println("================================");
  Serial.println("     FLIGHT CONTROL PANEL");
  Serial.println("================================");
  Serial.println();

  //TRAIN
  Serial.print("GEAR : ");
  switch (gearState) {
    case GEAR_CLOSED:
      Serial.println("RETRACTED");
      break;

    case GEAR_OPENING:
      Serial.println("EXTENDING");
      break;

    case GEAR_OPEN:
      Serial.println("EXTENDED");
      break;

    case GEAR_CLOSING:
      Serial.println("RETRACTING");
      break;
  }

  //VOLETS
  Serial.print("FLAPS : ");
  Serial.print(angleFlap);
  Serial.println("°");

  //TANGAGE / NEZ
  Serial.print("PITCH : ");
  int pitch = angleHead - 90;

  if (pitch > 0) {
    Serial.print("+");
  }

  Serial.print(pitch);
  Serial.println("°");

  //MANETTE DE GAZ
  Serial.print("THROTTLE : ");
  Serial.print(throttle);
  Serial.print("% | ");

  if (throttle <= 10) {
    Serial.println("IDLE"); //RALENTI
  }
  else if (throttle <= 30) {
    Serial.println("LOW POWER"); //FAIBLE PUISSANCE
  }
  else if (throttle <= 70) {
    Serial.println("CRUISE"); //CROISIÈRE
  }
  else if (throttle <= 90) {
    Serial.println("HIGH POWER"); //FORTE PUISSANCE
  }
  else {
    Serial.println("MAX POWER"); //PUISSANCE MAXIMALE
  }

  Serial.println();
  Serial.println("================================");
}

void setup() {
  // =================================
  // INITIALISATION
  // =================================
  //Moniteur serie
  Serial.begin(9600);

  //Boutons
  //il y a une résistance interne avec INPUT_PULLUP
  //2 états: LOW(appuyer) / HIGH(rien faire)
  pinMode(pinGearButton, INPUT_PULLUP);
  pinMode(pinFlapIncButton, INPUT_PULLUP);
  pinMode(pinFlapDecButton, INPUT_PULLUP);

  //Potentiomètres
  pinMode(pinPotHead, INPUT);
  pinMode(pinPotThrottle, INPUT);

  //LEDs
  pinMode(pinRedLed, OUTPUT);
  pinMode(pinGreenLed, OUTPUT);
  pinMode(pinYellowLed, OUTPUT);

  //Servos
  servoHead.attach(pinServoHead);
  servoFlapInc.attach(pinServoFlapInc);
  servoFlapDec.attach(pinServoFlapDec);
  servoGear.attach(pinServoGear);

  servoHead.write(90);
  servoFlapInc.write(0); //chỉ đc di chuyển trong khoảng 40°
  servoFlapDec.write(180); //chỉ đc di chuyển trong khoảng 40°
  servoGear.write(90);

}

void loop() {
  updateGear();
  updateLeds();
  updateFlaps();
  updateHead();
  updateThrottle();

  if (dashboardChanged) {
    displayDashboard();

    dashboardChanged = false;
  }
}
