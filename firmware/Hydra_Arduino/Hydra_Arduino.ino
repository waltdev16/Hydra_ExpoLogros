#include <LiquidCrystal.h>
#include <Servo.h>

LiquidCrystal lcd(7, 6, 5, 4, 3, 2);

const int trigger = 12;
const int echo = 11;

const int pinPH = A0;

const float alturaLata = 11.0;
const float radioLata  = 3.0;

Servo servoMotor;
const int servoPin = 9;

String estadoTapa = "Abierta";

void setup() {
  lcd.begin(16, 2);
  pinMode(trigger, OUTPUT);
  pinMode(echo, INPUT);
  Serial.begin(9600);
  servoMotor.attach(servoPin);

  lcd.print("Medidor Volumen");
  delay(2000);
  lcd.clear();
}

float leerPH() {
  float sumaPH = 0;
  for (int i = 0; i < 10; i++) {
    int raw = analogRead(pinPH);
    float volt = raw * (5.0 / 1023.0);
    float ph = (-5.5556 * volt) + 31.166;
    sumaPH += ph;
    delay(50);
  }
  return sumaPH / 10;
}

void loop() {
  digitalWrite(trigger, LOW);
  delayMicroseconds(2);
  digitalWrite(trigger, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigger, LOW);
  long duracion = pulseIn(echo, HIGH);
  float distancia = duracion * 0.034 / 2.0;

  float hLiquido = alturaLata - distancia;
  hLiquido = constrain(hLiquido, 0, alturaLata);
  float volumen = 3.1416 * radioLata * radioLata * hLiquido;

  float valorPH = leerPH();

  if (volumen >= 220) {
    servoMotor.write(180);
    estadoTapa = "Cerrada";
    delay(1000);
  } else {
    servoMotor.write(0);
    estadoTapa = "Abierta";
  }

  Serial.print("Volumen: ");
  Serial.print(volumen, 0);
  Serial.print(" | Estado: ");
  Serial.print(estadoTapa);
  Serial.print("  pH: ");
  Serial.println(valorPH, 2);

  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print("pH: ");
  lcd.print(valorPH, 2);
  lcd.setCursor(0, 1);
  lcd.print("Vol: ");
  lcd.print(volumen, 0);
  lcd.print(" mL");

  delay(1000);
}
