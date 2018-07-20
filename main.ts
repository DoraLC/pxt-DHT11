enum dht11type {
    //% block="Celsius"
    Celsius,
    //% block="Fahrenheit"
    Fahrenheit,
    //% block="humidity"
    humidity
}

//% color=#F6421B icon="\uf2c9" block="dht11"
namespace dht11 {
    let temp = 0
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
    //% block="Start reading data from pin %pinarg"
    //% blockId=reading_dht11_data
    //% weight=0
    export function dht11_read(pin_arg: DigitalPin): void {
        basic.pause(1000)
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
        temp = value
    }

    /** Show specific data after reading from thr DHT11.  
     *  
    */
    //% block="DHT11 get %data_type"
    //% blockId=showing_dht11_data
    export function showingData(data_type: dht11type): number {
        switch (data_type) {
            case dht11type.Celsius:
                return (temp & 0x0000ff00) >> 8;
            case dht11type.Fahrenheit:
                return (temp & 0x0000ff00) >> 8 * 9 / 5 + 32;
            case dht11type.humidity:
                return temp >> 24;
            default:
                return 0;
        }
    }
}
