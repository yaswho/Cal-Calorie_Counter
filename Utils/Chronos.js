const { v4: uuidv4 } = require('uuid')
const { ToadScheduler, SimpleIntervalJob, Task } = require('toad-scheduler');
const { EmailChecker, CheckerFromJson } = require('./TimeModels/EmailChecker');
var fs = require('fs');

var timeFolder = './timing';
const emails = {};
const emailsjson = {};
const emails_uuid = {};

class Chronos
{
    constructor()
    {
        this.schedulers = new Object();
        
        if(!fs.existsSync(timeFolder))
            fs.mkdirSync(timeFolder)

    }

    registerScheduler(name)
    {
        this.schedulers[name] = new ToadScheduler();

        if(!fs.existsSync(timeFolder + `/${name}.json`))
        {
            fs.writeFile(timeFolder + `/${name}.json`, '{}', function (err) {
                if (err) throw err;
                console.log('Created!');
            }); 
        }
        
    }

    // addTask(schedulerName, taskName, timeObject, func, ...params)
    // {
    //     const task = new Task(taskName, func(...params));
    //     const job = new SimpleIntervalJob(timeObject, task);
    //     this.schedulers[schedulerName].addSimpleIntervalJob(job);
    // }

    checkEmail(email, session)
    {
        var checker;
        var uuid;

        if(emails[email])
        {
            checker = CheckerFromJson(emailsjson[email]);
            uuid = checker.uuid;
        } else {

            uuid = generateUUID(emails_uuid);
            checker = new EmailChecker(email, 24, 0, uuid);
            emails_uuid[uuid] = { checker: checker, session: session };
            emails[email] = checker;
        }

        const task = new Task(`check_${email}`, () => {
            delete emails[email];
            delete emailsjson[email];
        });

        const job = new SimpleIntervalJob(checker.remainingTime(), task);
        this.schedulers['emailchecker'].addSimpleIntervalJob(job);

        return uuid;
    }

    hasEmailTime(uuid)
    {
        if(emails_uuid[uuid])
        {
            return emails_uuid[uuid].checker.isCompleted();
        } else return false;
    }

    getEmailSession(uuid)
    {
        if(emails_uuid[uuid])
        {
            return emails_uuid[uuid].session;
        } else return null;
    }

    isFree(email)
    {
        if(emails[email])
        {
            return false;
        } else return true;
    }

    shutdown()
    {

        const emailsjson = {};
        for(var key in Object.keys(emails))
        {
            emails[key].update();
            emailsjson[key] = emails[key].asJSON();
        }

        fs.writeFile(timeFolder + `/emailchecker.json`, JSON.stringify(emailsjson), function (err) {
            if (err) throw err;
            console.log('Saved!');
          });
    }

    load()
    {
        fs.readFile(timeFolder + '/emailchecker.json', 'utf-8', (err, data) => {
            if (err) {
                throw err;
            }
            
            console.log(data.toString());
            const checkers = JSON.parse(data.toString());

            if(Object.keys(checkers) > 0) this.emailsjson = checkers;
        });
    }

    start()
    {
        chronos.registerScheduler("emailchecker");
    }
}

function generateUUID(obj) {
    var _uuid = uuidv4();
    if(!obj[_uuid]) {
        return _uuid;
    } else return generateUUID(obj);
}

const chronos = new Chronos();

module.exports = chronos;