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
    Type: 'string',
    Context: [
      ConfigContext.USER_READ,
      ConfigContext.USER_MUTATE,
      ConfigContext.ADMIN_READ,
      ConfigContext.ADMIN_MUTATE,
    ],
    Name: 'E-mail',
    Attribute: 'email',
  },
  {
    Type: 'boolean',
    Context: [
      ConfigContext.USER_READ,
      ConfigContext.USER_MUTATE,
      ConfigContext.ADMIN_READ,
    ],
    Name: 'Consent',
    Attribute: 'consent',
    Description: 'For more information, visit <..>',
  },
]);

// dont forget to export your config!
export default localAttributeConfig;
