import {
    Body,
    Controller,
    Delete,
    Post,
    Param,
    UseGuards,
    Request,
    UseInterceptors,
    UploadedFiles
} from "@nestjs/common";
import {ConnectionsService} from "./connections.service";
import {AuthGuard} from "../auth/auth.guard";
import {FilesInterceptor} from "@nestjs/platform-express";
import {diskStorage} from "multer";
import {extname} from "path";
import * as process from "process";

@Controller('connections')
export class ConnectionsController {
    constructor(
        private readonly connectionsService: ConnectionsService,
    ) {}

    @Post(':id')
    @UseGuards(AuthGuard)
    async createConnection(@Request() req, @Param('id') id : number) {
        try {
            console.log("wrjskjgskg,,,,")
            await this.connectionsService.createConnection(req.user.sub, id);

            return { success: true, message: 'Повідомлення відправлено' };
        } catch (error) {
            return { success: false, message: 'Помилка відправлення повідомлення', error: error.message };
        }
    }

    @Post('/messages/:id')
    @UseGuards(AuthGuard)
    @UseInterceptors(
        FilesInterceptor('photos', 10, {
            storage: diskStorage({
                destination: './uploads',
                filename: (req, file, cb) => {
                    const randomName = Array(32)
                        .fill(null)
                        .map(() => Math.round(Math.random() * 16).toString(16))
                        .join('');
                    return cb(null, `${randomName}${extname(file.originalname)}`);
                },
            }),
            preservePath: false,
        }),
    )
    async sendMessage(@Param('id') connectionId : number,@Body() messageDto: { text : string }, @Request() req, @UploadedFiles() photos: Express.Multer.File[]) {
        try {
            await this.connectionsService.sendMessage(connectionId, req.user.sub, messageDto, photos);
            console.log(photos)
            return { success: true, message: 'Повідомлення відправлено' };
        } catch (error) {
            return { success: false, message: 'Помилка відправлення повідомлення', error: error.message };
        }
    }
}