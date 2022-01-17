import {
  TextAttribute, BooleanAttribute,
  DateAttribute, CompoundTextAttribute,
  PhoneAttribute,
} from '../attributes/attributeTypes';
import AttributeConfig from '../attributes/attributesClass/AttributeConfig';

// Name is the attribute primary key.
// These need to be unique for each attribute therefore.
const basicAttributeConfig = new AttributeConfig([
  TextAttribute({
    Name: 'E-mail',
    Attribute: 'email',
    Required: true,
  }),
  PhoneAttribute({
    Name: 'Telefoonnummer',
    Attribute: 'phone_number',
    Required: true,
  }),
  CompoundTextAttribute({
    Name: 'Volledige Naam',
    Attribute: 'name',
    Expression: '{{given_name}} {{family_name}}',
    Description: 'Totale naam',
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

const userReadAttributeConfig = basicAttributeConfig.extend([
  BooleanAttribute({
    Name: 'Akkoord Beeldbeleid',
    Attribute: 'custom:image_consent_2',
    Description: 'Voor meer informatie, ga naar <..>',
  }),
]);

const userUpdateAttributeConfig = basicAttributeConfig.extend([
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
  userReadAttributeConfig, userUpdateAttributeConfig, adminCreateUserAttributeConfig,
  adminUpdateUserAttributeConfig, adminReadUserAttributeConfig,
};
