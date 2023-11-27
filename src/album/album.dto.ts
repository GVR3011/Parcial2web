import {IsNotEmpty, IsString, IsUrl} from 'class-validator';
export class AlbumDto {

 @IsString()
 @IsNotEmpty()
 readonly nombre: string;
 
 @IsUrl()
 @IsNotEmpty()
 readonly caratula: string;
 
 @IsString()
 @IsNotEmpty()
 readonly descripcion: string;
}