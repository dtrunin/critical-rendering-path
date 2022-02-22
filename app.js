const express = require('express')
const app = express()
const port = 3002

function sendCss(res, content, timeout) {
    res.type('css');
    setTimeout(() => res.send(content), timeout);
}

function sendJs(res, script, timeout) {
    const content = [
        `log('${script} header exists ' + !!document.querySelector('.header'))`
    ].join(';')
    res.type('javascript');
    setTimeout(() => res.send(content), timeout);
}

function scriptHandlerFactory(script, timeout) {
    return (req, res) => sendJs(res, script, timeout);
}

function createImageHandlers(images) {
    images.forEach(([image, timeout]) => app.get(`/${image}`, (req, res) => {
        setTimeout(() => res.send(), timeout);
    }));
}

function createJsHandlers(params) {
    params.forEach(([script, timeout]) => app.get(`/${script}.js`, scriptHandlerFactory(script, timeout)));
}

function createCssHandlers(params) {
    params.forEach(([name, color, timeout]) => app.get(`/${name}.css`, (req, res) => {
        sendCss(res, `.${name} { color: ${color}`, timeout);
    }))
}

app.use(express.static('public'));

createJsHandlers([
    [`script1`, 1500],
    [`script2`, 1000],
    [`script3`, 500],
    [`preload`, 4000],
    [`prefetch`, 2000],
    [`async-script`, 700],
    [`defer-script`, 1200],
]);

createCssHandlers([
    ['header', 'red', 2000],
    ['body', 'green', 1000],
    ['footer', 'blue', 2500],
    ['print', 'blue', 1500],
]);

createImageHandlers([
    [`eager-loading-image`, 1000],
    [`lazy-loading-image`, 1500]
]);

app.listen(port, () => {
    console.log(`App listening on port ${port}`)
})
