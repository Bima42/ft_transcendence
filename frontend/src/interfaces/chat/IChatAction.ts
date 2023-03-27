
export default interface IChatAction {
	chatId: number
  type: string
  username: string
  muteDuration: number | null
}
