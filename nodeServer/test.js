var noble = require('@abandonware/noble');
var cors = require('cors');
var express = require('express');

var sUID = '4fafc2011fb5459e8fccc5c9c331914b';
var cUID = 'beb5483e36e14688b7f5ea07361b26a8';

noble.on('stateChange', function (state) {
    if (state === 'poweredOn') {
        //
        // Once the BLE radio has been powered on, it is possible
        // to begin scanning for services. Pass an empty array to
        // scan for all services (uses more time and power).
        //
        console.log('scanning...');
        noble.startScanning([sUID], false);
    }
    else {
        noble.stopScanning();
    }
})

noble.on('discover', function (peripheral) {
    // we found a peripheral, stop scanning
    noble.stopScanning();

    //
    // The advertisment data contains a name, power level (if available),
    // certain advertised service uuids, as well as manufacturer data,
    // which could be formatted as an iBeacon.
    //
    console.log('found peripheral:', peripheral.advertisement);
    //
    // Once the peripheral has been discovered, then connect to it.
    //
    peripheral.connect(function (err) {
        //
        // Once the peripheral has been connected, then discover the
        // services and characteristics of interest.
        //
        peripheral.discoverServices([sUID], function (err, services) 
        {
            services.forEach(function (service) 
            {
                console.log('found service:', service.uuid);
                service.discoverCharacteristics([], function (err, characteristics) 
                {
                    characteristics.forEach(function (characteristic) 
                    {
                        console.log('found characteristic:', characteristic.uuid);                                                    
                        if (characteristic.uuid == cUID)
                        {
                            var data = new Buffer.alloc(1,[0x44]);
                            console.log('data', data)
                            characteristic.write(data, false, function(params){console.log(params)});
                            console.log('data', data)
                            characteristic.write(data, false, function (params) {});
                            startServer(characteristic); // data is a buffer, withoutResponse is true|false                                                    
                        }
                    })                                        
                })
            })
        })
    })
})

function startServer(characteristic)
{
    console.log("starting middleware");
    
    const app = express();
    const router = express.Router();
    app.use(cors(
        {origin:'*'}
    ));
    app.use('/api', router)
    app.get('/', (req, res) => {
        res.send('Car Controller');
    });

    router.get('/forward', (req,res)=>{
        characteristic.write(new Buffer.alloc(1, [0x46]), false, function(params){console.log('foreward')})
        res.json({'Action':'Foreward'})
    });
    
    router.get('/back', (req, res) => {
        characteristic.write(new Buffer.alloc(1, [0x42]), false, function (params) { console.log('back') })
        res.json({ 'Action': 'Reverse' })
    });
    
    router.get('/left', (req, res) => {
        //TURN TIRES LEFT
        characteristic.write(new Buffer.alloc(1, [0x55]), false, function (params) { console.log('left') })
        res.json({ 'Action': 'Turn Tires Left' })
    });

    router.get('/right', (req, res) => {
        //TURN TIRES RIGHT
        characteristic.write(new Buffer.alloc(1, [0x54]), false, function (params) { console.log('right') })
        res.json({ 'Action': 'Turn Tires Right' })
    });

    router.get('/goLeft', (req, res) => {
        //TURN TIRES LEFT
        characteristic.write(new Buffer.alloc(1, [0x4C]), false, function (params) { console.log('go left') })
        res.json({ 'Action': 'Go Left' })
    });

    router.get('/goRight', (req, res) => {
        //TURN TIRES RIGHT
        characteristic.write(new Buffer.alloc(1, [0x52]), false, function (params) { console.log('go right') })
        res.json({ 'Action': 'Go Right' })
    });

    router.get('/stop', (req, res) => {
        characteristic.write(new Buffer.alloc(1, [0x53]), false, function (params) { console.log('stop') })
        res.json({ 'Action': 'Stop' })
    });

    router.get('/openDriverDoor', (req, res) => {
        characteristic.write(new Buffer.alloc(1, [0x44]), false, function (params) { console.log('ODD') })
        res.json({ 'Action': 'Open D Door' })
    });

    router.get('/openPassengerDoor', (req, res) => {
        characteristic.write(new Buffer.alloc(1, [0x50]), false, function (params) { console.log('OPD') })
        res.json({ 'Action': 'Open P Door' })
    });

    router.get('/straight', (req, res) => {
        characteristic.write(new Buffer.alloc(1, [0x56]), false, function (params) { console.log('S') })
        res.json({ 'Action': 'Straighten Wheels' })
    });

    router.get('/dance', (req, res) => {
        characteristic.write(new Buffer.alloc(1, [0x55]), false, function (params) { console.log('S') })
        characteristic.write(new Buffer.alloc(1, [0x46]), false, function (params) { console.log('S') })
        setTimeout(() => {
            characteristic.write(new Buffer.alloc(1, [0x42]), false, function (params) { console.log('S') })
        }, 2000);

        setTimeout(() => {
            characteristic.write(new Buffer.alloc(1, [0x54]), false, function (params) { console.log('S') })
            characteristic.write(new Buffer.alloc(1, [0x46]), false, function (params) { console.log('S') })
        }, 2000);

        setTimeout(() => {
            characteristic.write(new Buffer.alloc(1, [0x42]), false, function (params) { console.log('S') })
        }, 2000);

        setTimeout(() => {
            characteristic.write(new Buffer.alloc(1, [0x53]), false, function (params) { console.log('S') })
            characteristic.write(new Buffer.alloc(1, [0x56]), false, function (params) { console.log('S') })

        }, 2000);
        
        setTimeout(() => {
            characteristic.write(new Buffer.alloc(1, [0x44]), false, function (params) { console.log('ODD') })
            characteristic.write(new Buffer.alloc(1, [0x44]), false, function (params) { console.log('ODD') })
            characteristic.write(new Buffer.alloc(1, [0x50]), false, function (params) { console.log('OPD') })
            characteristic.write(new Buffer.alloc(1, [0x50]), false, function (params) { console.log('OPD') })
            characteristic.write(new Buffer.alloc(1, [0x44]), false, function (params) { console.log('ODD') })
            characteristic.write(new Buffer.alloc(1, [0x50]), false, function (params) { console.log('OPD') })
        }, 2000);

        setTimeout(() => {
            characteristic.write(new Buffer.alloc(1, [0x44]), false, function (params) { console.log('ODD') })
            characteristic.write(new Buffer.alloc(1, [0x50]), false, function (params) { console.log('OPD') })
        }, 2000);
        
        res.json({ 'Action': 'Dancing' })
        
    });


    app.listen(8000, '0.0.0.0', function () {
        console.log('Listening to port:  ' + 8000);
    });
}
