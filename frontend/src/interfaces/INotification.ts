export default interface INotification {
	message: string;
	lifespan: number;
	picture?: string;
	title?: string;
	redirect?: () => void;
}