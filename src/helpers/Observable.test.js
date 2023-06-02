const Observable = require("./Observable.js");

describe("observables", () => {
    it("creates a new observalbe", () => {
        // eslint-disable-next-line no-new
        new Observable();
    });

    it("can subscribe to observable and get one value", () => {
        const obs = new Observable((observer) => {
            observer.next("apple");
        });
        obs.subscribe((val) => {
            expect(val).toBe("apple");
        });
    });

    it("can subscribe to observable and get several value", () => {
        const obs = new Observable((observer) => {
            observer.next("apple");
            observer.next("pear");
            observer.next("banana");
        });
        const values = [];
        obs.subscribe((val) => {
            values.push(val);
        });
        expect(values.length).toBe(3);
        expect(values[0]).toBe("apple");
        expect(values[1]).toBe("pear");
        expect(values[2]).toBe("banana");
    });

    it("can do something asynchronous", (done) => {
        const obs = new Observable((observer) => {
            setTimeout(() => {
                observer.next("apple");
            }, 0);
        });
        obs.subscribe((val) => {
            expect(val).toBe("apple");
            done();
        });
    });
});
