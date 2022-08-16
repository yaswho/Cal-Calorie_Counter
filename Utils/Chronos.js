// @ts-nocheck
const { ToadScheduler, SimpleIntervalJob, Task, Task } = require('toad-scheduler');
const { EmailChecker, CheckerFromJson } = require('./TimeModels/EmailChecker');
var fs = require('fs');

var timeFolder = './timing';
const emails = {};
const emailsjson = {};

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

        fs.access(timeFolder + `/${name}.json`, fs.F_OK, (err) => {
            if(err)
            {
                fs.writeFile(timeFolder + `/${name}.json`, '', function (err) {
                    if (err) throw err;
                    console.log('Created!');
                  });
            }
        })
    }

    // addTask(schedulerName, taskName, timeObject, func, ...params)
    // {
    //     const task = new Task(taskName, func(...params));
    //     const job = new SimpleIntervalJob(timeObject, task);
    //     this.schedulers[schedulerName].addSimpleIntervalJob(job);
    // }

    checkEmail(email)
    {
        var checker;

        if(emails[email])
        {
            checker = CheckerFromJson(emailsjson[email]);
        } else {
            checker = new EmailChecker(email, 24, 0);
            emails[email] = checker;
        }

        const Task = new Task(`check_${email}`, () => {
            delete emails[email];
            delete emailsjson[email];
        });

        const job = new SimpleIntervalJob(checker.remainingTime(), task);
        this.schedulers[schedulerName].addSimpleIntervalJob(job);
    }

    hasEmailTime(email)
    {
        if(emails[email])
        {
            return emails[email].isCompleted();
        } else false;
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
        fs.readFile(timeFolder + '/emailcheker.json', 'utf-8', (err, data) => {
            if (err) {
                throw err;
            }
        
            const checkers = JSON.parse(data.toString());

            if(Object.keys(checkers) > 0) this.emailsjson = checkers;
        });
    }
}


const chronos = new Chronos();
chronos.registerScheduler("emailchecker");

module.exports = chronos;