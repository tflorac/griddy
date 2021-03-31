
import { useEffect, useState } from "react";


/**
 * Timer components
 *
 * @param callback: timer callback
 * @param int duration: initial timer duration, in seconds
 * @param int remaining: remaining timer duration, in seconds
 * @param boolean autostart: should timer start automatically?
 * @constructor
 */

class Timer {

    constructor(callback, duration, remaining, autostart=true) {
        this._callback = callback;
        this._tid = null;
        this._started = null;
        this._duration = duration;
        this._remaining = remaining;
        this._ending = null;
        this._paused = true;
        if (autostart) {
            this.start();
        }
    }

    call() {
        this._callback();
        this.clear();
    }

    start() {
        if (!this._tid) {
            this._started = new Date();
            this._ending = this._started.getTime() + this._remaining;
            this._tid = setTimeout(() => this.call.apply(this), this._remaining);
            this._paused = false;
        }
    }

    pause() {
        if (this._tid) {
            clearTimeout(this._tid);
            this._tid = null;
            this._remaining = this._ending - new Date();
        }
        this._paused = true;
    }

    resume() {
        this.start();
    }

    clear() {
        if (this._tid) {
            clearTimeout(this._tid);
            this._tid = null;
        }
        this._started = null;
        this._ending = null;
        this._remaining = this._duration;
        this._paused = false;
    }

    get remaining() {
        if (this._tid) {
            return Math.round((this._ending - new Date()) / 1000);
        } else if (this._paused) {
            return Math.round(this._remaining / 1000);
        } else {
            return 0;
        }
    }
}


let _timer = null;

const useTimer = (callback, duration, remaining, refresh=null, interval=1000) => {

    if (_timer === null) {
        _timer = new Timer(callback, duration, remaining, false);
    } else {
        _timer._callback = callback;
        _timer._duration = duration;
        _timer._remaining = remaining;
    }
    const [timer, setTimer] = useState(_timer);

    useEffect(() => {
        let intervalId;
        timer.start();
        if (refresh !== null) {
            intervalId = setInterval(() => {
                refresh(timer.remaining);
            }, interval);
        }
        return () => {
            clearInterval(intervalId);
            timer.clear();
        }
    }, []);

    return timer;
};

export { useTimer };
