const moment = require('moment');

exports.getCurrentBudget = (budgets) => {
    const monthYear = moment().format('YYYY-MM');
    if(budgets.length > 0)  {
        return budgets.find((el) => el.monthYear == monthYear)
    }
    return  null;
}
