import { TextAttribute, BooleanAttribute } from '../src/attributes';

const attributeConfig = [
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

export default attributeConfig;