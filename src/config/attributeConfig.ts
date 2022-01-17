import LocalConfigAdapter from '../adapters/config/LocalConfigAdapter';
import { ConfigContext } from '../attributes/AttributeConfigData';

// Name is the attribute primary key.
// These need to be unique for each attribute therefore.
const attributeConfig = new LocalConfigAdapter([
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
    Type: 'string',
    Context: [
      ConfigContext.USER_READ,
      ConfigContext.USER_MUTATE,
      ConfigContext.ADMIN_READ,
      ConfigContext.ADMIN_MUTATE,
    ],
    Name: 'Telefoonnummer',
    Attribute: 'phone_number',
  },
  {
    Type: 'string',
    Context: [
      ConfigContext.USER_READ,
      ConfigContext.USER_MUTATE,
      ConfigContext.ADMIN_READ,
      ConfigContext.ADMIN_MUTATE,
    ],
    Name: 'Voornaam',
    Attribute: 'given_name',
  },
  {
    Type: 'string',
    Context: [
      ConfigContext.USER_READ,
      ConfigContext.USER_MUTATE,
      ConfigContext.ADMIN_READ,
      ConfigContext.ADMIN_MUTATE,
    ],
    Name: 'Achternaam',
    Attribute: 'family_name',
  },
  {
    Type: 'string',
    Context: [
      ConfigContext.USER_READ,
      ConfigContext.USER_MUTATE,
      ConfigContext.ADMIN_READ,
      ConfigContext.ADMIN_MUTATE,
    ],
    Name: 'Geboortedatum',
    Attribute: 'birthdate',
  },
  {
    Type: 'boolean',
    Context: [
      ConfigContext.USER_READ,
      ConfigContext.USER_MUTATE,
      ConfigContext.ADMIN_READ,
    ],
    Name: 'Akkoord Beeldbeleid',
    Attribute: 'custom:image_consent_2',
    Description: 'Voor meer informatie, ga naar <..>',
  },
]);

export default attributeConfig;
