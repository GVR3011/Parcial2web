import { PerformerEntity } from '../performer/performer.entity';
import { TrackEntity } from '../track/track.entity';
import { JoinTable, OneToMany, Column, Entity, PrimaryGeneratedColumn, ManyToMany } from 'typeorm';

@Entity()
export class AlbumEntity {
 @PrimaryGeneratedColumn('uuid')
 id: string;

 @Column()
 nombre: string;
 
 @Column()
 caratula: string;
 
 @Column()
 fecha: Date;
 
 @Column()
 descripcion: string;

 @OneToMany(() => TrackEntity, track => track.album)
 tracks: TrackEntity[];

 @ManyToMany(() => PerformerEntity, performer => performer.albums)
 @JoinTable()
 performers: PerformerEntity[];

}