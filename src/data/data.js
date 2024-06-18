const handleTimeData = [
    { week: "Week 1", handleTime: 4.2 },
    { week: "Week 2", handleTime: 4.5 },
    { week: "Week 3", handleTime: 4.2 },
    { week: "Week 4", handleTime: 4.3 },
    // { week: "Week 5", handleTime: 4.9 },
    // { week: "Week 7", handleTime: 5 },
    // { week: "Week 6", handleTime: 8.9 },
];

const callDurationData = [
    { date: "2020-01", talkTime: 1.2, holdTime: 1.0 },
    { date: "2020-02", talkTime: 2.2, holdTime: 2.0 },
    { date: "2020-03", talkTime: 3.2, holdTime: 3.0 },
    { date: "2020-04", talkTime: 4.2, holdTime: 1.0 },
    { date: "2020-05", talkTime: 5.2, holdTime: 1.0 },
    { date: "2020-06", talkTime: 6.2, holdTime: 1.0 },
    { date: "2020-07", talkTime: 7.6, holdTime: 2.0 },
    { date: "2020-08", talkTime: 6.2, holdTime: 3.0 },
    { date: "2020-09", talkTime: 4.2, holdTime: 3.8 },
    { date: "2020-10", talkTime: 3.2, holdTime: 1.9 },
    { date: "2020-11", talkTime: 2.2, holdTime: 3.5 },
    { date: "2020-12", talkTime: 9.2, holdTime: 2.8 },
];

// const callDurationData = [
//     { date: "Week 1", callTake: 3.2, callHold: 1.0 },
//     { date: "Week 2", callTake: 2.2, callHold: 2.0 },
//     { date: "Week 3", callTake: 1.2, callHold: 3.0 },
//     { date: "Week 4", callTake: 4.2, callHold: 1.0 },
//     { date: "Week 5", callTake: 6.2, callHold: 1.0 },
//     { date: "Week 6", callTake: 2.2, callHold: 1.0 },
//     { date: "Week 7", callTake: 2.2, callHold: 1.0 },
//     { date: "Week 8", callTake: 2.2, callHold: 1.0 },
//     { date: "Week 9", callTake: 2.2, callHold: 1.0 },
//     { date: "Week 10", callTake: 2.2, callHold: 4.0 },
//     { date: "Week 11", callTake: 2.2, callHold: 3.0 },
//     { date: "Week 12", callTake: 2.2, callHold: 2.0 },
// ];

const slaData = [
    { date: "2020-01", sla: 32 },
    { date: "2020-02", sla: 35 },
    { date: "2020-03", sla: 52 },
    { date: "2020-04", sla: 43 },
    { date: "2020-05", sla: 46 },
    { date: "2020-06", sla: 40 },
    { date: "2020-07", sla: 48 },
    { date: "2020-08", sla: 59 },
    { date: "2020-09", sla: 66 },
    { date: "2020-10", sla: 60 },
    { date: "2020-11", sla: 79 },
    { date: "2020-12", sla: 79 },
];

const data = [
    { month: "Jan", call: 0 },
    { month: "Feb", call: 35 },
    { month: "Mar", call: 52 },
    { month: "Apr", call: 43 },
    { month: "May", call: 46 },
    { month: "Jun", call: 40 },
    { month: "Jul", call: 48 },
    { month: "Aug", call: 59 },
    { month: "Sep", call: 66 },
    { month: "Oct", call: 60 },
    { month: "Nov", call: 79 },
    { month: "Dec", call: 80 },
];

// const data = [
//     { month: "Week 1", call: 0 },
//     { month: "Week 2", call: 35 },
//     { month: "Week 3", call: 52 },
//     { month: "Week 4", call: 43 },
// ];

export { handleTimeData, callDurationData, slaData, data };
