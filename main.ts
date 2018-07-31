enum dht11type {
    //% block="Celsius"
    Celsius,
    //% block="Fahrenheit"
    Fahrenheit,
    //% block="humidity"
    humidity
}

//% color=#F6421B icon="\uf2c9" block="DHT11"
namespace DHT11 {
    let pin = DigitalPin.P0;
    function signal_dht11(pin: DigitalPin): void {
        pins.digitalWritePin(pin, 0)
        basic.pause(18)
        let i = pins.digitalReadPin(pin)
        pins.setPull(pin, PinPullMode.PullUp);

    }

    /**
     * Set up the sensor and start reading data.
     *
     */
    //% block="DHT11 pin %pin_arg|data %data_type"
    //% blockId=reading_dht11_data
    //% pin_arg.fieldEditor="gridpicker" pin_arg.fieldOptions.columns=5
    //% pin_arg.fieldOptions.tooltips="false"
    //% weight=0
    export function dht11_read(pin_arg: DigitalPin, data_type: dht11type): number {
        basic.pause(1500)
        pin = pin_arg;
        signal_dht11(pin);

        // Wait for response header to finish
        while (pins.digitalReadPin(pin) == 1);
        while (pins.digitalReadPin(pin) == 0);
        while (pins.digitalReadPin(pin) == 1);

        let value = 0;
        let counter = 0;

        for (let i = 0; i <= 32 - 1; i++) {
            while (pins.digitalReadPin(pin) == 0);
            counter = 0
            while (pins.digitalReadPin(pin) == 1) {
                counter += 1;
            }
            if (counter > 4) {
                value = value + (1 << (31 - i));
            }
        }
        switch (data_type) {
            case 0:
                return (value & 0x0000ff00) >> 8;
            case 1:
                return ((value & 0x0000ff00) >> 8) * 9 / 5 + 32;
            case 2:
                return value >> 24;
            default:
                return 0;
        }
    }
}
