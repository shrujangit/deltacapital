import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { appRoutingProviders } from './app/app.routes';

appConfig.providers = [...(appConfig.providers || []), ...appRoutingProviders];

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));
