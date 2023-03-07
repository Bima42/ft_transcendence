export class NewChannelDto {
	name: string;
	// type: string;
}

export class DetailedChannelDto {
	id: number;
	name: string;
	createdAt: Date;
	updatedAt: Date;
	users: any; // FIXME TYR: Should be a Dto ?

}
