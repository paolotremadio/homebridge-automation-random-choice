# Automation - Random selection accessory

Example config.json:

```
    "accessories": [
        {
            "accessory": "AutomationRandomChoice",
            "name": "Test",
            "sensors": 3
        }  
    ]

```

This accessory will create a fake switch and N fake motion sensors. Turning the switch on will detect a movement on one of the N sensors (chosen randomly).
The switch will turn off automatically to help with the automation. After few seconds, the sensor will stop detecting movement, to help with automation.

# Example: Select random scene
1. Create accessory
2. Link a physical button to the accessory switch (clicking the button will turn on the switch)
3. Link an automation for each sensor (when movement is detected). Each sensor will trigger a difference scene
4. Click the physical button, a random scene will be selected each single time 