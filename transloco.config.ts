import {TranslocoGlobalConfig} from '@jsverse/transloco-utils';
    
const config: TranslocoGlobalConfig = {
  rootTranslationsPath: './src/assets/i18n/',
  langs: [ 'en', 'es' ],
  keysManager: {
    defaultValue: '',
  }
};
    
export default config;