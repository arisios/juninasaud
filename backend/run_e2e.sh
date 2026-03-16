#!/bin/bash

NFC="NFC_E2E_$(date +%s)"

echo "🔐 LOGIN PRODUTOR"
PROD_TOKEN=$(curl -s -X POST http://localhost:3000/producers/login \
-H "Content-Type: application/json" \
-d '{"name":"Produtor JWT","password":"123456"}' | jq -r .token)

if [ "$PROD_TOKEN" = "null" ]; then
  echo "❌ Falha login produtor"
  exit 1
fi

PROD_ID=$(echo $PROD_TOKEN | cut -d "." -f2 | base64 -d 2>/dev/null | jq -r .id)

echo "📅 CRIANDO EVENTO"
EVENT=$(curl -s -X POST http://localhost:3000/events \
-H "Content-Type: application/json" \
-H "Authorization: Bearer $PROD_TOKEN" \
-d '{"name":"Evento E2E"}')

EVENT_ID=$(echo $EVENT | jq -r .id)

echo "👤 CRIANDO EXPOSITOR"
EXHIBITOR=$(curl -s -X POST http://localhost:3000/exhibitors \
-H "Content-Type: application/json" \
-H "Authorization: Bearer $PROD_TOKEN" \
-d "{\"producer_id\":\"$PROD_ID\",\"name\":\"Expositor E2E\"}")

EXHIBITOR_ID=$(echo $EXHIBITOR | jq -r .id)

echo "🧑‍💼 LOGIN AUDITOR"
AUD_TOKEN=$(curl -s -X POST http://localhost:3000/auditors/login \
-H "Content-Type: application/json" \
-d '{"nfc_uid":"AUDJWT2","password":"123456"}' | jq -r .token)

echo "🚀 OPENING"
OPENING=$(curl -s -X POST http://localhost:3000/opening \
-H "Content-Type: application/json" \
-H "Authorization: Bearer $AUD_TOKEN" \
-d "{\"event_id\":\"$EVENT_ID\",\"exhibitor_id\":\"$EXHIBITOR_ID\",\"booth_name\":\"Stand E2E\",\"audit_interval_minutes\":1,\"nfc_uid\":\"$NFC\"}")

BOOTH_ID=$(echo $OPENING | jq -r .booth.id)

echo "⏳ AGUARDANDO 65s"
sleep 65

echo "🔁 PERIODIC"
curl -s -X POST http://localhost:3000/periodic \
-H "Content-Type: application/json" \
-H "Authorization: Bearer $AUD_TOKEN" \
-d "{\"booth_id\":\"$BOOTH_ID\",\"value\":500}"

echo
echo "🏁 FINAL"
curl -s -X POST http://localhost:3000/final \
-H "Content-Type: application/json" \
-H "Authorization: Bearer $AUD_TOKEN" \
-d "{\"booth_id\":\"$BOOTH_ID\",\"value\":1000}"

echo
echo "📊 DASHBOARD"
curl -s http://localhost:3000/events/$EVENT_ID/dashboard \
-H "Authorization: Bearer $PROD_TOKEN"

echo
echo "✅ E2E FINALIZADO"
