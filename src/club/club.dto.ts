import { IsNotEmpty, IsString, IsUrl } from 'class-validator';
import { isDate } from 'util/types';
export class ClubDto {

    @IsString()
    @IsNotEmpty()
    readonly nombre: string;

    @IsNotEmpty()
    readonly fechaFundacion: Date;

    @IsUrl()
    @IsNotEmpty()
    readonly imagen: string;

    @IsString()
    @IsNotEmpty()
    readonly descripcion: string;
}