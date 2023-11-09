import React, { useEffect } from 'react';
import { Switch, Redirect, Route, HashRouter } from 'react-router-dom';
import { RouteWithLayout } from './components/Common';
import { Main as MainLayout, Minimal as MinimalLayout } from './layouts';
import ForgetPassword from './components/ForgetPassword/index';
import ResetPassword from './components/ResetPassword/index';
import {
  Login,
  Dashboard,
  MultiView,
  MarkerEdit,
  Search,
  QcEdit,
  Jobs,
  OutputSearch,
  AccessDenied,
  Info,
  InfoDetails,
  WorkAssessment,
  MarkerView,
  Report,
  Clipper,
  Impact,
  Awareness,
  ContentSegmentation,
  OnlinePublicationSource,
  LiveClipping,
  OnlineSingleImport,
  CreateAccount,
  PrintClipper,
  Editor,
  NewsBoard,
  ReportGenerator,
} from './components';
import JobLibrary from 'components/JobLibrary/JobLibrary';
import OnlineVideos from './components/ContentSegmentation/components/onlineVideos/OnlineVideos';
import Print from './components/ContentSegmentation/components/print/Print';
import Web from 'components/ContentSegmentation/components/web/Web';
import {
  ProgramTypes,
  Channels,
  Hosts,
  Associations,
  Users,
  Guests,
  Alarms,
  ProgramNames,
  SettingTheme,
  Company,
  Group,
  Writer,
} from './components/AdminPanel';
import ClientEditor from 'components/Client-View/Client Editor/ClientEditor';
import ClientMultiview from 'components/Client-View/Client Multiview/ClientMultiview';
import ClientSearch from 'components/Client-View/Client Search/ClientSearch';
import Social from 'components/ContentSegmentation/components/Social/Social';
import HyperQc from 'components/QcEdit/HyperQc';
import { LibraryReports } from 'components/JobLibrary/components';
import ClientDashboard from 'components/Client-View/Client-Dashboard/ClientDashboard';

const infoRoutes = [
  '/info/training-book',
  '/info/shortcut-sheet',
  '/info/software-manual',
  '/info/support-document',
];

const Routes = () => {
  return (
    <HashRouter
      getUserConfirmation={(message, callback) => {
        const allowTransition = window.confirm(message);
        callback(allowTransition);
      }}
    >
      <Switch>
        <Redirect exact from="/" to="/login" />
        <RouteWithLayout component={CreateAccount} exact path="/createAccount" />

        <RouteWithLayout
          component={ClientSearch}
          exact
          layout={MainLayout}
          path="/clientSearch"
          protectedRoute
        />
        <RouteWithLayout
          component={JobLibrary}
          exact
          layout={MainLayout}
          path="/libraries"
          protectedRoute
        />
        <RouteWithLayout
          component={ReportGenerator}
          exact
          layout={MainLayout}
          path="/clientReports"
          protectedRoute
        />
        <RouteWithLayout
          component={NewsBoard}
          exact
          layout={MainLayout}
          path="/news-board"
          protectedRoute
        />
        <RouteWithLayout
          component={Editor}
          exact
          layout={MainLayout}
          path="/mediamanager"
          protectedRoute
        />
        <RouteWithLayout
          component={ClientMultiview}
          exact
          layout={MainLayout}
          path="/clientMultiview"
          protectedRoute
        />
        <RouteWithLayout
          component={ClientDashboard}
          exact
          layout={MainLayout}
          path="/clientDashboard"
          protectedRoute
        />

        <RouteWithLayout
          component={Guests}
          exact
          layout={MainLayout}
          path="/settings/guests"
          protectedRoute
        />
        <RouteWithLayout
          component={Associations}
          exact
          layout={MainLayout}
          path="/settings/association"
          protectedRoute
        />
        <RouteWithLayout
          component={Impact}
          exact
          layout={MainLayout}
          path="/impact"
          protectedRoute
        />
        <RouteWithLayout
          component={Users}
          exact
          layout={MainLayout}
          path="/settings/user"
          protectedRoute
        />
        <RouteWithLayout
          component={ProgramNames}
          exact
          layout={MainLayout}
          path="/settings/program-name"
          protectedRoute
        />
        <RouteWithLayout
          component={SettingTheme}
          exact
          layout={MainLayout}
          path="/settings/theme"
          protectedRoute
        />
        <RouteWithLayout
          component={Channels}
          exact
          layout={MainLayout}
          path="/settings/channels"
          protectedRoute
        />
        <RouteWithLayout
          component={ProgramTypes}
          exact
          layout={MainLayout}
          path="/settings/program-type"
          protectedRoute
        />
        <RouteWithLayout
          component={Hosts}
          exact
          layout={MainLayout}
          path="/settings/hosts"
          protectedRoute
        />
        <RouteWithLayout
          component={Writer}
          exact
          layout={MainLayout}
          path="/settings/writers"
          protectedRoute
        />
        <RouteWithLayout
          component={Alarms}
          exact
          layout={MainLayout}
          path="/settings/alarms"
          protectedRoute
        />
        <RouteWithLayout
          component={Company}
          exact
          layout={MainLayout}
          path="/settings/company"
          protectedRoute
        />
        <RouteWithLayout
          component={Group}
          exact
          layout={MainLayout}
          path="/settings/group"
          protectedRoute
        />
        <RouteWithLayout
          component={Dashboard}
          exact
          layout={MainLayout}
          path="/dashboard"
          protectedRoute
        />
        <RouteWithLayout
          component={MarkerEdit}
          exact
          layout={MainLayout}
          path="/marker-edit/:jobId"
          protectedRoute
        />

        <RouteWithLayout
          component={QcEdit}
          exact
          layout={MainLayout}
          path="/qc-edit/:jobId"
          protectedRoute
        />

        <RouteWithLayout
          component={LiveClipping}
          exact
          layout={MainLayout}
          path="/liveClipping"
          protectedRoute
        />

        <RouteWithLayout
          component={MarkerView}
          exact
          layout={MainLayout}
          path="/marker-view/:jobId"
          protectedRoute
        />
        <RouteWithLayout
          component={Awareness}
          exact
          layout={MainLayout}
          path="/awareness"
          protectedRoute
        />
        <RouteWithLayout
          component={MultiView}
          exact
          layout={MainLayout}
          path="/multiview"
          protectedRoute
        />
        <RouteWithLayout
          component={OnlineVideos}
          exact
          layout={MainLayout}
          path="/onlineVideos"
          protectedRoute
        />
        <RouteWithLayout
          component={OnlineSingleImport}
          exact
          layout={MainLayout}
          path="/onlineSinlgeImport"
          protectedRoute
        />
        <RouteWithLayout component={Print} exact layout={MainLayout} path="/print" protectedRoute />
        <RouteWithLayout
          component={PrintClipper}
          exact
          layout={MainLayout}
          path="/printClipper"
          protectedRoute
        />
        <RouteWithLayout
          component={Social}
          exact
          layout={MainLayout}
          path="/social"
          protectedRoute
        />
        <RouteWithLayout component={Web} exact layout={MainLayout} path="/web" protectedRoute />
        <RouteWithLayout
          component={Clipper}
          exact
          layout={MainLayout}
          path="/clipper"
          protectedRoute
        />

        <RouteWithLayout
          component={OutputSearch}
          exact
          layout={MainLayout}
          path="/search"
          protectedRoute
        />
        <RouteWithLayout
          component={WorkAssessment}
          exact
          layout={MainLayout}
          path="/work-assessment"
          protectedRoute
        />
        <RouteWithLayout
          component={ResetPassword}
          layout={MainLayout}
          protectedRoute
          path="/reset-password"
        />
        <RouteWithLayout
          component={ReportGenerator}
          layout={MainLayout}
          protectedRoute
          path="/reports"
        />

        <RouteWithLayout
          component={OnlinePublicationSource}
          exact
          layout={MainLayout}
          path="/jobs"
          protectedRoute
        />
        <RouteWithLayout
          component={HyperQc}
          exact
          layout={MainLayout}
          path="/hyper-qc"
          protectedRoute
        />
        <RouteWithLayout component={Login} exact layout={MinimalLayout} path="/login" />
        <RouteWithLayout
          layout={MinimalLayout}
          component={ForgetPassword}
          exact
          path="/forget-password"
        />
        <RouteWithLayout component={Info} exact protectedRoute layout={MainLayout} path="/info" />
        {infoRoutes.map(route => (
          <RouteWithLayout
            key={route}
            component={InfoDetails}
            exact
            protectedRoute
            layout={MainLayout}
            path={route}
          />
        ))}

        <RouteWithLayout
          component={AccessDenied}
          exact
          layout={MainLayout}
          protectedRoute
          path="/access-denied"
        />
        <RouteWithLayout
          component={() => <h1>Route Not Found!</h1>}
          exact
          layout={MinimalLayout}
          protectedRoute
          path="/not-found"
        />

        <Redirect to="/not-found" />
      </Switch>
    </HashRouter>
  );
};

export default Routes;
