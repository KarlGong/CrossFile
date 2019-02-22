import React from "react";
import {IndexRedirect, IndexRoute, Route, Router} from "react-router";
import {render} from "react-dom";
import {AppContainer} from "react-hot-loader";
import App from "~/routes/App";
import Home from "~/routes/Home";
import global from "~/global";

render(
    <AppContainer>
        <Router history={global.history}>
            <Route path="/" component={App}>
                <IndexRedirect to="home"/>
                <Route path="home" component={Home}/>
            </Route>
        </Router>
    </AppContainer>,
    document.getElementById("app")
);

if (module.hot && process.env.NODE_ENV !== "production") {
    module.hot.accept();
}
