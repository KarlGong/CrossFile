import React from "react";
import MobileDetect from "mobile-detect";
import {IndexRedirect, IndexRoute, Route, Router} from "react-router";
import {render} from "react-dom";
import {AppContainer} from "react-hot-loader";
import WebApp from "~/web/routes/WebApp";
import WapApp from "~/wap/routes/WapApp";
import {browserHistory} from "react-router";

const checkUserAgent = (nextState, replace) => {
    let md = new MobileDetect(window.navigator.userAgent);
    if (md.phone()) {
        nextState.location.pathname.indexOf("/web") !== -1 && replace({pathname: "/wap"});
    } else {
        nextState.location.pathname.indexOf("/wap") !== -1 && replace({pathname: "/web"});
    }
};


render(
    <AppContainer>
        <Router history={browserHistory}>
            <Route path="/" onEnter={checkUserAgent}>
                <IndexRedirect to="web"/>
                <Route path="web" component={WebApp}>
                </Route>
                <Route path="wap" component={WapApp}>
                </Route>
            </Route>
        </Router>
    </AppContainer>,
    document.getElementById("app")
);

if (module.hot && process.env.NODE_ENV !== "production") {
    module.hot.accept();
}
