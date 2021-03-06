import React from "react";
import {IndexRedirect, IndexRoute, Route, Router} from "react-router";
import {render} from "react-dom";
import {AppContainer} from "react-hot-loader";
import App from "~/routes/App";
import HomePage from "~/routes/HomePage";
import SpacePage from "~/routes/SpacePage";
import ItemPage from "~/routes/ItemPage";
import global from "~/global";
import "./index.less";
import "~/assets/imgs/favicon.ico";

render(
    <AppContainer>
        <Router history={global.history}>
            <Route path="/" component={App}>
                <IndexRedirect to="home"/>
                <Route path="home" component={HomePage}/>
                <Route path="space/:spaceName" component={SpacePage}/>
                <Route path="space/:spaceName/item/:itemId" component={ItemPage}/>
            </Route>
        </Router>
    </AppContainer>,
    document.getElementById("root")
);

if (module.hot && process.env.NODE_ENV !== "production") {
    module.hot.accept();
}
