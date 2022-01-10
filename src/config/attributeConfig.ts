import { TextAttribute, BooleanAttribute } from '../attributes';
import AttributeConfig from '../attributes/attributesClass/AttributeConfig';

// Name is the attribute primary key.
// These need to be unique for each attribute therefore.
const basicAttributeConfig = new AttributeConfig([
  TextAttribute({
    Name: 'E-mail',
    Attribute: 'email',
  }),
  TextAttribute({
    Name: 'Telefoonnummer',
    Attribute: 'phone_number',
  }),
  TextAttribute({
    Name: 'Voornaam',
    Attribute: 'given_name',
  }),
  TextAttribute({
    Name: 'Achternaam',
    Attribute: 'family_name',
  }),
  TextAttribute({
    Name: 'Geboortedatum',
    Attribute: 'birthdate',
  }),
]);

const userAttributeConfig = basicAttributeConfig.extend([
  BooleanAttribute({
    Name: 'Akkoord Beeldbeleid',
    Attribute: 'custom:image_consent_2',
    Description: 'Voor meer informatie, ga naar <..>',
  }),
]);

const adminReadUserAttributeConfig = basicAttributeConfig.extend([
  BooleanAttribute({
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
