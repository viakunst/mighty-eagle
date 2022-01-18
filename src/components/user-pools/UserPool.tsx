import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Divider, Modal, Select, Table, Input, Button,
} from 'antd';

import Icon from '@ant-design/icons';
import 'antd/dist/antd.css';

import { ColumnsType } from 'antd/lib/table';
import UserDetails from '../admin-components/UserDetails';
import UserAdapter, { User, UserAttributes } from '../../adapters/users/UserAdapter';
import CognitoUserAdapter from '../../adapters/users/CognitoUserAdapter';

const { Option } = Select;

const { Search } = Input;

interface UserPoolUser {
  username: string,
  userAttributes: UserAttributes,
  status: string,
  created: string,
  modified: string,
  enabled: string
}

interface UserPoolState {
  users: UserPoolUser[] | undefined,
  pools: Record<string, UserAdapter>,
  attributes: any | undefined,
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
    attributes: ['name', 'email'],
    searchAttribute: '',
    activeUserPool: null,
    userSelected: false,
    selectedUser: null,
    modelTitle: 'Account bekijken.',
  });

  // componentDidMount
  useEffect(() => {
    CognitoUserAdapter.fetchAll().then((pools) => setState({ ...state, pools }));
  }, []);

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
    const users = await fetchUsers(activeUserPool, filterString);

    setState({ ...state, users });
  };

  const columns: ColumnsType<UserPoolUser> = [
    {
      title: 'Naam',
      dataIndex: ['userAttributes', 'name'],
      key: 'name',
      sorter: (a, b) => a.userAttributes.name?.localeCompare(b.userAttributes.name ?? '') ?? 0,
      sortDirections: ['ascend', 'descend'],
    },
    {
      title: 'Email',
      dataIndex: ['userAttributes', 'email'],
      key: 'email',
      sorter: (a, b) => a.userAttributes.email?.localeCompare(b.userAttributes.email ?? '') ?? 0,
      sortDirections: ['ascend', 'descend'],
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      filters: [
        {
          text: 'CONFIRMED',
          value: 'CONFIRMED',
        },
        {
          text: 'RESET_REQUIRED',
          value: 'RESET_REQUIRED',
        },
      ],
      onFilter: (value, record) => (typeof value === 'string' ? record.status.indexOf(value) === 0 : false),
      sorter: (a, b) => a.status.localeCompare(b.status),
      sortDirections: ['ascend', 'descend'],
    },
    {
      title: 'Created',
      dataIndex: 'created',
      key: 'created',
      // sorter: (a, b) => a.created.localeCompare(b.created),
      // sortDirections: ['ascend', 'descend'],
    },
    {
      title: 'Modified',
      dataIndex: 'modified',
      key: 'modified',
      // sorter: (a, b) => a.modified.localeCompare(b.modified),
      // sortDirections: ['ascend', 'descend'],
    },
    {
      title: 'Enabled',
      dataIndex: 'enabled',
      key: 'enabled',
      sorter: (a, b) => a.enabled.localeCompare(b.enabled),
      sortDirections: ['ascend', 'descend'],
    },
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
    pools, attributes, users, selectedUser, userSelected, activeUserPool, modelTitle,
  } = state;

  return (
    <div>

      <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>

        <div className="row">
          <Select
            placeholder="Select User Pool"
            style={{ width: 200, marginBottom: 10 }}
            onChange={handleChange}
          >
            {Object.values(pools).map((pool) => (
              <Option key={pool.id} value={pool.id}>{pool.id}
              </Option>
            ))}
          </Select>
          <Select
            placeholder="Select search"
            style={{ width: 200, marginBottom: 10 }}
            onChange={handleSearchAttribute}
          >
            {attributes?.map((attribute:string) => (
              <Option
                key={attribute ?? ''}
                value={attribute ?? ''}
              >{attribute}
              </Option>
            ))}
          </Select>
          <Search placeholder="input search text" allowClear onSearch={onSearch} style={{ width: 200 }} />
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
