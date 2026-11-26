#include <WiFiNINA.h>
#include <Firebase_Arduino_WiFiNINA.h>

#define WIFI_SSID "YOUR_WIFI_SSID"
#define WIFI_PASSWORD "YOUR_WIFI_PASSWORD"

#define FIREBASE_HOST "YOUR_FIREBASE_HOST"
#define FIREBASE_AUTH "YOUR_FIREBASE_AUTH"

FirebaseData firebaseData;

void setup() {
  Serial.begin(9600);
  Serial1.begin(9600);

  Serial.print("Conectando a WiFi");
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  int intentos = 0;
  while (WiFi.status() != WL_CONNECTED && intentos < 20) {
    delay(500);
    Serial.print(".");
    intentos++;
  }
  if (WiFi.status() == WL_CONNECTED) {
    Serial.println(" Conectado a WiFi!");
    Serial.print("IP: ");
    Serial.println(WiFi.localIP());
  } else {
    Serial.println(" Error: no se pudo conectar a WiFi");
  }

  Firebase.begin(FIREBASE_HOST, FIREBASE_AUTH, WIFI_SSID, WIFI_PASSWORD);
  Firebase.reconnectWiFi(true);
}

void loop() {
  if (Serial1.available()) {
    String data = Serial1.readStringUntil('\n');
    data.trim();
    Serial.println("Dato recibido: " + data);

    float volumen = 0;
    float valorPH = 0;
    String estadoTapa = "";

    int posVolumen = data.indexOf("Volumen:");
    int posEstado = data.indexOf("Estado:");
    int posPH = data.indexOf("pH:");

    if (posVolumen >= 0 && posPH > posVolumen) {
      String volumenStr = data.substring(posVolumen + 8, data.indexOf("|", posVolumen));
      volumenStr.trim();
      volumen = volumenStr.toFloat();

      String estadoStr = data.substring(posEstado + 8, data.indexOf("pH:", posEstado));
      estadoStr.trim();
      estadoTapa = estadoStr;

      String phStr = data.substring(posPH + 3);
      phStr.trim();
      valorPH = phStr.toFloat();
    } else {
      Serial.println("Formato de datos no reconocido");
      return;
    }

    Serial.print("Volumen: ");
    Serial.print(volumen);
    Serial.print(" | pH: ");
    Serial.print(valorPH, 2);
    Serial.print(" | Estado: ");
    Serial.println(estadoTapa);

    if (volumen >= 0) {
      if (Firebase.setFloat(firebaseData, "/Users/volumen", volumen)) {
        Serial.println("Volumen enviado correctamente a Firebase");
      } else {
        Serial.print("Error al enviar volumen: ");
        Serial.println(firebaseData.errorReason());
      }
    }

    if (valorPH > 0) {
      if (Firebase.setFloat(firebaseData, "/Users/pH", valorPH)) {
        Serial.println("pH enviado correctamente a Firebase");
      } else {
        Serial.print("Error al enviar pH: ");
        Serial.println(firebaseData.errorReason());
      }
    }

    if (estadoTapa != "") {
      if (Firebase.setString(firebaseData, "/Users/estadoTapa", estadoTapa)) {
        Serial.println("Estado de la tapa enviado correctamente a Firebase");
      } else {
        Serial.print("Error al enviar estado de la tapa: ");
        Serial.println(firebaseData.errorReason());
      }
    }
  }

  delay(1000);
}
