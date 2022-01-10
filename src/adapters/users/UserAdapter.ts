export default interface UserAdapter {
  update: (userData: any, attributes: any) => Promise<boolean>
}
