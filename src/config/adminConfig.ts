import {
  modifiedColumn, createdColumn, attributeColumn,
  statusColumn, enabledColumn, searchField,
} from '../components/user-pools/UserPoolConfigData';

const localAdminConfig = {
  allowedUserpools: ['Testing'],
  tableFields: [
    attributeColumn('E-mail', 'email'),
    attributeColumn('Naam', 'name'),
    statusColumn(),
    createdColumn(),
    modifiedColumn(),
    enabledColumn(),
  ],
  searchFields: [
    searchField('E-mail', 'email'),
    searchField('Naam', 'name'),
  ],
};

export default localAdminConfig;
