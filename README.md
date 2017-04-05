through-stream-testbed
==================

When you're writing transform functions intended to be used in
 [through2](https://www.npmjs.com/package/through2) streams, *through-stream-testbed* can do the work of putting together a through stream in your tap/tape tests and asserting there are no errors when your transform function is used in the stream.

 You just need to provide functions for checking the actual contents of the stream output, and you'll have tests that test your transform in a through stream context.

Installation
------------

    npm install through-stream-testbed

Usage
-----

    var test = require('tape');
    var StreamTestBed = require('through-stream-testbed');

    // This is a transform function that gets a video buffer, given a tweet.
    var videoTweetToBuffer = require('../../transforms/video-tweet-to-buffer');

    var tweetsContainingVideo = [
      {
        "tweetId": "1234",
        "caption": "Curry!",
        "date": "Sun Jan 02 12:00:00 +0000 2017",
        "videos": [
          {
            "bitrate": 320000,
            "content_type": "video/mp4",
            "url": "https://video.twimg.com/ext_tw_video/6789/pr/vid/240x240/whatever.mp4"
          },
          {
            "bitrate": 832000,
            "content_type": "video/mp4",
            "url": "https://video.twimg.com/ext_tw_video/6789/pr/vid/480x480/whatever.mp4"
          },
          {
            "content_type": "application/x-mpegURL",
            "url": "https://video.twimg.com/ext_tw_video/6789/pr/pl/whatever.m3u8"
          }
        ]
      },
      ... (More tweet objects here)
    ];

    test(
      'Test videoTweetToBufferStream',
      StreamTestBed({
        transformFn: videoTweetToBuffer,
        inputItems: tweetContainingVideo,
        checkCollectedStreamOutput: checkObjectsContainingBuffers,
        checkOutputItem: checkObjectContainingBuffer
      })
    );

    function checkObjectsContainingBuffers(t, items) {
      t.equal(items.length, tweetsContainingVideo.length, 'There is a buffer object for each tweet.');
    }

    function checkObjectContainingBuffer(t, item) {
      t.ok(item.tweetId, 'There is a tweetId.');
      t.ok(Buffer.isBuffer(item.buffer), 'The buffer is a Buffer.');
      // console.log(item.buffer.length);
      t.ok(item.buffer.length, 'The buffer is not empty.');
      }
    }

TODO: More explanation.

License
-------

The MIT License (MIT)

Copyright (c) 2017 Jim Kang

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
