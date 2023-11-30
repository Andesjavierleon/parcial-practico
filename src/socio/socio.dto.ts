import { IsNotEmpty, IsString, IsUrl } from 'class-validator';
import { isDate } from 'util/types';
export class SocioDto {

    @IsString()
    @IsNotEmpty()
    readonly nombreUsuario: string;

    @IsNotEmpty()
    readonly correoElectronico: string;

    @IsNotEmpty()
    readonly fechaNacimiento: Date;
}