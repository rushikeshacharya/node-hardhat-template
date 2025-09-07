# 

## Postman Collection

1. Deploy Contract: <http://localhost:3000/contract/deploy>
2. Store Readings: <http://localhost:3000/contract/storeReading>
    Body:
        {
            "timestamp": "123456",
            "temperature": "25",
            "unit": "C",
            "latitude": "789456",
            "longitude": "789456"
        }
3. Get Readings: <http://localhost:3000/contract/getReading>
    Body:
        {
            "timestamp": "123456",
            "latitude": "789456",
            "longitude": "789456"
        }
