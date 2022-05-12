import webdriver from 'selenium-webdriver'

var until = webdriver.until
var By = webdriver.By
var until = webdriver.until
var keys = webdriver.Key;


function sleep(ms) {
	Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
}

function advancedContains(theString,values=[]) {
    for (const eachValue of values) {
        if (theString.includes(eachValue)) {
            return true
        }
    }
    return false
}

async function act(mainFunction,repeatOnFailure,wait,waitIncrement=0,debug=false) {
    var isFinised = false
    while (!isFinised) {
        try {
            var toReturn = await mainFunction()
            return Promise.resolve(toReturn)
        } catch (error) {
            if (debug) {
                if (debug == "name") {
                    console.debug(error.name)
                } else if (debug == "message") {
                    console.debug(error.message)
                } else if (debug == true) {
                    console.debug(error)
                }
            }
            if (!repeatOnFailure) {
                return Promise.reject(error)
            }
        };
        wait = wait + waitIncrement
        sleep(wait)
    }
}

async function clickElement(webdriver,xpath,timeout,freq) {
    await webdriver.wait(until.elementLocated(By.xpath(xpath)),timeout,"",freq)
    var elem = await webdriver.findElement(By.xpath(xpath))
    await elem.click()
}

async function readData(webdriver,xpath,timeout,freq) {
    await webdriver.wait(until.elementLocated(By.xpath(xpath)),timeout,"",freq)
    var elem = await webdriver.findElement(By.xpath(xpath))
    var textInIt = await elem.getText()
    return textInIt
}

async function sendKeys(webdriver,xpath,value,timeout,freq) {
    await webdriver.wait(until.elementLocated(By.xpath(xpath)),timeout,"",freq)
    await webdriver.findElement(By.xpath(xpath)).sendKeys(value)    
}

function currentTime() {
    //var currentFullDate = "Fri Apr 29 2022 22:18:19 GMT+0600 (Bangladesh Standard Time)"
    var currentFullDate = new Date().toString()
    var time = currentFullDate.split(" ")[4]

    return time
}

async function runEvery(interval,func,count) {
    var times = 0
    while (times < count) {
        await func()
        sleep(interval)
        times+=1
    }
}

async function getUrlExtended(webdriver,url,xpath,timeout,freq,wait) {
    await webdriver.get(url)
    await seeIfFullyLoaded(webdriver,xpath,timeout,freq,wait)
}

async function seeIfFullyLoaded(webdriver,xpath,timeout,freq,wait,watchOut="") {
    await webdriver.wait(async (webdriver) => {
        return await webdriver.executeScript("return document.readyState") == 'complete'
    }, timeout, "", freq)
    
    //sleep(wait)

    await webdriver.wait(async (webdriver) => {
        return await readData(webdriver,xpath,timeout,freq).then(async (data) => {
            return !([null,undefined,"null","undefined","",watchOut].includes(data) || advancedContains(data,["null","undefined"]))
        }, async (error) => {
            throw "not loaded"
            //console.debug(error)    
        })
    },timeout,"",freq)    
}

export {
    act,
    sleep,
    clickElement,
    readData,
    sendKeys,
    currentTime,
    runEvery,
    getUrlExtended,
    seeIfFullyLoaded
}









