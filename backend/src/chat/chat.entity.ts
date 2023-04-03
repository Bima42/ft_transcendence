import { ApiProperty } from '@nestjs/swagger'
import { Chat, ChatType } from '@prisma/client'
import { Exclude } from 'class-transformer'


export class ChatEntity implements Chat {

  constructor(partial: Partial<ChatEntity>) {
    Object.assign(this, partial);
  }

  @ApiProperty()
  id: number

  @ApiProperty()
  type: ChatType

  @ApiProperty({ nullable: true })
  name: string | null

  @Exclude()
  password: string | null

  @ApiProperty()
  createdAt: Date

  @ApiProperty()
  updatedAt: Date


}
