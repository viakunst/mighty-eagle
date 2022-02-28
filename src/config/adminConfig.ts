import {
  modifiedColumn, createdColumn, attributeColumn,
  statusColumn, searchField,
} from '../components/user-pools/UserPoolConfigData';

const localAdminConfig = {
  allowedUserpools: ['ViaKunst Accounts', 'Testing'],
  tableFields: [
    attributeColumn('E-mail', 'email'),
    attributeColumn('Naam', 'name'),
    attributeColumn('Beeldbeleid', 'custom:image_consent'),
    statusColumn(),
    createdColumn(),
    modifiedColumn(),
    // enabledColumn(),
  ],
  searchFields: [
    searchField('E-mail', 'email'),
    searchField('Naam', 'name'),
  ],
};

export default localAdminConfig;
