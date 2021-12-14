import { TextAttribute, BooleanAttribute } from '../attributes';

const userAttributeConfig = [
  // Name is the attribute primary key.
  // These need to be unique for each attribute therefore.
  TextAttribute({
    Name: 'E-mail',
    Attribute: 'email',
  }),
  TextAttribute({
    Name: 'Voornaam',
    Attribute: 'given_name',
  }),
  TextAttribute({
    Name: 'Achternaam',
    Attribute: 'family_name',
  }),
  BooleanAttribute({
    Name: 'Akkoord Beeldbeleid',
    Attribute: 'custom:image_consent_2',
    Description: 'Voor meer informatie, ga naar <..>',
  }),
];

// Basic create user. contains all field initially given.
const createUserAttributeConfig = [
  TextAttribute({
    Name: 'E-mail',
    Attribute: 'email',
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
  TextAttribute({
    Name: 'Telefoonnummer',
    Attribute: 'phone_number',
  }),
];

export { userAttributeConfig, createUserAttributeConfig };
