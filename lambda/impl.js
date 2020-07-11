const currentWeekNumber = require('current-week-number');
const db = require('./db');

module.exports.zone = async (requestEnvelope) => {

    const zone = requestEnvelope.request.intent.slots.zone.value;

    if (zone !== 'blue' && zone !== 'yellow') {
        const prefix = zone ? `${zone} is not a valid zone.` : 'I didn\'t get that.';
        return prefix + ' Valid zones are blue or yellow. Please try again.'
    }

    await db.setZone(requestEnvelope.context.System.user.userId, zone);
    
    return 'Ok, I\'ll remember that. Now, what would you like to know?';
};

const getWeek = () => {
    
    const date = new Date();
    
    // if Sunday, advance by 1 day to account for the week starting on Monday
    if (date.getDay() === 0)
        date.setDate(date.getDate() + 1);
        
    const week = currentWeekNumber(date);
    const colour = week % 2 === 0 ? 'blue' : 'yellow';
    
    return { week, colour };
};

module.exports.checkSchedule = async (requestEnvelope) => {
    
    const week = getWeek();
    let answer = `a ${week.colour}`;

    try {
        const zone = await db.getZone(requestEnvelope.context.System.user.userId);
        if (zone)
            answer = (zone === week.colour ? '' : 'not ') + 'a garbage pickup';
    }
    catch (err) {
        console.warn('Failed to get zone: ' + err.message);
    }

    return `Week ${week.week} is ${answer} week.`;
};

module.exports.checkPickup = (requestEnvelope) => {

    const week = getWeek();
        
    return `It is garbage pickup week if you live in a ${week.colour} zone.`;
};

module.exports.deZone = (requestEnvelope) => {

    const userId = requestEnvelope.context.System.user.userId;

    // TODO
};
