export default eventHandler(async (event) => {
  const queryColumns = [
    tables.users.firstName,
    tables.users.lastName,
    tables.users.email
  ];

  const sortColumns = {
    name: tables.users.lastName,
    created: tables.users.createdAt,
    lastAccess: tables.users.lastAccess
  };

  return getQueryData<User[]>(event, tables.users, queryColumns, sortColumns);
});
