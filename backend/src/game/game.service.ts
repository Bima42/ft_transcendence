import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class GameService {
    constructor(
    ) {}

    helloWorld() {
        Logger.log("Hello game world !")
    }
};
