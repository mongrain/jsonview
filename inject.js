// version=1.0
window.ylOne = function (authority, conditions, version) {
  let watcher = null;
  let times = 100;

  function loop(retryTimes = times) {
    retryTimes--;
    if (retryTimes < 0) {
      return;
    }

    for (let i = conditions.length - 1; i >= 0; i--) {
      const item = conditions[i];
      // 判断版本
      const isAvailable = parseFloat(version) >= parseFloat(item.version);
      if (location.href.includes(item.url) && isAvailable) {
        doLogin();

        function doLogin() {
          const usernameEl = document.querySelector(item.usernameSelector);
          const passwordEl = document.querySelector(item.passwordSelector);
          
          if (!usernameEl || !passwordEl) {
            setTimeout(() => {
              loop(retryTimes);
            }, 500);

            return;
          } 

          const usernameVal = usernameEl._valueTracker ? usernameEl._valueTracker.getValue() : usernameEl.value;
          const passwordVal = passwordEl._valueTracker ? passwordEl._valueTracker.getValue() : passwordEl.value;

          if (!usernameVal) {
            keyboardInput(usernameEl, authority.username);
          }
          if (!passwordVal) {
            keyboardInput(passwordEl, authority.password);
          }
  
          if (!usernameVal || !passwordVal) {
            setTimeout(() => {
              loop(retryTimes);
            }, 500);
          } else {
            handleSubmit(item.submitSelector, item.delayInputTime);
            hashWatch();
          }
        }
        // 不走了
        return;
      }
    }

    // 自动登录蓝湖
    if (location.href.includes('lanhu.mysre.cn/web/#/user/login')) {
      const usernameEl = document.querySelector('[name="email"]');
      if (usernameEl && !usernameEl.value) {
        keyboardInput(usernameEl, authority.username + '@mingyuanyun.com')
      }
      const passwordEl = document.querySelector('[name="password"]');
      if (passwordEl && !passwordEl.value) {
        keyboardInput(passwordEl, authority.password)
      }
    
      if(!usernameEl || !passwordEl) {
        setTimeout(() => {
          loop(retryTimes);
        }, 500)
      } else {
        handleSubmit('.login_btn');
      }
    }
    // 自动登录 星舟
    else if (location.href.includes("starship.mysre.cn/login")) {
      fetch("https://starship.mysre.cn/authapi/user/login", {
        headers: {
          accept: "*/*",
          "accept-language": "en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7",
          "cache-control": "no-cache",
          "content-type": "application/json",
          pragma: "no-cache",
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-origin",
        },
        referrer: "https://starship.mysre.cn/login",
        referrerPolicy: "strict-origin-when-cross-origin",
        body:
          '{"account":"' +
          authority.username +
          '","password":"' +
          authority.password +
          '","auto_login":1}',
        method: "POST",
        mode: "cors",
        credentials: "include",
      })
        .then((res) => res.json())
        .then((res) => {
          window.location.href = "/";
        });
    }
    else if (location.href.includes("#/")) {
      hashWatch();
    }
  }

  loop();

  function hashWatch() {
    if (watcher) return;
    watcher = setInterval(() => {
      loop(1);
    }, 1000);
  }

  function keyboardInput(dom, st) {
    var evt;
    
    // hack React16 内部定义了descriptor拦截value，此处重置状态
    let tracker = dom._valueTracker;
    if (tracker) {
      evt = new Event('input', { bubbles: true });
      tracker.setValue(st);
    } else {
      evt = new InputEvent("input", {
        inputType: "insertText",
        data: st,
        dataTransfer: null,
        isComposing: false,
      });
      dom.value = st;
    }
    dom.dispatchEvent(evt);
  }

  function handleSubmit(selector) {
    setTimeout(() => {
      document.querySelector(selector).click();
    }, 100);
  }
};

