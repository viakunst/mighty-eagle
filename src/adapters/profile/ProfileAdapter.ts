export default interface ProfileAdapter {
  update: (userData: any, attributes: any) => Promise<boolean>
}
