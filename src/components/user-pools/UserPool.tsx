import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Divider, Modal, Select, Table, Input, Button,
} from 'antd';

import Icon from '@ant-design/icons';
import 'antd/dist/antd.css';

import {
  AdminEnableUserCommand,
  AdminDisableUserCommand,
  ListUserPoolsCommand,
  ListUsersCommand,
  AdminGetUserCommand,
  UserPoolDescriptionType,
  UserType,
} from '@aws-sdk/client-cognito-identity-provider';

import { ColumnsType } from 'antd/lib/table';
import UserCRUD from '../admin-components/AdminCRUD';
import Cognito from '../../services/cognito';

const { Option } = Select;

const { Search } = Input;

interface UserPoolUser {
  username: any, attributes:any, status: any, created: any, modified: any, enabled: any
}

interface Attribute {
  Name:string, Value:string
}

interface UserPoolState {
  users: UserPoolUser[] | undefined,
  pools: UserPoolDescriptionType[] | undefined,
  attributes: any | undefined,
  searchAttribute: string | null,
  activeUserPool: string | null,
  userSelected: boolean,
  selectedUser: UserType | null,
  modelTitle: String,
}

export function UserPool() {
  const [state, setState] = useState<UserPoolState>({
    users: [],
    pools: [],
    attributes: ['name', 'email'],
    searchAttribute: '',
    activeUserPool: null,
    userSelected: false,
    selectedUser: null,
    modelTitle: 'Account bekijken.',
  });

  // componentDidMount
  useEffect(() => {
    Cognito.client().send(new ListUserPoolsCommand({
      MaxResults: 60,
    })).then((response) => {
      const pools = response.UserPools;
      setState({ ...state, pools });
    }).catch((err) => console.log('ERROR', err));
  }, []);

  const flushAttributes = (attributes:Attribute[]) => {
    const flushedAttributes:any = {};
    attributes.forEach((attribute:Attribute) => {
      flushedAttributes[attribute.Name] = attribute.Value;
    });
    return flushedAttributes;
  };

  /* eslint no-await-in-loop:0 */
  // AWS does not allow you to fetch the entire list at once.
  // So therefore I put a await in a loop to iterate through the entire user pool.
  // This is going to be slow as the list goes toward 1000 users.
  const fetchUsers = async (userPoolId: string | null, filter:string | undefined = undefined) => {
    let users:any = [];
    let response = await Cognito.client().send(new ListUsersCommand({
      UserPoolId: userPoolId ?? undefined,
      Filter: filter,
    }));

    users = users.concat(response.Users);
    while (response.PaginationToken) {
      response = await Cognito.client().send(new ListUsersCommand({
        UserPoolId: userPoolId ?? undefined,
        Filter: filter,
        PaginationToken: response.PaginationToken,
      }));
      users = users.concat(response.Users);
    }

    return users.map((user:any, index:any) => ({
      key: index,
      attributes: flushAttributes(user.Attributes),
      username: user.Username,
      created: user.UserCreateDate,
      status: user.UserStatus,
      modified: user.UserLastModifiedDate,
      enabled: user.Enabled ? 'enabled' : 'disabled',
    }));
  };

  const setEnabled = async (username: string, enabled: boolean) => {
    const { activeUserPool } = state;
    const params = {
      Username: username,
      UserPoolId: activeUserPool ?? undefined,
    };
    try {
      await Cognito.client().send(enabled
        ? new AdminEnableUserCommand(params)
        : new AdminDisableUserCommand(params));
      const users = await fetchUsers(activeUserPool);
      setState({ ...state, users });
    } catch (e) {
      console.log('ERROR', e);
    }
  };

  const handleChange = async (userPoolId: any) => {
    const users = await fetchUsers(userPoolId);
    console.log(users[0]);
    setState({ ...state, users, activeUserPool: userPoolId });
  };

  const openModal = async (e: MouseEvent, username: string) => {
    const {
      activeUserPool,
    } = state;
    e.preventDefault();
    if (username === 'create-user') {
      if (activeUserPool) {
        setState({
          ...state,
          selectedUser: null,
          userSelected: true,
        });
      }
    } else {
      try {
        const response = await Cognito.client().send(new AdminGetUserCommand({
          UserPoolId: activeUserPool ?? undefined,
          Username: username,
        }));
        console.log(response);

        const tempuser:UserType = response;
        tempuser.Attributes = response.UserAttributes;
        console.log(tempuser);

        setState({
          ...state,
          selectedUser: tempuser,
          userSelected: true,
        });
      } catch (err) {
        console.log("Can't get user: ", err);
      }
    }
  };

  const closeModal = () => {
    setState({
      ...state,
      userSelected: false,
      modelTitle: 'Gebruiker bekijken.',
    });
  };

  const updateModalTitle = (str: String) => {
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

  const columns: ColumnsType<UserPoolUser> = [
    {
      title: 'Naam',
      dataIndex: ['attributes', 'name'],
      key: 'name',
      sorter: (a, b) => a.attributes.name.localeCompare(b.attributes.name),
      sortDirections: ['ascend', 'descend'],
    },
    {
      title: 'Email',
      dataIndex: ['attributes', 'email'],
      key: 'email',
      sorter: (a, b) => a.attributes.email.localeCompare(b.attributes.email),
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
      onFilter: (value, record) => record.status.indexOf(value) === 0,
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
            {pools?.map((pool) => (
              <Option
                key={pool.Id ?? ''}
                value={pool.Id ?? ''}
              >{pool.Name}
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
          <Button type="primary" onClick={(e) => openModal(e.nativeEvent, 'create-user')}>
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
          <UserCRUD
            userPoolId={activeUserPool}
            user={selectedUser}
            onAttributesUpdate={onAttributesUpdate}
            modelTitleUpdate={updateModalTitle}
          />
        </Modal>
      </div>
    </div>
  );
}

export default UserPool;
