// @ts-nocheck
class EmailChecker {
    constructor(email, timeNeeded, elapsedTime, uuid)
    {
        this.email = email;
        this.time = (new Date()).getTime();
        this.timeNeeded = timeNeeded;
        this.elapsedTime = elapsedTime;
        this.completed = false;
        this.uuid = uuid;
    }

    update()
    {
        var elapsed = (new Date).getTime() - this.time;
        this.elapsedTime = this.elapsedTime + elapsed;

        if(this.elapsedTime >= hoursToMili(this.timeNeeded))
        {
            this.elapsedTime = hoursToMili(this.timeNeeded);
            this.completed = true;
        }
    }

    isCompleted()
    {
        return this.completed;
    }

    remainingTime()
    {
        this.update();
        if(this.elapsedTime >= hoursToMili(this.timeNeeded)) return 0;

        var left = hoursToMili(this.timeNeeded) - this.elapsedTime;

        return miliToTime(left);
    }

    asJSON()
    {
        return {
            email: this.email,
            timeNeeded: this.timeNeeded,
            elapsedTime: this.elapsedTime,
            completed: this.completed,
            uuid: this.uuid
        }
    }
}

function emailCheckerFromJson(json)
{
    var checker = new EmailChecker(json.email, json.timeNeeded, json.elapsed, json.uuid);
    checker.update();
    return checker;
}

function hoursToMili(hours)
{
    return hours * 3600000;
}

function miliToTime(mili)
{
    const res = {};

    let x = mili / ( 60 * 60 * 1000 );

    if(x >= 1)
    {
        res['hours'] = removeDecimal(x);
    } else res['hours'] = 0;

    x = (x - (removeDecimal(x))) * 60;

    if(x >= 1)
    {
        res['minutes'] = removeDecimal(x);
    } else res['minutes'] = 0;

    x = (x - (removeDecimal(x))) * 60;

    if(x >= 1)
    {
        res['seconds'] = removeDecimal(x);
    } else res['seconds'] = 0;
    return res;
}

function removeDecimal(x)
{
    var y = String(x);

    return +(y.split('.')[0]);
}

module.exports.EmailChecker = EmailChecker;
module.exports.CheckerFromJson = emailCheckerFromJson;