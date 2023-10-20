export const NODE_TEMPLATES = {
    greaterThan() {
        return {
            type: "greaterThan",
            A: 0,
            B: 0,
            wasTrue: false,
            outputs: {
                TRIGGER: {

                }
            }
        };
    }
}
"type": "greaterThan",
      "x": 493,
      "y": 374,
      "uuid": "64a01e20-8978-410f-9290-3d46a0ebd8ca",
      "A": 0,
      "B": -10,
      "wasTrue": false,
      "outputs": {
        "TRIGGER": {
          "name": "TRIGGER",
          "noText": true,
          "offsetX": 220,
          "offsetY": 49,
          "targets": [
            {
              "uuid": "0c074bfc-c000-4c86-8435-651fcf886488",
              "field": "PRESS"
            }
          ],
          "valueType": "bool"
        }
      },
      "inputs": {
        "A": {
          "offsetX": 0,
          "offsetY": 29,
          "source": "c2cf5b4d-0e3c-4b17-af9a-f6ad50ca7cfd",
          "sourceField": "X",
          "valueType": "number"
        },
        "B": {
          "offsetX": 0,
          "offsetY": 49,
          "source": "9ad0fbaf-0545-4200-93f9-5591085767ed",
          "sourceField": "value",
          "valueType": "number"
        }
      }