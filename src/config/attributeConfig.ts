import { TextAttribute, BooleanAttribute } from '../attributes/types';
import AttributeConfig from '../attributes/AttributeConfig';

// Name is the attribute primary key.
// These need to be unique for each attribute therefore.
const basicAttributeConfig = new AttributeConfig([
  TextAttribute({
    Type: 'string',
    Name: 'E-mail',
    Attribute: 'email',
  }),
  TextAttribute({
    Type: 'string',
    Name: 'Telefoonnummer',
    Attribute: 'phone_number',
  }),
  TextAttribute({
    Type: 'string',
    Name: 'Voornaam',
    Attribute: 'given_name',
  }),
  TextAttribute({
    Type: 'string',
    Name: 'Achternaam',
    Attribute: 'family_name',
  }),
  TextAttribute({
    Type: 'string',
    Name: 'Geboortedatum',
    Attribute: 'birthdate',
  }),
]);

const userAttributeConfig = basicAttributeConfig.extend([
  BooleanAttribute({
    Type: 'boolean',
    Name: 'Akkoord Beeldbeleid',
    Attribute: 'custom:image_consent_2',
    Description: 'Voor meer informatie, ga naar <..>',
  }),
]);

const adminReadUserAttributeConfig = basicAttributeConfig.extend([
  BooleanAttribute({
    Type: 'boolean',
    Name: 'Akkoord Beeldbeleid',
    Attribute: 'custom:image_consent_2',
    Description: 'Voor meer informatie, ga naar <..>',
  }),
]);

const adminUpdateUserAttributeConfig = basicAttributeConfig.extend([]);

// Basic create user. contains all field initially given.
const adminCreateUserAttributeConfig = basicAttributeConfig.extend([]);

export {
  userAttributeConfig, adminCreateUserAttributeConfig,
  adminUpdateUserAttributeConfig, adminReadUserAttributeConfig,
};
