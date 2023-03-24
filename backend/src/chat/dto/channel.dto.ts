import { IsNotEmpty, IsEnum, IsOptional } from 'class-validator';
import { ChatType } from '@prisma/client';


export class NewChannelDto {
  @IsNotEmpty()
	name: string;

  @IsEnum(ChatType)
  type: ChatType;

  @IsOptional()
  @IsNotEmpty()
  password?: string;
}

export class DetailedChannelDto {
	id: number;
	name: string;
	createdAt: Date;
	updatedAt: Date;
	users: any; // FIXME TYR: Should be a Dto ?

}
