import React, { Component } from 'react';
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

export class UserPool extends Component<{}, UserPoolState> {
  constructor(props: any) {
    super(props);
    this.state = {
      users: [],
      pools: [],
      attributes: ['name', 'email'],
      searchAttribute: '',
      activeUserPool: null,
      userSelected: false,
      selectedUser: null,
      modelTitle: 'Account bekijken.',
    };
  }

  async componentDidMount() {
    Cognito.client().send(new ListUserPoolsCommand({
      MaxResults: 60,
    })).then((response) => {
      const pools = response.UserPools;
      this.setState({ pools });
    }).catch((err) => console.log('ERROR', err));
  }

  setEnabled = async (username: string, enabled: boolean) => {
    const { activeUserPool } = this.state;
    const params = {
      Username: username,
      UserPoolId: activeUserPool ?? undefined,
    };
    try {
      await Cognito.client().send(enabled
        ? new AdminEnableUserCommand(params)
        : new AdminDisableUserCommand(params));
      const users = await this.fetchUsers(activeUserPool);
      this.setState({ users });
    } catch (e) {
      console.log('ERROR', e);
    }
  };

  /* eslint no-await-in-loop:0 */
  // AWS does not allow you to fetch the entire list at once.
  // So therefore I put a await in a loop to iterate through the entire user pool.
  // This is going to be slow as the list goes toward 1000 users.
  fetchUsers = async (userPoolId: string | null, filter:string | undefined = undefined) => {
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
      attributes: this.flushAttributes(user.Attributes),
      username: user.Username,
      created: user.UserCreateDate,
      status: user.UserStatus,
      modified: user.UserLastModifiedDate,
      enabled: user.Enabled ? 'enabled' : 'disabled',
    }));
  };

  flushAttributes = (attributes:Attribute[]) => {
    const flushedAttributes:any = {};
    attributes.forEach((attribute:Attribute) => {
      flushedAttributes[attribute.Name] = attribute.Value;
    });
    return flushedAttributes;
  };

  handleChange = async (userPoolId: any) => {
    const users = await this.fetchUsers(userPoolId);
    console.log(users[0]);
    this.setState({ users, activeUserPool: userPoolId });
  };

  openModal = async (e: MouseEvent, username: string) => {
    const {
      activeUserPool,
    } = this.state;
    e.preventDefault();
    if (username === 'create-user') {
      if (activeUserPool) {
        this.setState({
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

        this.setState({
          selectedUser: tempuser,
          userSelected: true,
        });
      } catch (err) {
        console.log("Can't get user: ", err);
      }
    }
  };

  closeModal = () => {
    this.setState({
      userSelected: false,
      modelTitle: 'Gebruiker bekijken.',
    });
  };

  updateModalTitle = (str:String) => {
    this.setState({
      modelTitle: str,
    });
  };

  onAttributesUpdate = async () => {
    const { activeUserPool } = this.state;
    const users = await this.fetchUsers(activeUserPool);
    this.setState({
      userSelected: false,
      users,
    });
  };

  handleSearchAttribute = (searchAttribute:string) => {
    this.setState({ searchAttribute });
  };

  onSearch = async (value:string) => {
    const { searchAttribute, activeUserPool } = this.state;
    const filterString = `${searchAttribute}^="${value}"`;
    console.log(filterString);
    const users = await this.fetchUsers(activeUserPool, filterString);

    this.setState({ users });
  };

  render() {
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
              <button type="button" onClick={(e) => this.openModal(e.nativeEvent, record.username)}> details</button>
            </span>
            <span>
              <Icon
                onClick={(e) => this.openModal(e.nativeEvent, record.username)}
                style={{ fontSize: 21, color: '#888' }}
                type="edit"
              />
              <Divider type="vertical" />
              <Icon
                onClick={() => {
                  this.setEnabled(record.username, record.enabled !== 'enabled');
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
    } = this.state;
    return (
      <div>

        <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>

          <div className="row">
            <Select
              placeholder="Select User Pool"
              style={{ width: 200, marginBottom: 10 }}
              onChange={this.handleChange}
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
              onChange={this.handleSearchAttribute}
            >
              {attributes?.map((attribute:string) => (
                <Option
                  key={attribute ?? ''}
                  value={attribute ?? ''}
                >{attribute}
                </Option>
              ))}
            </Select>
            <Search placeholder="input search text" allowClear onSearch={this.onSearch} style={{ width: 200 }} />
            <Button type="primary" onClick={(e) => this.openModal(e.nativeEvent, 'create-user')}>
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
            onCancel={this.closeModal}
            footer={null}
          >
            <UserCRUD
              userPoolId={activeUserPool}
              user={selectedUser}
              onAttributesUpdate={this.onAttributesUpdate}
              modelTitleUpdate={this.updateModalTitle}
            />
          </Modal>
        </div>
      </div>
    );
  }
}

export default UserPool;
