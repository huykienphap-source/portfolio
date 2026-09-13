#include <IRremote.hpp>
#include <Servo.h>

// =========================
// Initialisation
// =========================

// IR Remote
const int IR_PIN = 2;

// LED
const int LED_GREEN = 5;
const int LED_YELLOW = 3;
const int LED_RED = 4;

// Servo
const int SERVO_PIN = 9;

// HC-SR04
const int TRIG_PIN = 7;
const int ECHO_PIN = 8;

// =========================
// Objet
// =========================

Servo doorServo;

// =========================
// État de porte
// =========================

enum DoorState {
  CLOSED,
  OPENING,
  OPEN,
  CLOSING
};

DoorState doorState = CLOSED;

// =========================
// Angle de Servo
// =========================

const int CLOSED_ANGLE = 0;
const int OPEN_ANGLE = 90;

int currentAngle = CLOSED_ANGLE;

// =========================
// REMOTE
// =========================

// Nút số 1 → MỞ
const uint8_t BUTTON_OPEN = 12;

// Nút số 2 → ĐÓNG
const uint8_t BUTTON_CLOSE = 24;

// =========================
// HC-SR04
// =========================

const float DETECTION_DISTANCE = 10.0;

// =========================
// Temps de fermeture
// =========================

const unsigned long AUTO_CLOSE_DELAY = 2000;

unsigned long openTime = 0;

// =========================
// Vitesse de Servo
// =========================

const int SERVO_DELAY = 5;

// =========================
// SETUP
// =========================

void setup() {

  // IR
  IrReceiver.begin(IR_PIN, ENABLE_LED_FEEDBACK);
  
  Serial.begin(9600);

  // LED
  pinMode(LED_GREEN, OUTPUT);
  pinMode(LED_YELLOW, OUTPUT);
  pinMode(LED_RED, OUTPUT);

  // Servo
  doorServo.attach(SERVO_PIN);

  // Servo initial = 0°
  currentAngle = CLOSED_ANGLE;
  doorServo.write(CLOSED_ANGLE);

  // HC-SR04
  pinMode(TRIG_PIN, OUTPUT);
  pinMode(ECHO_PIN, INPUT);

  // LED ban đầu
  updateLED();
}

// =========================
// LOOP
// =========================

void loop() {

  // =======================
  // 1. Vérifier REMOTE
  // =======================

  if (IrReceiver.decode()) {

    uint8_t command =
      IrReceiver.decodedIRData.command;

    // Bouton 1 → ouverture
    if (command == BUTTON_OPEN) {
      openDoor();
    }

    // Bouton 2 → fermeture
    else if (command == BUTTON_CLOSE) {
      closeDoor();
    }

    IrReceiver.resume();
  }

  // =======================
  // 2. Vérifier HC-SR04
  // =======================

  float distance = getDistance();
  
	Serial.print("Distance: ");
	Serial.print(distance);
	Serial.println(" cm");

  // Objet ≤ 10 cm
  if (distance > 0 &&
      distance <= DETECTION_DISTANCE &&
      doorState == CLOSED) {

    openDoor();
  }

  // =======================
  // 3. Fermer automatiquement après 2s
  // =======================

  if (doorState == OPEN) {

    if (millis() - openTime >= AUTO_CLOSE_DELAY) {

      closeDoor();
    }
  }
}

// =========================
// Calculer de distance avec HC-SR04
// =========================

float getDistance() {

  // TRIG LOW
  digitalWrite(TRIG_PIN, LOW);
  delayMicroseconds(2);

  // Signal à chaque 10 µs
  digitalWrite(TRIG_PIN, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIG_PIN, LOW);

  // Lire le temps de ECHO
  long duration = pulseIn(ECHO_PIN, HIGH, 30000);

  // Pas de signal
  if (duration == 0) {
    return -1;
  }

  // Calculer la distance cm
  float distance = duration * 0.0343 / 2;

  return distance;
}

// =========================
// Contrôler SERVO
// =========================

void moveServo(int targetAngle) {

  // Mở servo
  if (currentAngle < targetAngle) {

    for (int angle = currentAngle;
         angle <= targetAngle;
         angle++) {

      doorServo.write(angle);
      delay(SERVO_DELAY);
    }
  }

  // Fermer le servo
  else if (currentAngle > targetAngle) {

    for (int angle = currentAngle;
         angle >= targetAngle;
         angle--) {

      doorServo.write(angle);
      delay(SERVO_DELAY);
    }
  }

  // Mettre à jour l'angle
  currentAngle = targetAngle;

  // Assurer l'angle
  doorServo.write(targetAngle);
}

// =========================
// Ouverture
// =========================

void openDoor() {

  // Si déjà ouverte
  if (doorState == OPEN) {
    return;
  }

  doorState = OPENING;
  updateLED();

  // 0° → 90°
  moveServo(OPEN_ANGLE);

  doorState = OPEN;

  // Commencer à compter dans 2s
  openTime = millis();

  updateLED();
}

// =========================
// Fermeture
// =========================

void closeDoor() {

  // Si déjà fermée
  if (doorState == CLOSED) {
    return;
  }

  doorState = CLOSING;
  updateLED();

  // 90° → 0°
  moveServo(CLOSED_ANGLE);

  doorState = CLOSED;

  updateLED();
}

// =========================
// Contrôler LED
// =========================

void updateLED() {

  // désactiver tous
  digitalWrite(LED_GREEN, LOW);
  digitalWrite(LED_YELLOW, LOW);
  digitalWrite(LED_RED, LOW);

  // =====================
  // Fermeture
  // =====================

  if (doorState == CLOSED) {

    digitalWrite(LED_RED, HIGH);
  }

  // =====================
  // En cours
  // =====================

  else if (doorState == OPENING ||
           doorState == CLOSING) {

    digitalWrite(LED_YELLOW, HIGH);
  }

  // =====================
  // Ouverture
  // =====================

  else if (doorState == OPEN) {

    digitalWrite(LED_GREEN, HIGH);
  }
}