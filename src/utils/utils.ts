import crypto from 'crypto'

export const generateHash = (data: any) => {
    const hash = crypto.createHash('sha256');
    hash.update(data);
    return hash.digest('hex');
}


declare global {
    interface Promise<T> {
        delay(t?: number): Promise<T>;
    }
}
function delay(t: number, val: any) {
    return new Promise(resolve => setTimeout(resolve, t, val));
}
const randomDelay = (min = 6, max = 8) => {
    return Math.ceil(Math.random() * (max - min) + min) * 1000;
}
Promise.prototype.delay = async function (t = randomDelay()) {
    return this.then((val) => delay(t, val));
}
