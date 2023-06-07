import COPY from "./configuration/messages-copy.js";
import DropNote from "./entities/DropNote.js";

const noop = () => {};

const drop1 = new DropNote("happy", "user");
drop1.hashtags = [];
drop1.key = "happy";
const drop2 = new DropNote("day", "user");
drop2.hashtags = [];
drop2.key = "day";
const drop3 = new DropNote("happy0", "user");
drop3.hashtags = [];
drop3.key = "happy0";
const drop4 = new DropNote("day0", "user");
drop4.hashtags = [];
drop4.key = "day0";
const drop5 = new DropNote("happy9", "user");
drop5.hashtags = [];
drop5.key = "happy9";
const drop6 = new DropNote("day9", "user");
drop6.hashtags = [];
drop6.key = "day9";
const drop7 = new DropNote("time", "user");
drop7.hashtags = [];
drop7.key = "time";

const exampleDrops2 = [
    drop1,
    drop2
];

const exampleDrops6 = [
    drop1,
    drop2,
    drop3,
    drop4,
    drop5,
    drop6
];
export { noop, exampleDrops2, exampleDrops6, COPY, drop1, drop2, drop3, drop4, drop5, drop6, drop7 };
