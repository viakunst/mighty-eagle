/* eslint-disable @typescript-eslint/no-unused-vars */
import LocalConfigAdapter from '../adapters/config/LocalConfigAdapter';
import UrlConfigAdapter from '../adapters/config/UrlConfigAdapter';
import { ConfigContext } from '../attributes/AttributeConfigData';

// example: json from url (same origin)
const urlAttributeConfig = new UrlConfigAdapter('/config.json');

// example: json from url (different origin, cors enabled)
const externalAttributeConfig = new UrlConfigAdapter('http://google.com/config.json', false);

// example: hardcoded
const localAttributeConfig = new LocalConfigAdapter([
  {
    type: 'string',
    context: [
      ConfigContext.USER_READ,
      ConfigContext.USER_MUTATE,
      ConfigContext.ADMIN_READ,
      ConfigContext.ADMIN_MUTATE,
    ],
    name: 'E-mail',
    attribute: 'email',
  },
  {
    type: 'boolean',
    context: [
      ConfigContext.USER_READ,
      ConfigContext.USER_MUTATE,
      ConfigContext.ADMIN_READ,
    ],
    name: 'Consent',
    attribute: 'consent',
    description: 'For more information, visit <..>',
  },
]);

// dont forget to export your config!
export default localAttributeConfig;
