# node-slcan

## Introduction

*** This has not been tested in the real world yet ***

Tools for a serial line can connection, using the protocol found here:  
http://www.can232.com/docs/can232_v3.pdf

This is not an unabridged rendition of the protocol.  This is missing bits that I don't currently
need.  If you need them added, please put in a issue (no promises when I might get to it) or a pull
request.

## Serial Port

This uses node-serialport to actually connect to the port.  Documentation for that project can be
found here:

https://serialport.io/docs/

## Usage

~~~~~ts
import Slcan from "slcan";
import SerialPort from "serialport";

const can = new Slcan(new SerialPort("/dev/ttyUSB0"));

can.on('data', (data) => {
    console.log(data);
    /* Returns data as:
     *  {
     *      id:  number,         // CAN id
     *      data: Buffer,        // CAN data,
     *      length: number,      // CAN length (different from data.length),
     *      ext: boolean,        // True if extended CAN frame
     *      rtr: boolean,        // True if a CAN retry frame
     *      error: boolean,      // True if this packet has errors
     *      timestamp?: number,  // The timestamp in ms for this packet.  
     *                           // Maxes out at 60,000 and rolls over.
     *  }
     */
});

/* Send a standard packet */
can.send({id: 123, data: Buffer.from("01020304", "hex")});

/* Send a extended packet */
can.send({id: 123, ext: true, data: Buffer.from("01020304", "hex")});

~~~~~

## Testing

Unit testing can be run with the following command:

~~~~~sh
# npm test
~~~~~

## License

BSD 3-Clause License

Copyright (c) 2021, Scott Price
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

1. Redistributions of source code must retain the above copyright notice, this
   list of conditions and the following disclaimer.

2. Redistributions in binary form must reproduce the above copyright notice,
   this list of conditions and the following disclaimer in the documentation
   and/or other materials provided with the distribution.

3. Neither the name of the copyright holder nor the names of its
   contributors may be used to endorse or promote products derived from
   this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
