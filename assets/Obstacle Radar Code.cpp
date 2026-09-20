#include <Servo.h>

// =================================
// CONFIGURATION DES BROCHES (PINS)
// =================================
//Servo
const int pinServo = 2;
//HC-SR04
const int pinEcho = 3;
const int pinTrig = 4;
//LEDs
const int pinRedLed = 5;
const int pinGreenLed = 6;
//Buzzer
const int pinBuzzer = 7;

// =================================
// INITIALISATION
// =================================
Servo myServo;
unsigned long lastBeepTime = 0;
bool buzzerState = false;

// =================================
// SEUIL À DÉTECTER / SIGNALER
// =================================
const int thresholdDistance = 30;

// =================================
// FONCTION DE CALCULER LA DISTANCE
// =================================
int readDistance(){
  digitalWrite(pinTrig, LOW);
  delayMicroseconds(2);
  digitalWrite(pinTrig, HIGH);
  delayMicroseconds(10);
  digitalWrite(pinTrig, LOW);

  long duration = pulseIn(pinEcho, HIGH, 30000); //5 m
  if(duration == 0){
    return -1;
  }
  //vitesse de son dans l'air est 340 m/s --> 0.034 cm/μs
  int distance = duration * 0.034 / 2;

  return distance;
}

// =================================
// FILTRE MÉDIAN
// =================================
int getFilteredDistance(){
  const int numberOfMeasurements = 5;
  int values[numberOfMeasurements];
  int validCount = 0;

  for(int i = 0; i < numberOfMeasurements; i++){
    int distance = readDistance();
    if(distance > 0){
      values[validCount] = distance;
      validCount++;
    }
    delay(5); //5 ms
  }

  if(validCount == 0){
    return -1;
  }

  //Trier en ordre croissant
  for(int i = 0; i < validCount - 1; i++){
    for(int j = i + 1; j < validCount; j++){
      if(values[j] < values[i]){
        int temp = values[i];
        values[i] = values[j];
        values[j] = temp;
      }
    }
  }

  //Médiane est la valeur du milieu
  if(validCount % 2 == 1){
    return values[validCount / 2];
  } else {
    return (values[validCount / 2 - 1] + values[validCount / 2]) / 2;
  }
}

// =================================
// FONCTION DE DÉTECTION
// =================================
String getStatus(int distance){
  if(distance > 0 && distance <= thresholdDistance){
    return "WARNING";
  } else {
    return "NORMAL";
  }
}

// =================================
// FONCTION DE RÉGLER LEDS ET BUZZER
// =================================
void updateAlerts(int distance){
  // =========================
  // NORMAL
  // =========================
  if(distance <= 0 || distance > thresholdDistance){
    digitalWrite(pinRedLed, LOW);
    digitalWrite(pinGreenLed, HIGH);
    noTone(pinBuzzer);
    buzzerState = false;
    lastBeepTime = millis();
    return;
  }

  // =========================
  // WARNING
  // =========================
  digitalWrite(pinRedLed, HIGH);
  digitalWrite(pinGreenLed, LOW);

  int beepInterval = map(distance, 1, thresholdDistance, 80, 500);
  beepInterval = constrain(beepInterval, 80, 500);

  //Pour ne pas utiliser delay(...) qui peut influencer le servo ou le capteur
  unsigned long currentTime = millis();
  if(currentTime - lastBeepTime >= beepInterval){
    lastBeepTime = currentTime;

    if(buzzerState){
      noTone(pinBuzzer);
      buzzerState = false;
    }else{
      tone(pinBuzzer, 1000);
      buzzerState = true;
    }
  }
}


void setup() {
  // =================================
  // INITIALISATION
  // =================================
  //Moniteur serie
  Serial.begin(9600);
  //HC-SR04
  pinMode(pinEcho, INPUT);
  pinMode(pinTrig, OUTPUT);
  //LEDs
  pinMode(pinRedLed, OUTPUT);
  pinMode(pinGreenLed, OUTPUT);
  //Buzzer
  pinMode(pinBuzzer, OUTPUT);
  //Servo
  myServo.attach(pinServo);
}


void loop() {
  //0 --> 180
  for(int angle = 0; angle <= 180; angle+=2){
    myServo.write(angle);
    delay(40); //40 ms

    int distance = getFilteredDistance();
    String status = getStatus(distance);
    updateAlerts(distance);
    Serial.print(angle);
    Serial.print(",");
    Serial.print(distance);
    Serial.print(",");
    Serial.println(status);
  }

  //180 --> 0
  for(int angle = 180; angle >= 0 ; angle-=2){
    myServo.write(angle);
    delay(40); //40 ms

    int distance = getFilteredDistance();
    String status = getStatus(distance);
    updateAlerts(distance);
    Serial.print(angle);
    Serial.print(",");
    Serial.print(distance);
    Serial.print(",");
    Serial.println(status);
  }
}