import { TextAttribute, BooleanAttribute, DateAttribute } from '../attributes';
import AttributeConfig from '../attributesClass/AttributeConfig';

// Name is the attribute primary key.
// These need to be unique for each attribute therefore.
const basicAttributeConfig = new AttributeConfig([
  TextAttribute({
    Name: 'E-mail',
    Attribute: 'email',
    Required: true,
  }),
  TextAttribute({
    Name: 'Telefoonnummer',
    Attribute: 'phone_number',
    Required: true,
  }),
  TextAttribute({
    Name: 'Voornaam',
    Attribute: 'given_name',
    Required: true,
  }),
  TextAttribute({
    Name: 'Achternaam',
    Attribute: 'family_name',
    Required: true,
  }),
  DateAttribute({
    Name: 'Geboortedatum',
    Attribute: 'birthdate',
    Required: true,
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
