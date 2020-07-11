const currentWeekNumber = require('current-week-number');

const getWeek = () => {
    
    const date = new Date();
    
    // if Sunday, advance by 1 day to account for the week starting on Monday
    if (date.getDay() === 0)
        date.setDate(date.getDate() + 1);
        
    const week = currentWeekNumber(date);
    const colour = week % 2 === 0 ? 'blue' : 'yellow';
    
    return { week, colour };
};

module.exports.checkSchedule = () => {
    
    const week = getWeek();
        
    return `Week ${week.week} is a ${week.colour} week.`;
};

module.exports.checkPickup = () => {

    const week = getWeek();
        
    return `It is garbage pickup week if you live in a ${week.colour} zone.`;
};
