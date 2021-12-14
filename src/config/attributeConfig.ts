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
    Attribute: 'image_consent',
    Description: 'Voor meer informatie, ga naar <..>',
  }),
];

const createUserAttributeConfig = [
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
];

export { userAttributeConfig, createUserAttributeConfig };
