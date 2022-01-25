import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Divider, Modal, Select, Table, Input, Button,
} from 'antd';

import Icon from '@ant-design/icons';
import 'antd/dist/antd.css';

import { ColumnsType } from 'antd/lib/table';
import UserDetails from '../admin-components/UserDetails';
import UserAdapter, { User } from '../../adapters/users/UserAdapter';
import CognitoUserAdapter from '../../adapters/users/CognitoUserAdapter';
import UserPoolUser from './UserPoolConfigData';
import AdminConfig from '../../config/adminConfig';

const { Search } = Input;

interface UserPoolState {
  users: UserPoolUser[] | undefined,
  pools: Record<string, UserAdapter>,
  searchAttribute: string | null,
  activeUserPool: UserAdapter | null,
  userSelected: boolean,
  selectedUser: User | null,
  modelTitle: string,
}

export function UserPool() {
  const [state, setState] = useState<UserPoolState>({
    users: [],
    pools: {},
    searchAttribute: '',
    activeUserPool: null,
    userSelected: false,
    selectedUser: null,
    modelTitle: 'Account bekijken.',
  });

  const fetchUsers = async (userPool: UserAdapter | null, filter?: string) => {
    const users = await userPool?.listUsers(filter) ?? [];
    return users.map((user, index) => ({
      ...user,
      key: index,
      enabled: user.enabled ? 'enabled' : 'disabled',
      status: user.status ?? 'UNKNOWN',
      created: user.created?.toLocaleDateString() ?? '',
      modified: user.created?.toLocaleDateString() ?? '',
    }));
  };

  // componentDidMount
  useEffect(() => {
    CognitoUserAdapter.fetchAllUserpools().then((pools) => {
      setState({ ...state, pools });
    });
  }, []);

  const setEnabled = async (username: string, enabled: boolean) => {
    const { activeUserPool } = state;
    try {
      await activeUserPool?.userSetEnabled(username, enabled);
      const users = await fetchUsers(activeUserPool);
      setState({ ...state, users });
    } catch (e) {
      console.log('ERROR');
    }
  };

  const handleChange = async (userPoolId: string) => {
    const { pools } = state;
    const userPool = pools[userPoolId] ?? null;
    const users = await fetchUsers(userPool);
    setState({ ...state, users, activeUserPool: userPool });
  };

  const poolSelector = () => {
    const { pools, activeUserPool } = state;
    const usablePools = Object.values(pools).filter(
      (pool) => AdminConfig.allowedUserpools.includes(pool.id),
    );

    // If only 1 pool is allowed then instantly set this as the active one.
    if (usablePools.length === 1) {
      if (activeUserPool === null) {
        handleChange(usablePools[0].id);
      }
      return (<></>);
    }

    return (
      <Select
        placeholder="Kies de gebruikersgroep."
        style={{ width: 200, marginBottom: 10 }}
        onChange={handleChange}
      >
        {Object.values(usablePools).map((pool) => (
          <Select key={pool.id} value={pool.id}>
            {pool.id}
          </Select>
        ))}
      </Select>
    );
  };

  const createUser = async (e: MouseEvent) => {
    const {
      activeUserPool,
    } = state;
    e.preventDefault();
    if (activeUserPool) {
      setState({
        ...state,
        selectedUser: null,
        userSelected: true,
      });
    }
  };

  const openModal = async (e: MouseEvent, username: string) => {
    const {
      activeUserPool,
    } = state;
    e.preventDefault();
    const user = await activeUserPool?.getUser(username);
    if (user) {
      setState({
        ...state,
        selectedUser: user,
        userSelected: true,
      });
    } else {
      console.log("Can't get user");
    }
  };

  const closeModal = () => {
    setState({
      ...state,
      userSelected: false,
      modelTitle: 'Gebruiker bekijken.',
    });
  };

  const updateModalTitle = (str: string) => {
    setState({
      ...state,
      modelTitle: str,
    });
  };

  const onAttributesUpdate = async () => {
    const { activeUserPool } = state;
    const users = await fetchUsers(activeUserPool);
    setState({
      ...state,
      userSelected: false,
      users,
    });
  };

  const handleSearchAttribute = (searchAttribute:string) => {
    setState({ ...state, searchAttribute });
  };

  const onSearch = async (value:string) => {
    const { searchAttribute, activeUserPool } = state;
    const filterString = `${searchAttribute}^="${value}"`;
    console.log(filterString);
    const users = await fetchUsers(activeUserPool, filterString);

    setState({ ...state, users });
  };

  // These are the columns of the table.
  const columns: ColumnsType<UserPoolUser> = [
    ...AdminConfig.tableFields,
    {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <>
          <span>
            <button type="button" onClick={(e) => openModal(e.nativeEvent, record.username)}> details</button>
          </span>
          <span>
            <Icon
              onClick={(e) => openModal(e.nativeEvent, record.username)}
              style={{ fontSize: 21, color: '#888' }}
              type="edit"
            />
            <Divider type="vertical" />
            <Icon
              onClick={() => {
                setEnabled(record.username, record.enabled !== 'enabled');
              }}
              style={{ fontSize: 21 }}
              type={record.enabled === 'enabled' ? 'lock' : 'unlock'}
            />
          </span>
        </>
      ),
    },
  ];

  const {
    users, selectedUser, userSelected, activeUserPool, modelTitle,
  } = state;

  return (
    <div>

      <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>

        <div className="row">
          {poolSelector()}
          <Select
            placeholder="Zoekveld"
            style={{ width: 200, marginBottom: 10 }}
            onChange={handleSearchAttribute}
          >
            {AdminConfig.searchFields}
          </Select>
          <Search placeholder="Zoek" allowClear onSearch={onSearch} style={{ width: 200 }} />
          <Button type="primary" onClick={(e) => createUser(e.nativeEvent)}>
            Maak account aan.
          </Button>

          <Link to="/">
            <Button>
              Annuleren
            </Button>
          </Link>
        </div>

        <Table pagination={false} columns={columns} dataSource={users} />
        <Modal
          title={modelTitle}
          destroyOnClose
          visible={userSelected}
          onCancel={closeModal}
          footer={null}
        >
          { activeUserPool && (
            <UserDetails
              userPool={activeUserPool}
              user={selectedUser}
              onAttributesUpdate={onAttributesUpdate}
              modelTitleUpdate={updateModalTitle}
            />
          ) }
        </Modal>
      </div>
    </div>
  );
}

export default UserPool;
