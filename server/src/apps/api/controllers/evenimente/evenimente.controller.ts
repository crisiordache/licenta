import {
  Body,
  Controller,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { CreateEvenimentDTO } from 'src/libs/dto/evenimente/eveniment.dto';
import { Eveniment } from 'src/libs/entities/evenimente/eveniment.entity';
import { EvenimenteService } from 'src/libs/repositories/evenimente/eveniment.service';
import { Roluri } from '../auth/decorators/roluri.decorator';
import { RolUtilizator } from 'src/libs/entities/utilizatori/utilizator.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('evenimente')
export class EvenimenteController {
  constructor(private evenimenteService: EvenimenteService) {}

  @Get()
  findAll(): Promise<Eveniment[]> {
    return this.evenimenteService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Eveniment | null> {
    return this.evenimenteService.findOne(+id);
  }

  @Roluri(RolUtilizator.ADMIN)
  @Post()
  @UseInterceptors(
    FileInterceptor('poster', {
      storage: diskStorage({
        destination: './uploads/posters',
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
        },
      }),
      fileFilter: (req, file, callback) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
          return callback(new Error('Only image files are allowed!'), false);
        }
        callback(null, true);
      },
    }),
  )
  async create(
    @Body() body: CreateEvenimentDTO,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 5 }),
          new FileTypeValidator({ fileType: /image\/(jpeg|png|gif)/ }),
        ],
        fileIsRequired: false,
      }),
    )
    posterFile: Express.Multer.File,
  ) {
    const createEvenimentDto: CreateEvenimentDTO = {
      ...body,
      poster: posterFile?.path ?? '',
    };

    return this.evenimenteService.create(createEvenimentDto);
  }
}
